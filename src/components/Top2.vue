<script setup>
import { reactive, ref } from 'vue'

//默认选中的菜单索引
const selectedIndex = ref("1")

//选中菜单触发的回调
const selected = (index, indexPath) => {
  console.log("index", index, "indexPath", indexPath)
}


function navigateToTravelAgency() {
  window.location.href = 'https://element.eleme.cn/#/zh-CN/component/link';
}

</script>

<template>
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
    >
      驴友交流
    </el-menu-item>
    <el-menu-item
        class="spaced"
        index="5"
        style="background-color: dodgerblue; margin-right: 150px;"
    >
      我的订单
    </el-menu-item>
    <el-menu-item
        class="spaced"
        index="6"
        style="background-color: dodgerblue; margin-right: 50px;"
        @click="showPersoninfo"
    >
      个人信息
    </el-menu-item>
  </el-menu>
</template>

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
