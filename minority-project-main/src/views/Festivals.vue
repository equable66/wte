<template>
    <div class="festival-page">
      <!-- 顶部装饰条 -->
      <div class="top-decoration"></div>
      
      <div class="container">
        <!-- 使用公共页眉组件 -->
        <page-header 
          title="民族风俗习惯" 
          subtitle="领略各民族独特的生活习俗与传统"
        />
        
        <!-- 使用公共导航组件 -->
        <main-nav />
        <h1>下面为响应内容</h1>
        <button @click="sendMsg">发送数据</button>
        <div>{{ users.name }}</div>
        <div>{{ users.age }}</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import PageHeader from '@/components/PageHeader.vue'
  import MainNav from '@/components/MainNav.vue'
  import axios from 'axios'; // 取消注释
  const users = ref({}); // 初始化 users 为对象

  const sendMsg = () => {
    axios.post('http://localhost:3000/festivals')
      .then(response => {
        console.log(response.data);
        users.value = response.data; // 使用 users.value 赋值
      })
      .catch(error => {
        console.error(error);
      });
  };
  </script>
  
  <style scoped>
  .festival-page {
    min-height: 100vh;
    padding-bottom: 50px;
  }
  
  .section-title {
    font-family: 'Ma Shan Zheng', cursive;
    color: #8B5A2B;
    text-align: center;
    margin: 30px 0;
    font-size: 2.2rem;
  }
  
  .content-section {
    background: rgba(255, 255, 255, 0.9);
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    border: 1px solid #e0d6c2;
  }
  /* 响应式设计 */
  @media (max-width: 768px) {
    .customs-grid {
      grid-template-columns: 1fr;
    }
    
    .section-title {
      font-size: 1.8rem;
    }
  }
  </style>