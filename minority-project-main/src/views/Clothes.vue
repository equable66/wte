<template>
    <div class="clothes-page">
      <div class="top-decoration"></div>
      
      <div class="container">
        <page-header 
          title="民族服饰文化" 
          subtitle="欣赏各民族独特的服饰艺术"
        />
        
        <main-nav />
        
        <main>
          <section class="content-section">
            <h2 class="section-title">特色服饰展示</h2>
            
            <div class="clothes-grid">
              <div 
                v-for="(item, index) in clothesList" 
                :key="index" 
                class="clothes-card"
                @mouseenter="hoverIndex = index"
                @mouseleave="hoverIndex = null"
                :class="{ 'highlight': hoverIndex === index }"
              >
                <div class="ethnic-group">{{ item.ethnic }}</div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
                <div class="clothes-image">
                  <img 
                    :src="item.image" 
                    :alt="item.title"
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
  
  const hoverIndex = ref(null)
  
  const clothesList = ref([
    {
      ethnic: '汉族',
      title: '汉服',
      description: '华夏汉民族传统服饰，体现"交领右衽、宽衣博带"的服饰特点',
      image: '/minority-project-photo/Clothes/hanfu.jpg'
    },
    {
      ethnic: '藏族',
      title: '藏袍',
      description: '右衽大襟、长袖宽腰，适应高原气候的独特设计',
      image: '/minority-project-photo/Clothes/zangpao.jpg'
    },
    {
      ethnic: '维吾尔族',
      title: '艾德莱斯绸',
      description: '色彩鲜艳的丝绸服饰，图案具有浓郁的民族特色',
      image: '/minority-project-photo/Clothes/aidelaisichou.jpg'
    },
    {
      ethnic: '彝族',
      title: '查尔瓦',
      description: '羊毛织成的披风，是彝族男女老幼必备的服饰',
      image: '/minority-project-photo/Clothes/caherwa.jpg'
    }
  ])
  </script>
  
  <style scoped>
  .clothes-page {
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
  
  .clothes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
    margin-top: 30px;
  }
  
  .clothes-card {
    background: white;
    border-radius: 6px;
    padding: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 3px 10px rgba(0,0,0,0.05);
    border: 1px solid #f0e6d2;
    position: relative;
    overflow: hidden;
  }
  
  .clothes-card.highlight {
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
  
  .clothes-card h3 {
    color: #8B5A2B;
    margin: 15px 0 10px;
    font-size: 1.3rem;
    padding-right: 40px;
  }
  
  .clothes-card p {
    color: #666;
    line-height: 1.7;
    margin-bottom: 15px;
  }
  
  .clothes-image {
    height: 250px; /* 图片稍高以展示服饰 */
    overflow: hidden;
    border-radius: 4px;
  }
  
  .clothes-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  
  @media (max-width: 768px) {
    .clothes-grid {
      grid-template-columns: 1fr;
    }
    
    .section-title {
      font-size: 1.8rem;
    }
  }
  </style>