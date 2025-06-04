<template>
  <el-container>
    <!-- 主内容区域 -->
    <el-main style="background-color: #f2f2f2; padding: 20px;">
      <div style="margin: 20px;">
        <!-- 搜索区域 -->
        <el-row :gutter="20" style="margin-bottom: 20px; text-align: center;">
          <el-col :span="24" style="display: flex; justify-content: center;">
            <el-form :model="searchForm" label-width="120px" label-position="right">
              <el-form-item label="出发地">
                <el-input v-model="searchForm.departure" style="width: 400px;"></el-input>
              </el-form-item>
              <el-form-item label="目的地">
                <el-input v-model="searchForm.destination" style="width: 400px;"></el-input>
              </el-form-item>
              <el-form-item label="游玩天数">
                <el-input v-model="searchForm.tourDay" style="width: 400px;"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search">搜索</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <!-- 推荐列表 -->
        <div style="margin-top: 30px;">
          <h3>热门推荐</h3>
          <el-card
              v-for="(item, index) in paginatedRecommendations"
              :key="index"
              :body-style="{ padding: '20px' }"
              shadow="hover"
              style="margin-bottom: 20px;"
          >
            <el-row :gutter="20">
              <el-col :span="6">
                <img :src="item.tourImage" class="recommend-image" />
              </el-col>
              <el-col :span="18">
                <h4>{{ item.tourName }}</h4>
                <p>{{ item.tourBrief }}</p>
                <p style="color: #ff0000;">{{ item.price }}起</p>
                <el-button @click="navigateToDetail(item.tourID)">查看</el-button>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </div>

      <!-- 分页 -->
      <div style="text-align: center; margin-top: 20px;margin-left: 600px;">
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
        departure: '',
        destination: '',
        tourDay: ''
      },
      recommendations: [],            // 所有推荐的数据
      filteredRecommendations: [],     // 根据搜索过滤的数据
      currentPage: 1,                  // 当前页码
      pageSize: 3                      // 每页显示条目数
    };
  },
  computed: {
    // 计算分页后的推荐列表
    paginatedRecommendations() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredRecommendations.slice(start, start + this.pageSize);
    }
  },
  methods: {
    // 搜索功能，过滤数据
    search() {
      this.filteredRecommendations = this.recommendations.filter(item => {
        return (
            (!this.searchForm.departure || item.departure.includes(this.searchForm.departure)) &&
            (!this.searchForm.destination || item.destination.includes(this.searchForm.destination)) &&
            (!this.searchForm.tourDay || item.tourDay.toString() === this.searchForm.tourDay)
        );
      });
      this.currentPage = 1; // 搜索后重置到第一页
    },
    // 分页处理
    handleCurrentChange(page) {
      this.currentPage = page;
    },
    // 获取推荐数据
    async fetchRecommendations() {
      try {
        const response = await axios.get('/place/tour');
        this.recommendations = response.data.data.map(item => ({
          ...item,
          tourImage: '' // 初始化为空值
        }));
        this.filteredRecommendations = this.recommendations;

        // 获取图片数据
        await this.fetchImagesForRecommendations();
      } catch (error) {
        console.error("获取旅游团信息失败:", error);
      }
    },
    // 并行获取图片数据并更新到每个推荐项中
    async fetchImagesForRecommendations() {
      const imageRequests = this.recommendations.map(async (item) => {
        if (item.tourID) {
          try {
            const imageResponse = await axios.get(`/place/tour/${item.tourID}/img`, {
              responseType: 'text' // 获取 Base64 编码数据
            });
            item.tourImage = imageResponse.data; // 更新图片
          } catch (error) {
            console.error(`获取旅游团 ${item.tourID} 图片失败:`, error);
          }
        }
      });

      await Promise.all(imageRequests);
    },
    // 导航到详情页面
    navigateToDetail(tourID) {
      this.$router.push({ path: `/Tourdetail/${tourID}` });
    }
  },
  created() {
    // 在组件创建时获取推荐数据
    this.fetchRecommendations();
  }
};
</script>


<style scoped>
.recommend-image {
  width: 100%;
  height: auto;
}
</style>
