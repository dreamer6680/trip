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
        <el-button type="primary" @click="timetable">我的行程</el-button>
      </div>


      <div class="content">
        <h3>我的游记</h3>
        <el-scrollbar class="journals-section">
          <el-card v-for="journal in journals" :key="journal.id" class="content-box">
            {{ journal.content }}
          </el-card>
        </el-scrollbar>

        <h3>我的问题</h3>
        <el-scrollbar class="questions-section">
          <el-card v-for="question in questions" :key="question.id" class="content-box">
            {{ question.content }}
          </el-card>
        </el-scrollbar>
      </div>
    </div>

    <!-- 底部留言板 -->
    <div class="footer">
      <div class="message-board">
        <h3>留言板</h3>
        <el-scrollbar class="messages-section">
          <el-card v-for="message in messages" :key="message.id" class="content-box">
            {{ message.content }}
          </el-card>
        </el-scrollbar>
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
  width: 30%;
  padding: 10px;
  background-color: #f7f7f7;
}

.content {
  width: 70%;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.el-scrollbar {
  height: 300px;
  margin-bottom: 20px;
}

.content-box {
  margin-bottom: 10px;
}

.footer {
  padding: 10px;
  background-color: #c0c0c0;
}

.message-board {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
    const timetable = () => {
      router.push('/timetable');
    }

    const edit = () => {
      router.push('/edit');
    };

    return {
      username,
      edit,
      timetable
    };
  },
  data() {
    return {
      userInfo: {}, // 用于存储用户信息
      journals: [], // 用于存储游记
      questions: [], // 用于存储问题
      messages: [] // 用于存储留言
    };
  },
  created() {
    this.fetchUserData();
    this.fetchJournals();
    this.fetchQuestions();
    this.fetchMessages();
  },
  methods: {
    fetchUserData() {
// 从本地存储获取 username
      let username = localStorage.getItem('username') || '';

      // 动态构建 API 路径
      axios.get(`/place/user/${username}`,{params: { username: this.username }}) // 假设你的 API 路径格式为 /api/user/:username
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
    },
    fetchJournals() {
      axios.get('/api/journals') // 使用代理请求
          .then(response => {
            this.journals = response.data;
          })
          .catch(error => {
            console.error("获取游记失败:", error);
          });
    },
    fetchQuestions() {
      axios.get('/api/questions') // 使用代理请求
          .then(response => {
            this.questions = response.data;
          })
          .catch(error => {
            console.error("获取问题失败:", error);
          });
    },
    fetchMessages() {
      axios.get('/api/messages') // 使用代理请求
          .then(response => {
            this.messages = response.data;
          })
          .catch(error => {
            console.error("获取留言失败:", error);
          });
    }
  }
};
</script>
