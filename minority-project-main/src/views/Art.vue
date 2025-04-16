<template>
    <div class="art-page">
      <div class="top-decoration"></div>
      
      <div class="container">
        <page-header 
          title="民族艺术瑰宝" 
          subtitle="感受各民族独特的艺术表现形式"
        />
        
        <main-nav />
        
        <main>
          <section class="content-section">
            <h2 class="section-title">传统艺术展示</h2>
            
            <div class="art-grid">
              <div 
                v-for="(item, index) in artList" 
                :key="index" 
                class="art-card"
                @mouseenter="hoverIndex = index"
                @mouseleave="hoverIndex = null"
                :class="{ 'highlight': hoverIndex === index }"
              >
                <div class="ethnic-group">{{ item.ethnic }}</div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
                <div class="art-media">
                  <img 
                    v-if="item.type === 'image'"
                    :src="item.content" 
                    :alt="item.title"
                  >
                  <video 
                    v-else-if="item.type === 'video'"
                    :src="item.content"
                    controls
                  ></video>
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
  
  const hoverIndex = ref(null)
  
  const artList = ref([
    {
      ethnic: '蒙古族',
      title: '马头琴',
      description: '蒙古族传统弦乐器，音色悠扬浑厚，表现草原的辽阔',
      content: '/minority-project-photo/Art/matouqing.jpg',
      type: 'image'
    },
    {
      ethnic: '傣族',
      title: '孔雀舞',
      description: '模仿孔雀姿态的优美舞蹈，展现傣族人民的艺术天赋',
      content: '/minority-project-photo/Art/peacock-dance.jpg',
      type: 'video'
    },
    {
      ethnic: '苗族',
      title: '银饰工艺',
      description: '精湛的金属锻造技艺，打造出精美的银饰艺术品',
      content: '/minority-project-photo/Art/miaozuyinshi.jpg',
      type: 'image'
    },
    {
      ethnic: '藏族',
      title: '唐卡',
      description: '用矿物颜料绘制的宗教卷轴画，色彩鲜艳经久不褪',
      content: '/minority-project-photo/Art/tangka.jpg',
      type: 'image'
    }
  ])
  </script>
  
  <style scoped>
  .art-page {
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
  
  .art-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
    margin-top: 30px;
  }
  
  .art-card {
    background: white;
    border-radius: 6px;
    padding: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 3px 10px rgba(0,0,0,0.05);
    border: 1px solid #f0e6d2;
    position: relative;
    overflow: hidden;
  }
  
  .art-card.highlight {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(139, 90, 43, 0.15);
  }
  
  .art-media {
    height: 200px;
    margin-top: 15px;
    overflow: hidden;
    border-radius: 4px;
  }
  
  .art-media img,
  .art-media video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    .art-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>