<template>
  <div>
    <header class="header">
      <div class="back-button">
        <button @click="goBack">返回</button>
      </div>
    </header>

    <main class="content">
      <!-- 景点基本信息 -->
      <div class="scenic-info" v-if="scenicData">
        <div class="image-container">
          <img :src="scenicData.placeImage" alt="Scenic Image">
        </div>
        <div class="text-container">
          <h1>{{ scenicData.placeName }}</h1>
          <p>{{ scenicData.placeIntroduction }}</p>
        </div>
      </div>

      <!-- 景点详细信息 -->
      <div class="details-section" v-if="scenicData">
        <h2>详细情况（文化特色/注意事项）</h2>
        <div class="details-content">
          <p>{{ scenicData.placeDetail }}</p>
        </div>
      </div>

      <!-- 景点评价部分 -->
      <div class="ratings-section" v-if="ratings.length > 0">
        <h2>景点评价</h2>
        <div v-for="rating in ratings" :key="rating.ratingId" class="rating-item">
          <p><strong>用户：</strong>{{ rating.userId }}</p>
          <p><strong>评分：</strong>{{ rating.rating }} / 5</p>
          <p><strong>评论：</strong>{{ rating.comment || '暂无评论' }}</p>
          <p><small>{{ rating.ratingTime }}</small></p>
        </div>
      </div>

      <!-- 提交评价 -->
      <div class="submit-rating">
        <h2>提交评价</h2>
        <div>
          <label for="rating">评分：</label>
          <select v-model="newRating" id="rating">
            <option value="1">1 星</option>
            <option value="2">2 星</option>
            <option value="3">3 星</option>
            <option value="4">4 星</option>
            <option value="5">5 星</option>
          </select>
        </div>
        <div>
          <label for="comment">评论：</label>
          <textarea v-model="newComment" id="comment" placeholder="请输入您的评论..."></textarea>
        </div>
        <button @click="submitRating">提交评价</button>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      scenicData: null,
      ratings: [],      // 用于存储景点的所有评价
      newRating: 5,     // 新评价的评分
      newComment: '',   // 新评价的评论内容
      userId: null,     // 当前登录用户ID
    };
  },
  created() {
    this.fetchScenicData();
    this.fetchRatings();  // 获取景点的所有评价
    this.userId = this.$route.params.userId || null; // 假设从路由或其他地方获取当前用户ID
  },
  methods: {
    // 获取景点基本信息
    fetchScenicData() {
      const id = this.$route.params.placeId; // 获取路由中的id参数
      axios.get(`/place/place/${id}`)
          .then(response => {
            if (response.data.code === 200) {
              this.scenicData = response.data.data; // 假设后端返回的数据格式正确
              this.fetchScenicImage(id);
            } else {
              console.error("获取景点数据失败: 状态码", response.data.code);
            }
          })
          .catch(error => {
            console.error('Error fetching scenic data:', error);
          });
    },

    // 获取景点的所有评价
    fetchRatings() {
      const placeId = this.$route.params.placeId; // 获取景点ID
      axios.get(`/place/ratings/place/${placeId}`)
          .then(response => {
            if (response.data.code === 200) {
              this.ratings = response.data.data; // 假设后端返回的数据格式正确
            } else {
              console.error("获取评价失败: 状态码", response.data.code);
            }
          })
          .catch(error => {
            console.error('Error fetching ratings:', error);
          });
    },

    // 提交评价
    submitRating() {
      const placeId = this.$route.params.placeId; // 获取景点ID
      const data = {
        rating: this.newRating,
        comment: this.newComment
      };

      axios.post(`/place/ratings/place/${placeId}`, data)
          .then(response => {
            if (response.data.code === 200) {
              // 提交成功后，清空输入框并重新获取评价数据
              this.newRating = 5;
              this.newComment = '';
              this.fetchRatings();  // 刷新评价列表
            } else {
              console.error("提交评价失败: 状态码", response.data.code);
            }
          })
          .catch(error => {
            console.error('Error submitting rating:', error);
          });
    },

    // 返回上一页
    goBack() {
      this.$router.go(-1);
    },

    // 获取景点图片
    fetchScenicImage(id) {
      axios.get(`/place/place/${id}/img`, { responseType: 'text' })
          .then(imageResponse => {
            this.scenicData.placeImage = imageResponse.data;
          })
          .catch(error => {
            console.error("获取景点图片失败:", error); // 处理错误
          });
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0078d4;
  padding: 10px;
  color: white;
}

.back-button button {
  background: none;
  border: none;
  color: white;
}

.content {
  padding: 20px;
  background-color: white;
  max-width: 1200px;
  margin: 20px auto;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.scenic-info {
  display: flex;
  gap: 20px;
}

.image-container img {
  width: 300px;
  height: 200px;
  border-radius: 8px;
  object-fit: cover;
}

.text-container {
  flex-grow: 1;
}

.text-container h1 {
  margin-bottom: 15px;
  font-size: 24px;
}

.details-section {
  margin-top: 30px;
}

.details-section h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

.details-content {
  background-color: #e0e0e0;
  height: 300px;
  border-radius: 8px;
  padding: 15px;
}

/* 评价部分样式 */
.ratings-section {
  margin-top: 20px;
}

.rating-item {
  background-color: #f9f9f9;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.submit-rating {
  margin-top: 30px;
}

.submit-rating textarea {
  width: 100%;
  height: 100px;
  border-radius: 8px;
  padding: 10px;
}

.submit-rating select {
  width: 100px;
  margin: 10px 0;
}

.submit-rating button {
  padding: 10px 20px;
  background-color: #0078d4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-rating button:hover {
  background-color: #005fa3;
}
</style>
