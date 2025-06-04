<template>
  <el-container>
    <!-- 主内容区域 -->
    <el-main style="background-color: #f2f2f2; padding: 20px;">
      <div style="margin: 20px;">
        <!-- 订单列表 -->
        <div style="margin-top: 30px;">
          <h3>我的行程</h3>

          <!-- 表格展示订单信息 -->
          <el-table
              v-if="orders.length > 0"
              :data="orders"
              border
              style="width: 100%;"
          >
            <el-table-column label="旅游团名称" prop="tourName" width="200"></el-table-column>
            <el-table-column label="出行人" prop="realName" width="180"></el-table-column>
            <el-table-column label="出行时间" prop="startTime" width="300"></el-table-column>
            <el-table-column label="结束时间" prop="endTime" width="300"></el-table-column>
            <el-table-column label="路线" prop="routine" width="500"></el-table-column>
            <el-table-column label="时间提醒" prop="time" width="180"></el-table-column>
          </el-table>

          <!-- 没有订单时显示提示 -->
          <div v-else>
            <p>没有找到订单。</p>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders: [] // 所有订单数据
    };
  },
  methods: {
    // 获取用户订单数据
    async fetchOrders() {
      try {
        const response = await axios.get('/place/order/incomplete-orders');
        if (response.data.code === 200) {
          const orders = response.data.data.map(order => {
            // 获取当前系统时间
            const currentTime = new Date();

            // 将 startTime 转换为 Date 对象（假设 startTime 是 ISO 格式的字符串）
            const startTime = new Date(order.startTime);

            // 计算差值（毫秒）
            const timeDifference = startTime - currentTime;

            // 将毫秒转换为天数
            const daysUntilTravel = Math.ceil(timeDifference / (1000 * 3600 * 24)); // 转换为天数

            return {
              ...order,
              image: '', // 初始化 image 属性为空字符串
              time: daysUntilTravel > 0 ? `还有 ${daysUntilTravel} 天出行` : '出行日期已过'
            };
          });

          // 获取每个订单的图片
          await this.fetchImagesForRecommendations(orders);

          // 更新 orders 数据
          this.orders = orders;
          console.log(orders);
        } else {
          console.error("获取订单信息失败:", response.data);
        }
      } catch (error) {
        console.error("获取订单信息失败:", error);
      }
    },



    // 获取所有订单的图片
    async fetchImagesForRecommendations(orders) {
      const imageRequests = orders.map(async (order) => {
        if (order.tourId) {
          try {
            const imageResponse = await axios.get(`/place/tour/${order.tourId}/img`, {
              responseType: 'text' // 获取 Base64 编码数据
            });
            order.image = imageResponse.data; // 更新图片
          } catch (error) {
            console.error(`获取旅游团 ${order.tourId} 图片失败:`, error);
          }
        }
      });

      // 等待所有图片请求完成
      await Promise.all(imageRequests);
    }
  },

  created() {
    // 页面加载时获取订单数据
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
