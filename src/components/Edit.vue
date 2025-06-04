<template>
  <div class="container">
    <el-input
        v-model="inputs.realName"
        placeholder="请输入昵称"
        class="input"
    >
      <template #prepend>昵称</template>
    </el-input>
  </div>

  <div class="container">
    <el-input
        v-model="inputs.phone"
        placeholder="请输入电话号码"
        class="input"
    >
      <template #prepend>电话号码</template>
    </el-input>
  </div>

  <div class="container">
    <el-input
        v-model="inputs.address"
        placeholder="请输入地址"
        class="input"
    >
      <template #prepend>地址</template>
    </el-input>
  </div>

  <div class="container">
    <el-input
        v-model="inputs.ID"
        placeholder="请输入身份证号"
        class="input"
    >
      <template #prepend>身份证</template>
    </el-input>
  </div>

  <div class="container">
    <el-input
        v-model="inputs.selfIntroduction"
        placeholder="请输入个人简介"
        class="input"
    >
      <template #prepend>个人简介</template>
    </el-input>
  </div>

<!--  <div class="container">-->
<!--    <el-input-->
<!--        v-model="inputs.messageBoard"-->
<!--        size="large"-->
<!--        placeholder="请输入留言"-->
<!--        class="input"-->
<!--    >-->
<!--      <template #prepend>留言板</template>-->
<!--    </el-input>-->
<!--  </div>-->

  <div class="button-container">
    <el-button type="primary" @click="submitData">确认修改</el-button>
  </div>
</template>

<style scoped>
.input {
  height: 100px;
  width: 1000px;
}
.container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}
.button-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  margin-top: 20px;
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import axios from 'axios';

// 创建 router 实例
const router = useRouter();

// 定义输入框的数据
const inputs = reactive({
  realName: '',
  phone: '',
  address: '',
  ID: '',
  selfIntroduction: '',
  // messageBoard: ''
});

// 从本地存储获取 username
let username = localStorage.getItem('username') || '';

// 提交数据的方法
const submitData = () => {
  // 验证输入是否为空
  if (!inputs.realName || !inputs.phone || !inputs.address || !inputs.ID|| !inputs.selfIntroduction ) {
    ElMessage.error('所有字段都必须填写！');
    return;
  }

  // 构建数据对象
  const data = {
    realName: inputs.realName,
    phone: inputs.phone,
    address: inputs.address,
    ID: inputs.ID,
    selfIntroduction: inputs.selfIntroduction,
    messageBoard: inputs.messageBoard
  };

  // 发送 PUT 请求
  axios.put(`/place/user/${username}`, data)
      .then(response => {
        if (response.data.code === 200) {
          ElMessage.success('修改成功！');
          router.push('/profile');
        } else {
          ElMessage.error('修改失败，请稍后再试！');
        }
      })
      .catch(error => {
        ElMessage.error('请求失败，请检查网络连接！');
        console.error('请求失败:', error);
      });
};
</script>
