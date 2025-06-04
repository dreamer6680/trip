<template>
  <div>
    <img src="/src/assets/主页.jpg" alt="Image Description" class="main-image">
  </div>
  <div class="image-container">
    <el-carousel height="640px">
      <el-carousel-item v-for="(item, index) in images" :key="index">
        <img :src="item.src" alt="Image Description" class="carousel-image">
      </el-carousel-item>
    </el-carousel>
    <div class="color-block left"></div>
    <div class="color-block right"></div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';

// 创建 router 实例
const router = useRouter();

const images = ref([
  { src: '/src/assets/旅游1.jpg' },
  { src: '/src/assets/旅游2.jpg' },
  { src: '/src/assets/旅游3.jpg' }
]);
</script>

<style scoped>.travel-agency {
  font-size: 60px; /* 调整字体大小 */
}
.spaced {
  margin-right: 80px; /* 可以根据需要调整间距大小 */
}
.spaced:last-child {
  margin-right: 0; /* 确保最后一个元素不有多余的右边距 */
}

.main-image {
  width: 100%; /* 图片宽度铺满整个容器 */
  height: 300px; /* 固定高度 */
  display: block;
}

.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 640px; /* 设置固定高度 */
}

.el-carousel {
  width: 70%;
  height: 100%;
}

.carousel-image {
  width: 100%; /* 图片宽度铺满整个容器 */
  height: 100%; /* 图片高度铺满整个容器 */
  object-fit: cover; /* 图片填充整个容器 */
}

.color-block {
  width: 250px; /* 色块的宽度 */
  height: 100%; /* 色块与图片等高 */
  position: absolute;
}

.color-block.left {
  background-color: dodgerblue; /* 左侧色块颜色 */
  left: 0;
}

.color-block.right {
  background-color: dodgerblue; /* 右侧色块颜色 */
  right: 0;
}
</style>
