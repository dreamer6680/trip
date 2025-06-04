<template>
  <div class="tour-group-page">

    <!-- 产品详情卡片 -->
    <el-card>
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
        </el-col>
      </el-row>
    </el-card>

    <!-- 表单 -->
    <el-form class="order-form" label-width="80px" v-if="tourName && tourBrief && price && tourPageView">
      <el-form-item label="姓名：">
        <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="电话：">
        <el-input v-model="form.phone" placeholder="请输入电话"></el-input>
      </el-form-item>
      <el-form-item label="身份证：">
        <el-input v-model="form.idCard" placeholder="请输入身份证号"></el-input>
      </el-form-item>
      <el-form-item label="开始时间：" style="white-space: nowrap;">
        <el-input type="text" v-model="form.startTime" placeholder="请输入开始时间 格式：XXXX-XX-XX"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </el-form>
  </div>
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
      form: { // 初始化表单数据
        name: '',
        phone: '',
        idCard: '',
        startTime:'',
        note: '' // 新增备注字段
      }
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
              this.tourBrief = data.tourBrief;
              this.feature = data.feature;
              this.routine = data.routine;
              this.notice = data.notice;
              this.price = data.price;
              this.tourPageView = data.tourPageView;

              this.fetchTourImage(id);
            } else {
              console.error("获取旅游团详情失败: 状态码", response.data.code);
            }
          })
          .catch(error => {
            console.error("获取旅游团详情失败:", error);
          });
    },

    fetchTourImage(id) {
      // 获取图片的请求
      axios.get(`/place/tour/${id}/img`, {responseType: 'text'})
          .then(imageResponse => {
            this.tourImage = imageResponse.data;
          })
          .catch(error => {
            console.error("获取旅游团图片失败:", error);
          });
    },
    submitForm() {
      const id = this.$route.params.tourID; // 获取路由中的id参数
      axios.post(`/place/tour/orders`, {
        tourId: id,
        realName: this.form.name,
        phone: this.form.phone,
        idCard: this.form.idCard,
        startTime:this.form.startTime,
      })
          .then(response => {
            if (response.data.code === 200) {
              alert('提交成功！');
            } else {
              console.error('提交失败:', response.data.message);
              alert('提交失败，请重试！');
            }
          })
          .catch(error => {
            console.error('提交订单失败:', error);
            alert('提交失败，请检查网络连接！');
          });
    }
  },
  created() {
    console.log('Route params:', this.$route.params);
    this.fetchTourDetails(); // 在组件创建时获取数据
  }
};
</script>

<style scoped>
.tour-group-page {
  padding: 20px;
}


.order-form {
  background-color: #fcefee;
  padding: 20px;
  border: 1px solid #ddd;
}


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
