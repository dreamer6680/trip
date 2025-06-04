<template>
  <el-container>
    <!-- 主内容区域 -->
    <el-main style="background-color: #f2f2f2; padding: 20px;">
      <div style="margin: 20px;">
        <!-- 搜索区域 -->
        <el-row :gutter="20" style="margin-bottom: 20px; text-align: center;">
          <el-col :span="24" style="display: flex; justify-content: center;">
            <el-form :model="searchForm" label-width="120px" label-position="right">
              <el-form-item label="搜索内容">
                <el-input v-model="searchForm.keyWord" style="width: 400px;"></el-input>
              </el-form-item>
              <el-form-item label="排序方法">
                <el-select v-model="searchForm.order" style="width: 400px;">
                  <el-option label="按ID顺序" :value="0"></el-option>
                  <el-option label="按热度顺序" :value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search">搜索</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <!-- 热门推荐 -->
        <div style="margin-top: 30px;">
          <h3>热门推荐</h3>
          <el-card
              v-for="(item, index) in paginatedRecommendations"
              :key="index"
              :body-style="{ padding: '20px' }"
              shadow="hover"
              style="margin-bottom: 20px;"
              @click="navigateToDetail(item.placeId)"
          >
            <el-row :gutter="20">
              <el-col :span="6">
                <img :src="item.placeImage" class="recommend-image"  />
              </el-col>
              <el-col :span="18">
                <h4>{{ item.placeName }}</h4>
                <p>{{ item.placeIntroduction }}</p>
                <p style="color: #ff0000;">热度: {{ item.placePageView }}</p>
                <el-button @click.stop="navigateToDetail(item.placeId)">查看</el-button>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </div>

      <!-- 底部分页 -->
      <div style="text-align: center; margin-top: 20px; margin-left: 600px;">
        <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="filteredRecommendations.length"
        />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      searchForm: {
        keyWord: '',
        order: 0
      },
      recommendations: [],
      filteredRecommendations: [],
      currentPage: 1,
      pageSize: 3
    };
  },
  computed: {
    paginatedRecommendations() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredRecommendations.slice(start, start + this.pageSize);
    }
  },
  methods: {
    search() {
      this.fetchScenicSpots();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log('当前页: ', val);
    },
    async fetchScenicSpots() {
      try {
        const response = await axios.get('/place/place', { params: this.searchForm });
        if (response.data.code === 200) {
          this.recommendations = response.data.data;
          this.recommendations = response.data.data.map(spot => ({
            ...spot,
            placeImage: '' // 初始化每个景点的 placeImage 属性
          }));

          // 排序
          if (this.searchForm.order === 1) {
            this.recommendations.sort((a, b) => b.placePageView - a.placePageView);
          } else {
            this.recommendations.sort((a, b) => a.placeId - b.placeId);
          }

          // 关键词过滤
          if (this.searchForm.keyWord) {
            this.filteredRecommendations = this.recommendations.filter(item =>
                item.placeName.includes(this.searchForm.keyWord) ||
                item.placeIntroduction.includes(this.searchForm.keyWord)
            );
          } else {
            this.filteredRecommendations = this.recommendations;
          }

          // 处理图片数据
          await this.fetchPlaceImages(this.filteredRecommendations);
        } else {
          console.error("获取推荐信息失败:", response.data);
        }
      } catch (error) {
        console.error("获取推荐信息失败:", error);
      }
    },

    async fetchPlaceImages(spots) {
      try {
        // 使用 Promise.all 并发获取图片数据
        const imagePromises = spots.map(async (spot) => {
          if (spot.placeId) {
            // 根据实际情况调整 URL，这里假设图片可以通过 placeId 获取
            const imageResponse = await axios.get(`/place/place/${spot.placeId}/img`, {
              responseType: 'text' // 获取二进制数据
            });

            console.log('ImageData:', imageResponse);

            let placeImageUrl = '';

            if (!spot.placeImage) {
              // 处理 Base64 编码的图片数据
              placeImageUrl = imageResponse.data;
              console.log('Generated Base64 Image URL:', placeImageUrl); // 打印生成的 URL
            }

            return {
              ...spot,
              placeImage: placeImageUrl
            };
          }else{
            return spot;
          }
        });

        // 更新推荐数据列表
        this.filteredRecommendations = await Promise.all(imagePromises);
      } catch (error) {
        console.error('获取景点图片失败', error);
      }
    },

    navigateToDetail(placeId) {
      this.$router.push({ path: `/scenic/${placeId}` });
    }
  },

  created() {
    this.fetchScenicSpots();
  }
};
</script>



<style scoped>
.recommend-image {
  width: 100%;
  height: auto;
}
</style>
