<template>
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
  </el-pagination>
</template>

<script setup>
import { ref } from 'vue';

const currentPage = ref(1);
const pageSize = ref(10);
const total = 100; // 假设一共有100条数据

const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`);
  pageSize.value = val;
  // 更新数据
  fetchData(currentPage.value, pageSize.value);
};

const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`);
  currentPage.value = val;
  // 更新数据
  fetchData(currentPage.value, pageSize.value);
};

const fetchData = (page, size) => {
  // 这里应该是一个异步请求，从服务器获取数据
  // 模拟请求
  console.log(`请求第 ${page} 页，每页 ${size} 条数据`);
};
</script>
