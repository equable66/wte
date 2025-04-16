<template>
    <nav class="ancient-nav" :class="{ 'fixed-nav': isFixed }">
      <ul>
        <li v-for="(item, index) in items" :key="index">
          <router-link 
            :to="item.path"
            class="nav-link"
            active-class="active"
          >
            {{ item.title }}
          </router-link>
        </li>
      </ul>
    </nav>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const isFixed = ref(false)
  const items = [
    { title: '首页', path: '/' },
    { title: '知识导航', path: '/knowledge' },
    { title: '风俗习惯', path: '/customs' },
    { title: '传统节日', path: '/festivals' },
    { title: '民族服饰', path: '/clothes' },
    { title: '民间艺术', path: '/art'   },
    { title: '关于我们', path: '/about' }
  ]
  
  onMounted(() => {
    window.addEventListener('scroll', () => {
      isFixed.value = window.scrollY > 50
    })
  })
  </script>
  
  <style scoped>
  /* 导航样式保持不变 */
    /* 古风导航栏 */
    .ancient-nav {
    background-color: #8B5A2B;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    margin-bottom: 30px;
    border: 1px solid #D2B48C;
    border-top: none;
    transition: all 0.3s ease;
  }
  
  .ancient-nav.fixed-nav {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    border-radius: 0;
    max-width: 1200px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .ancient-nav ul {
    display: flex;
    list-style: none;
    justify-content: center;
  }
  
  .ancient-nav li {
    position: relative;
  }
  
  .ancient-nav li:not(:last-child)::after {
    content: "";
    position: absolute;
    right: 0;
    top: 25%;
    height: 50%;
    width: 1px;
    background-color: rgba(255,255,255,0.3);
  }
  
  .ancient-nav a {
    display: block;
    padding: 15px 25px;
    color: #fff;
    text-decoration: none;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    position: relative;
  }
  
  .ancient-nav a:hover {
    background-color: #A67C52;
  }
  
  .ancient-nav a.active {
    background-color: #A67C52;
    font-weight: bold;
  }
  
  .ancient-nav a.active::before {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #f9f4e6;
  }
  
  </style>