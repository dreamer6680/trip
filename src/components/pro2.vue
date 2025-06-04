<template>
  <div class="profile-page">
    <div class="header">
      <h2>个人信息</h2>
    </div>

    <!-- 个人信息和主要内容区域 -->
    <div class="main-section">
      <div class="personal-info-section">
        <div class="personal-info">
          <h3>昵称: {{ userInfo.realName }}</h3>
          <p>电话号码: {{ userInfo.phone }}</p>
          <p>地址: {{ userInfo.address }}</p>
          <p>身份证: {{ userInfo.id }}</p>
        </div>

        <div class="profile-description">
          <h3>个人简介</h3>
          <p>{{ userInfo.selfIntroduction }}</p>
        </div>
        <el-button type="primary" @click="edit">资料编辑</el-button>
      </div>


    </div>
  </div>
</template>

<style scoped>
.profile-page {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
}

.header {
  background-color: #007bff;
  height: 100px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.main-section {
  display: flex;
  flex-grow: 1;
}

.personal-info-section {
  width: 50%;
  padding: 10px;
  background-color: #f7f7f7;
  margin: 0 auto;
}

.personal-info{
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}
</style>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const router = useRouter();
    const username = ref('');

    onMounted(() => {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        username.value = storedUsername;
      }
    });

    const edit = () => {
      router.push('/edit');
    };

    return {
      username,
      edit
    };
  },
  data() {
    return {
      userInfo: {}, // 用于存储用户信息
    };
  },
  created() {
    this.fetchUserData();
  },
  methods: {
    fetchUserData() {
// 从本地存储获取 username
      let username = localStorage.getItem('username') || '';

      // 动态构建 API 路径
      axios.get(`/place/user/${username}`, {params: {username: this.username}}) // 假设你的 API 路径格式为 /api/user/:username
          .then(response => {
            if (response.data.code === 200) {
              this.userInfo = response.data.data;
            } else {
              console.error("获取用户信息失败:", response.data);
            }
          })
          .catch(error => {
            console.error("获取用户信息失败:", error);
          });
    }
  }
};
</script>
