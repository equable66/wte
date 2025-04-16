<template>
    <div class="customs-page">
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
        
        <!-- 风俗习惯专属内容 -->
        <main>
          <section class="content-section">
            <h2 class="section-title">特色风俗展示</h2>
            
            <!-- 风俗分类展示 -->
            <div class="customs-grid">
              <div 
                v-for="(custom, index) in customsList" 
                :key="index" 
                class="custom-card"
                @mouseenter="hoverIndex = index"
                @mouseleave="hoverIndex = null"
                :class="{ 'highlight': hoverIndex === index }"
              >
                <div class="ethnic-group">{{ custom.ethnic }}</div>
                <h3>{{ custom.title }}</h3>
                <p>{{ custom.description }}</p>
                <div class="custom-image">
                  <img 
                    :src="custom.image" 
                    :alt="custom.title"
                    :style="{ transform: hoverIndex === index ? 'scale(1.05)' : '' }"
                  >
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import PageHeader from '@/components/PageHeader.vue'
  import MainNav from '@/components/MainNav.vue'
  
  // 当前悬停的卡片索引
  const hoverIndex = ref(null)
  
  // 风俗数据
  const customsList = ref([
    {
      ethnic: '苗族',
      title: '银饰工艺',
      description: '苗族银饰以大为美、以重为美、以多为美，工艺精湛堪称一绝',
      image: '/minority-project-photo/Customs/miaozuyinshi.jpg'
    },
    {
      ethnic: '蒙古族',
      title: '那达慕大会',
      description: '传统体育盛会，包含摔跤、赛马、射箭等蒙古族传统项目',
      image: '/minority-project-photo/Customs/nadamu.jpg'
    },
    {
      ethnic: '傣族',
      title: '泼水节',
      description: '傣历新年庆典，人们互相泼水祝福，寓意洗去过去的不顺',
      image: '/minority-project-photo/Customs/poshuijie.jpg'
    },
    {
      ethnic: '藏族',
      title: '哈达礼仪',
      description: '献哈达是藏族最普遍的一种礼节，表示对客人热烈的欢迎和诚挚的敬意',
      image: '/minority-project-photo/Customs/hadaliyi.jpg'
    }
  ])
  </script>
  
  <style scoped>
  .customs-page {
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
  
  .customs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
    margin-top: 30px;
  }
  
  .custom-card {
    background: white;
    border-radius: 6px;
    padding: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 3px 10px rgba(0,0,0,0.05);
    border: 1px solid #f0e6d2;
    position: relative;
    overflow: hidden;
  }
  
  .custom-card.highlight {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(139, 90, 43, 0.15);
  }
  
  .ethnic-group {
    position: absolute;
    top: 0;
    right: 0;
    background: #8B5A2B;
    color: white;
    padding: 5px 15px;
    border-bottom-left-radius: 15px;
    font-size: 0.9rem;
  }
  
  .custom-card h3 {
    color: #8B5A2B;
    margin: 15px 0 10px;
    font-size: 1.3rem;
    padding-right: 40px;
  }
  
  .custom-card p {
    color: #666;
    line-height: 1.7;
    margin-bottom: 15px;
  }
  
  .custom-image {
    height: 200px;
    overflow: hidden;
    border-radius: 4px;
  }
  
  .custom-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
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