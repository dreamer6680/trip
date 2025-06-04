<template>
  <div id="app">
    <Top :isLoggedIn="isLoggedIn" @logout="handleLogout" />
    <router-view></router-view>
  </div>
</template>

<script setup>
import Top from './components/Top.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 控制登录状态
const isLoggedIn = ref(false);

// 初始化登录状态
onMounted(() => {
  const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
  if (storedIsLoggedIn === 'true') {
    isLoggedIn.value = true;
  }
});

// 登录成功后的处理
const handleLoginSuccess = () => {
  isLoggedIn.value = true;
  localStorage.setItem('isLoggedIn', 'true');
};

// 注销处理
const handleLogout = () => {
  isLoggedIn.value = false;
  localStorage.removeItem('isLoggedIn');
  router.push('/');
};

// 提供给子组件的登录成功方法
provide('handleLoginSuccess', handleLoginSuccess);
</script>

<style scoped>
/* 你可以在这里添加全局样式 */
</style>
