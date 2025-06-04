import { createRouter, createWebHistory } from 'vue-router';
import home from '../src/components/home.vue';
import Gentuan from '../src/components/gentuan.vue'; // 根据实际路径修改
import HotPlace from '../src/components/HotPlace.vue';
import Top2 from '../src/components/Top2.vue'; // 确保导入 Top2 组件
import Profile from '../src/components/profile.vue'; // 个人信息页面
import Edit from '../src/components/Edit.vue'; // 个人信息页面
import ScenicDetail from '../src/components/detail.vue';
import Tourdetail from '../src/components/tourdetail.vue';
import makeOrder from '../src/components/makeorder.vue';
import checkOrder from '../src/components/checkorder.vue'
import comunication from '../src/components/post.vue'
import orderdetail from '../src/components/orderdetail.vue'
import submitpost from '../src/components/submitpost.vue'
import timetable from '../src/components/timetable.vue'
import s11 from '../src/components/11.vue'

const routes = [
  { path: '/', component: home }, // 默认路由
  { path: '/gentuan', component: Gentuan },
  { path: '/top2', component: Top2 },
  { path: '/hotplace', component: HotPlace},
  { path: '/profile', component: Profile },
  {path: '/edit',component: Edit},
  {path: '/scenic/:placeId', component: ScenicDetail},
  {path:'/Tourdetail/:tourID',component: Tourdetail},
  {path:'/makeOrder/:tourID',component: makeOrder},
  {path:'/checkOrder',component: checkOrder},
  {path:'/order/:orderID',component: orderdetail},
  {path:'/comunication',component: comunication},
  {path: '/submitpost',component: submitpost},
  {path: '/timetable',component: timetable},
  {path: '/11',component: s11}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
