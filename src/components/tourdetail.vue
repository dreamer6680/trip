<template>
  <el-container>
    <!-- 主体内容区域 -->
    <el-main style="padding: 20px;">
      <!-- 产品详情卡片 -->
      <el-card >
        <el-row :gutter="20">
          <!-- 产品图片 -->
          <el-col :span="6">
            <img :src="tourImage" alt="Tour Image" style="width: 100%; height: auto;">
          </el-col>
          <!-- 产品描述 -->
          <el-col :span="18">
            <h2>{{ tourName }}</h2>
            <p>{{ tourBrief }}</p>
            <p><el-tag type="danger">{{ price }}起</el-tag></p>
            <p>浏览量: {{ tourPageView }}</p>
            <el-button type="primary" @click="bookNow(tourID)">立即预定</el-button>
          </el-col>
        </el-row>
      </el-card>

      <!-- 详细信息 -->
      <div v-if="feature || routine || notice" style="margin-top: 20px;">
        <h3>产品特色</h3>
        <p>{{ feature }}</p>

        <h3>每日行程</h3>
        <p>{{ routine }}</p>

        <h3>预订须知</h3>
        <p>{{ notice }}</p>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tourName: '', // 旅游团名称
      tourImage: '', // 图片路径
      tourBrief: '', // 简介
      feature: '', // 产品特色
      routine: '', // 每日行程
      notice: '', // 预订须知
      price: '', // 产品价格
      tourPageView: '', // 浏览量
    };
  },
  methods: {
    goBack() {
      // 返回上一页逻辑
      this.$router.go(-1);
    },

    fetchTourDetails() {
      const id = this.$route.params.tourID; // 获取路由中的id参数
      axios.get(`/place/tour/${id}`)
          .then(response => {
            console.log('Response data:', response.data);
            if (response.data.code === 200) {
              const data = response.data.data; // 假设后端返回的数据格式正确
              this.tourName = data.tourName;
              // this.tourImage = data.tourImage;
              this.tourBrief = data.tourBrief;
              this.feature = data.feature;
              this.routine = data.routine;
              this.notice = data.notice;
              this.price = data.price;
              this.tourPageView = data.tourPageView;

              this.fetchTourImage(id);
              // 强制更新 Vue 组件
              this.$nextTick(() => {
                console.log('Data updated:', this.tourName, this.tourImage, this.tourBrief);
              });
            } else {
              console.error("获取旅游团详情失败: 状态码", response.data.code);
            }
          })
          .catch(error => {
            console.error("获取旅游团详情失败:", error);
          });
    },
    fetchTourImage(id){
      //获取图片的请求
      axios.get(`/place/tour/${id}/img`,{responseType:'text'})
          .then(imageResponse => {
            this.tourImage = imageResponse.data;
          })
          .catch(error =>{
            consloe.error("获取旅游团图片失败:",error);
          });
    },
    // 导航到跟团旅游
    // 在 bookNow 方法中传递 tourID
    bookNow() {
      const tourID = this.$route.params.tourID; // 获取当前组件的 tourID
      console.log('Navigating to Order page with tourID:', tourID);
      this.$router.push({ path: `/makeOrder/${tourID}` });
    }
  },
  created() {
    console.log('Route params:', this.$route.params);
    this.fetchTourDetails(); // 在组件创建时获取数据
  },
};

</script>

<style scoped>
/* 添加一些简单的样式 */
h2 {
  margin: 0;
  font-size: 24px;
}

h3 {
  margin-top: 20px;
  font-size: 20px;
}

p {
  margin: 10px 0;
}
</style>
