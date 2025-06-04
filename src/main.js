import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import router from '../router/index'; // 确保路径正确

// 导入 ElementPlus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { Buffer } from 'buffer';

globalThis.Buffer = Buffer;
// 创建 Vue 应用
const app = createApp(App);

// 注册 ElementPlus 组件库中的所有图标到全局 Vue 应用中
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

// 将 ElementPlus 插件注册到 Vue 应用中
app.use(ElementPlus, {
    locale: zhCn // 设置 ElementPlus 组件库的区域语言为中文简体
});

// 使用 Vue Router
app.use(router);

// 挂载 Vue 应用
app.mount('#app');
import Page from './components/Page.vue'; // 引入分页器组件
app.component('Page', Page); // 注册分页器组件

