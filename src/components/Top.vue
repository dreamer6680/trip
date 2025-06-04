<template>
  <div>
    <el-menu
        mode="horizontal"
        :default-active="selectedIndex"
        @select="selected"
        background-color="dodgerblue"
        text-color="white"
        active-text-color="#ffd04b"
        style="height: 80px;"
    >
      <el-menu-item
          class="travel-agency spaced"
          index="1"
          style="background-color: dodgerblue; margin-right: 300px;"
          @click="navigateToHome"
      >
        天行旅行社
      </el-menu-item>
      <el-menu-item
          class="spaced"
          index="2"
          style="background-color: dodgerblue; margin-right: 50px;" @click="goToGentuan"
      >
        跟团旅游
      </el-menu-item>
      <el-menu-item
          class="spaced"
          index="3"
          style="background-color: dodgerblue; margin-right: 50px;" @click="navigateTo"
      >
        旅游景点
      </el-menu-item>
      <el-menu-item
          class="spaced"
          index="4"
          style="background-color: dodgerblue; margin-right: 50px;"
          @click="comunication"
      >
        旅游交流
      </el-menu-item>
      <el-menu-item
          class="spaced"
          index="5"
          style="background-color: dodgerblue; margin-right: 150px;"
          @click="checkorder"
      >
       我的订单
      </el-menu-item>
      <template v-if="!isLoggedIn">
        <el-menu-item
            class="spaced"
            index="6"
            style="background-color: dodgerblue; margin-right: 50px;"
            @click="showLoginDialog"
        >
          登录
        </el-menu-item>
        <el-menu-item
            class="spaced"
            index="7"
            style="background-color: dodgerblue; margin-right: 5px;"
            @click="showRegisterDialog"
        >
          注册
        </el-menu-item>
      </template>
      <template v-else>
        <el-menu-item
            class="spaced"
            index="8"
            style="background-color: dodgerblue; margin-right: 50px;"
            @click="navigateToProfile"
        >
          个人信息
        </el-menu-item>
        <el-menu-item
            class="spaced"
            index="9"
            style="background-color: dodgerblue; margin-right: 50px;"
            @click="handleLogout"
        >
          注销
        </el-menu-item>
      </template>
    </el-menu>

    <!-- 登录对话框 -->
    <el-dialog
        v-model="loginVisible"
        title="登录"
        width="30%"
        @close="handleClose"
    >
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="loginForm.pwd" type="password"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="loginVisible = false">取消</el-button>
          <el-button type="primary" @click="handleLogin">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新增注册对话框 -->
    <el-dialog
        v-model="registerVisible"
        title="注册"
        width="30%"
        @close="handleRegisterClose"
    >
      <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.pwd" type="password"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="registerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRegister">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, inject } from 'vue';
import { ElMessage, ElDialog } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();

// 默认选中的菜单索引
const selectedIndex = ref("1");

// 选中菜单触发的回调
const selected = (index, indexPath) => {
  console.log("index", index, "indexPath", indexPath);
};

// 注册对话框状态
const registerVisible = ref(false);

// 注册表单数据
const registerForm = reactive({
  userName: '',
  pwd: ''
});

// 表单验证规则
const registerRules = reactive({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  pwd: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
});

// 注册表单引用
const registerFormRef = ref(null);

// 显示注册对话框
const showRegisterDialog = () => {
  registerVisible.value = true;
};

// 处理注册
const handleRegister = async () => {
  if (registerFormRef.value) {
    await registerFormRef.value.validate(async valid => {
      if (valid) {
        try {
          const response = await fetch('/place/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerForm),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          if (data.code === 200) {
            ElMessage.success('注册成功');
            registerVisible.value = false;
            // 可以选择自动登录或其他操作
          } else {
            ElMessage.error(data.msg || '注册失败');
          }
        } catch (error) {
          ElMessage.error('注册失败，请检查网络或稍后再试');
          console.error('Error during registration:', error);
        }
      } else {
        ElMessage.error('表单验证失败');
      }
    });
  }
};

// 关闭注册对话框时重置表单
const handleRegisterClose = () => {
  registerFormRef.value.resetFields();
};



// 登录对话框状态
const loginVisible = ref(false);

// 登录状态
const isLoggedIn = inject('isLoggedIn', ref(false));

// 登录表单数据
const loginForm = reactive({
  userName: '',
  pwd: ''
});

// 表单验证规则
const loginRules = reactive({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  pwd: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
});

// 登录表单引用
const loginFormRef = ref(null);

// 显示登录对话框
const showLoginDialog = () => {
  loginVisible.value = true;
};

// 处理登录
const handleLogin = async () => {
  if (loginFormRef.value) {
    await loginFormRef.value.validate(async valid => {
      if (valid) {
        try {
          const response = await fetch('/place/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginForm),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          if (data.code === 200) {
            ElMessage.success('登录成功');
            loginVisible.value = false;
            isLoggedIn.value = true;
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', loginForm.userName); // 存储 username
            handleLoginSuccess();
          } else {
            ElMessage.error(data.msg || '登录失败');
          }
        } catch (error) {
          ElMessage.error('登录失败，请检查网络或稍后再试');
          console.error('Error during login:', error);
        }
      } else {
        ElMessage.error('表单验证失败');
      }
    });
  }
};

// 关闭对话框时重置表单
const handleClose = () => {
  loginFormRef.value.resetFields();
};

// 导航到跟团旅游
const goToGentuan = () => {
  router.push('/gentuan');
};

// 导航到主页
const navigateToHome = () => {
  router.push('/');
};

// 导航到景点
const navigateTo = () => {
  router.push('/hotplace');
};

//导航到订单查询
const checkorder = () => {
  router.push('/checkOrder');
}

//导航到交流
const  comunication = () => {
  router.push('/comunication');
}

// 导航到个人信息页面
const navigateToProfile = () => {
  router.push('/profile');
};

// 注销处理
const handleLogout = () => {
  isLoggedIn.value = false;
  localStorage.removeItem('isLoggedIn');
  router.push('/');
};

// 登录成功后的处理
const handleLoginSuccess = inject('handleLoginSuccess');

// 初始化登录状态
onMounted(() => {
  const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
  if (storedIsLoggedIn === 'true') {
    isLoggedIn.value = true;
  }
});
</script>

<style scoped>
.travel-agency {
  font-size: 60px; /* 调整字体大小 */
}
.spaced {
  margin-right: 80px; /* 可以根据需要调整间距大小 */
}
.spaced:last-child {
  margin-right: 0; /* 确保最后一个元素不有多余的右边距 */
}
</style>
