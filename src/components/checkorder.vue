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
                  <el-option label="按姓名顺序" :value="0"></el-option>
                  <el-option label="按时间顺序" :value="1"></el-option>
                  <el-option label="按订单ID顺序" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search">搜索</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <!-- 订单列表 -->
        <div style="margin-top: 30px;">
          <h3>我的订单</h3>
          <el-card
              v-for="(item, index) in paginatedOrders"
              :key="index"
              :body-style="{ padding: '20px' }"
              shadow="hover"
              style="margin-bottom: 20px;"
              @click="navigateToOrderDetail(item.orderId)"
          >
            <el-row :gutter="20">

              <el-col :span="6">
                <img :src="item.image" class="recommend-image" />
              </el-col>
              <el-col :span="18">
                <h4>{{ item.tourName }}</h4>
                <p>姓名：{{ item.realName }}</p>
                <p>电话：{{ item.phone }}</p>
                <p>订单状态:{{item.orderStatus}}</p>
                <p style="color: #ff0000;">报名时间：{{ item.enrolmentTime }}</p>
              </el-col>
<!--              <el-col>-->
<!--                <el-button-->
<!--                    style="float: left; margin-right: 10px;"-->
<!--                    @click.stop="navigateToOrderDetail(item.orderId)">-->
<!--                  查看详情-->
<!--                </el-button>-->
<!--                <el-button-->
<!--                    style="float: left; margin-right: 10px;"-->
<!--                    @click.stop="navigateToOrderDetail(item.orderId)">-->
<!--                  查看详情-->
<!--                </el-button>-->
<!--              </el-col>-->
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
            :total="filteredOrders.length"
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
      orders: [], // 所有订单数据
      filteredOrders: [], // 经过搜索和排序后的订单数据
      currentPage: 1,
      pageSize: 5
    };
  },
  computed: {
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredOrders.slice(start, start + this.pageSize);
    }
  },
  methods: {
    // 搜索订单
    search() {
      this.fetchOrders();
    },

    // 更新当前页
    handleCurrentChange(val) {
      this.currentPage = val;
    },

// 获取用户订单数据
    async fetchOrders() {
      try {
        const response = await axios.get('/place/order/query', {params: this.searchForm});
        if (response.data.code === 200) {
          this.orders = response.data.data;
          // 先进行关键词过滤
          const filteredOrders = this.filterByKeyword(this.orders);
          // 再进行排序
          const sortedOrders = this.sortOrders(filteredOrders);
          this.filteredOrders = sortedOrders;

          // 提取出符合条件的 item 数组，用于获取图片数据，避免对过滤掉的项发起请求
          const validItems = sortedOrders.map(item => item);
          // 并行获取图片数据
          await this.fetchImagesForRecommendations(validItems);
        } else {
          console.error("获取订单信息失败:", response.data);
          // 可以在这里添加代码给用户提示获取订单失败的消息，比如弹出提示框等
        }
      } catch (error) {
        console.error("获取订单信息失败:", error);
        // 同样可以添加用户提示相关代码
      }
    },

  // 关键词过滤逻辑提取成独立函数，方便维护和复用
    filterByKeyword(orders) {
      if (this.searchForm.keyWord) {
        return orders.filter(order =>
            order.tourName.includes(this.searchForm.keyWord) ||
            order.realName.includes(this.searchForm.keyWord)
        );
      }
      return orders;
    },

    // 排序逻辑提取成独立函数，方便维护和复用
    sortOrders(orders) {
      switch (this.searchForm.order) {
        case 1:
          return orders.sort((a, b) => new Date(b.enrolmentTime) - new Date(a.enrolmentTime));
        case 0:
          return orders.sort((a, b) => a.realName.localeCompare(b.realName));
        default:
          return orders.sort((a, b) => a.orderId - b.orderId);
      }
    },

    // 并行获取图片数据并更新到每个推荐项中，接收包含有效 item 的数组作为参数
    async fetchImagesForRecommendations(items) {
      // 使用 Promise.all 来批量处理异步请求，减少并发请求过多的问题
      await Promise.all(items.map(async item => {
        if (item.tourId) {
          try {
            const imageResponse = await axios.get(`/place/tour/${item.tourId}/img`, {
              responseType: 'text'
            });
            item.image = imageResponse.data;
          } catch (error) {
            console.error(`获取旅游团 ${item.tourId} 图片失败:`, error);
            // 可以在这里添加针对单个图片获取失败的处理逻辑，比如记录日志、给用户提示等
          }
        }
      }));
    },
    navigateToOrderDetail(orderId) {
      this.$router.push({path: `/order/${orderId}`});
    }
  },

  created() {
    this.fetchOrders();
  }
};
</script>

<style scoped>
.recommend-image {
  width: 100%;
  height: auto;
}
</style>
