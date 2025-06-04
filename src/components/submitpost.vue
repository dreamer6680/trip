<template>
  <div>
    <div class="form - container">
      <input type="text" placeholder="填写帖子标题" v - model="postTitle" />
      <input type="text" placeholder="地点：" v - model="location" />
      <textarea placeholder="填写帖子具体内容" v - model="postContent"></textarea>
      <button @click="submitPost">发表帖子</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      postTitle: '',
      location: '',
      postContent: ''
    };
  },
  methods: {
    submitPost() {
      // 这里可以添加提交帖子的逻辑，例如发送数据到后端API
      console.log('提交帖子：', this.postTitle, this.location, this.postContent);
    }
  }
};
</script>

<style scoped>
input,
textarea,
button {
  display: block;
  width: 100%;
  margin-bottom: 10px;
}
button {
  background-color:#007BFF;
  color: white;
  border: none;
  padding: 10px;
}
</style>

