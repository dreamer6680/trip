<template>
  <div id="app">
    <!-- 内容区域 -->
    <div class="content">
      <!-- 搜索与标签 -->
      <div class="search-area">
        <input type="text" placeholder="帖子/问题" v-model="searchQuery" />
        <button @click="searchPosts">搜索</button>
      </div>
      <div class="tab-switch">
        <span
            :class="{ active: currentTab === 'hot-posts' }"
            @click="switchTab('hot-posts')"
        >
          热门帖子
        </span>
        <span
            :class="{ active: currentTab === 'hot-answers' }"
            @click="switchTab('hot-answers')"
        >
          热门问答
        </span>
        <button class="post-button" @click="submitpost">我要发帖</button>
      </div>

      <!-- 列表区域 -->
      <div class="post-list" v-if="currentTab === 'hot-posts'">
        <!-- 如果没有帖子，显示提示 -->
        <div v-if="!currentPosts.length" class="no-posts">没有帖子</div>

        <!-- 帖子卡片 -->
        <div class="post-card" v-for="post in currentPosts" :key="post.postId">
          <div class="post-card-header">
            <img
                class="post-card-image" :src="post.postImage || require('@/assets/主页.jpg')"
                alt="Post Image"
            >
            <div class="post-card-info">
              <h3 class="post-card-title">{{ post.postTitle }}</h3>
              <p class="post-card-user">账号: {{ post.account }}</p>
              <div class="post-card-views">👁️ {{ post.postPageview }}</div>
            </div>
          </div>
          <div class="post-card-content">
            <p>发布时间: {{ post.postTime }}</p>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
        <span v-for="page in paginationButtons" :key="page" @click="goToPage(page)" :class="{ active: currentPage === page }">
          {{ page }}
        </span>
        <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
        <div class="jump-to">
          跳至 <input type="number" v-model="jumpPage" /> 页
          <button @click="jumpToPage">跳转</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  computed: {
    submitpost() {
      this.$router.push({ path: `/submitpost` });
    },

    // 计算分页按钮
    paginationButtons() {
      const buttons = [];
      for (let i = 1; i <= this.totalPages; i++) {
        buttons.push(i);
      }
      return buttons;
    }
  },

  data() {
    return {
      currentTab: 'hot-posts', // 当前选中的标签
      currentPage: 1, // 当前页码
      postsPerPage: 10, // 每页显示的帖子数量
      posts: [], // 用于存储所有的帖子数据
      currentPosts: [], // 当前页的帖子数据
      searchQuery: '', // 用于存储搜索框输入的内容
      totalPages: 0, // 总页数
      jumpPage: '', // 跳转页码输入框
    };
  },

  methods: {
    // 切换标签
    switchTab(tab) {
      this.currentTab = tab;
      this.fetchPosts(); // 每次切换标签时重新获取数据
    },

    // 获取所有帖子数据
    fetchPosts() {
      axios
          .get('/place/posts', { params: { search: this.searchQuery, page: this.currentPage, limit: this.postsPerPage } })
          .then((response) => {
            this.posts = response.data.posts || []; // 确保posts是一个数组
            this.updatePagination(); // 更新分页信息
            this.updateCurrentPagePosts(); // 更新当前页数据
          })
          .catch((error) => {
            console.error('获取数据失败', error);
          });
    },

    // 更新分页信息
    updatePagination() {
      this.totalPages = Math.ceil(this.posts.length / this.postsPerPage); // 计算总页数
    },

    updateCurrentPagePosts() {
      const start = (this.currentPage - 1) * this.postsPerPage;
      const end = start + this.postsPerPage;
      this.currentPosts = this.posts.slice(start, end); // 截取当前页的数据
      console.log("Current page posts:", this.currentPosts); // 打印当前页的数据
    },


    // 上一页
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchPosts();  // 重新获取帖子
      }
    },

    // 下一页
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchPosts();  // 重新获取帖子
      }
    },

    // 跳转到指定页
    goToPage(page) {
      this.currentPage = page;
      this.fetchPosts();  // 重新获取帖子
    },

    // 跳转到指定页，处理输入框
    jumpToPage() {
      const page = parseInt(this.jumpPage);
      if (isNaN(page) || page < 1 || page > this.totalPages) {
        alert('请输入有效的页码');
        return;
      }
      this.currentPage = page;
      this.fetchPosts();  // 重新获取帖子
    },

    // 搜索帖子
    searchPosts() {
      this.currentPage = 1; // 搜索时从第一页开始
      this.fetchPosts();
    },
  },

  // 页面加载时获取帖子数据
  mounted() {
    this.fetchPosts();
  },
};
</script>

<style scoped>
/* 整体背景颜色 */
body {
  background-color: pink;
}

/* 顶部导航栏样式 */
.nav-bar {
         display: flex;
         justify-content: space-between;
         align-items: center;
         background-color: blue;
         color: white;
         padding: 10px 20px;
       }

.nav-bar.logo {
         font-size: 1.5em;
         font-weight: bold;
       }

.nav-bar ul {
         list-style: none;
         display: flex;
         gap: 20px;
       }

.nav-bar ul li {
         cursor: pointer;
       }

.user-icon {
          font-size: 1.5em;
        }

/* 搜索与标签切换样式 */
.search-area {
            margin: 20px;
            display: flex;
            gap: 10px;
          }

.search-area input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
          }

.search-area button {
            background-color: yellow;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            cursor: pointer;
          }

.tab-switch {
         display: flex;
         align-items: center;
         gap: 20px;
       }

.tab-switch span {
         cursor: pointer;
         padding: 10px;
       }

.tab-switch span.active {
         background-color: pink;
       }

.post-button {
          margin-left: auto;
        }

/* 列表区域样式 */
.post-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          padding: 20px;
        }

.post-card {
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease;
          height: 300px; /* 设置固定高度 */
        }

.post-card:hover {
          transform: translateY(-5px);
        }

.post-card-header {
                 display: flex;
                 padding: 15px;
               }

.post-card-image {
                 width: 100px;
                 height: 100px;
                 border-radius: 8px;
                 object-fit: cover;
                 margin-right: 15px;
               }

.post-card-info {
                 flex: 1;
               }

.post-card-title {
                 font-size: 1.2em;
                 margin: 0;
                 font-weight: bold;
               }

.post-card-user {
                 font-size: 0.9em;
                 color: #777;
               }

.post-card-views {
                 margin-top: 5px;
                 font-size: 0.9em;
                 color: #999;
               }

.post-card-content {
                 padding: 15px;
                 font-size: 1em;
                 color: #333;
                 line-height: 1.6;
                 height: 100px; /* 设置内容区的高度 */
                 overflow: hidden; /* 防止过长内容超出 */
               }

/* 没有帖子时的提示样式 */
.no-posts {
        text-align: center;
        font-size: 1.2em;
        color: #888;
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.pagination span {
  cursor: pointer;
  padding: 5px 10px;
}

.pagination span.active {
  font-weight: bold;
}

.jump-to {
          margin-left: 20px;
        }
</style>