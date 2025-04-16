<template>
    <div class="knowledge-page">
      <!-- 顶部装饰 -->
      <div class="top-decoration"></div>
      
      <div class="container">
        <!-- 复用主站标题 -->
        <page-header title="民族知识导航" subtitle="探索少数民族的文化宝库" />
        
        <!-- 导航栏 -->
        <main-nav />
        
        <!-- 知识内容 -->
        <main>
          <section class="content-section">
            <h2 class="section-title">少数民族知识体系</h2>
            <p class="section-desc">中国有56个民族，每个民族都有其独特的文化特色和历史传承。通过以下分类，您可以系统地了解中国少数民族的文化多样性。</p>
            
            <div class="knowledge-categories">
              <div class="category-card" v-for="(category, index) in categories" :key="index" @click="navigateTo(category.path)">
                <div class="category-icon" :style="{backgroundColor: category.color}">
                  <i :class="category.icon"></i>
                </div>
                <div class="category-content">
                  <h3>{{ category.title }}</h3>
                  <p>{{ category.description }}</p>
                </div>
                <div class="category-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>
            </div>
          </section>
          
          <section class="content-section">
            <h2 class="section-title">非物质文化遗产</h2>
            <p class="section-desc">非物质文化遗产是民族文化的重要组成部分，反映了各民族的文化创造力和历史传承。</p>
            
            <div class="heritage-grid">
              <div class="heritage-card" v-for="(item, index) in heritageItems" :key="index" @click="navigateTo(item.path)">
                <div class="heritage-image">
                  <img :src="item.image" :alt="item.title">
                  <div class="heritage-tag" v-if="item.isUNESCO">UNESCO</div>
                </div>
                <div class="heritage-info">
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.ethnic }}</p>
                </div>
              </div>
            </div>
            
            <div class="view-more">
              <router-link to="/heritage" class="btn-more">查看更多非遗项目 <i class="fas fa-arrow-right"></i></router-link>
            </div>
          </section>
          
          <section class="content-section">
            <h2 class="section-title">民族学术研究</h2>
            <div class="academic-categories">
              <div class="academic-card" v-for="(item, index) in academicItems" :key="index" @click="navigateTo(item.path)">
                <div class="academic-icon">
                  <i :class="item.icon"></i>
                </div>
                <h3>{{ item.title }}</h3>
              </div>
            </div>
          </section>
          
          <section class="content-section resources-section">
            <h2 class="section-title">推荐资源</h2>
            <div class="resources-list">
              <div class="resource-item" v-for="(resource, index) in recommendedResources" :key="index" @click="navigateTo(resource.url)">
                <div class="resource-icon">
                  <i :class="resource.icon"></i>
                </div>
                <div class="resource-content">
                  <h3>{{ resource.title }}</h3>
                  <p>{{ resource.description }}</p>
                </div>
                <div class="resource-link">
                  <i class="fas fa-external-link-alt"></i>
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
  import { useRouter } from 'vue-router'
  import PageHeader from '@/components/PageHeader.vue'
  import MainNav from '@/components/MainNav.vue'
  
  const router = useRouter()
  
  // 知识分类
  const categories = [
    {
      title: '民族服饰',
      description: '探索各少数民族独特的服饰特色、制作工艺及文化意义',
      icon: 'fas fa-tshirt',
      color: '#e74c3c',
      path: '/clothes'
    },
    {
      title: '传统音乐',
      description: '了解少数民族丰富多彩的音乐形式、乐器及经典曲目',
      icon: 'fas fa-music',
      color: '#3498db',
      path: '/music'
    },
    {
      title: '传统舞蹈',
      description: '欣赏各民族独特的舞蹈形式、舞步特点及文化内涵',
      icon: 'fas fa-drum',
      color: '#9b59b6',
      path: '/dance'
    },
    {
      title: '传统节日',
      description: '了解少数民族重要节日的起源、习俗及庆祝方式',
      icon: 'fas fa-calendar-alt',
      color: '#f39c12',
      path: '/festivals'
    },
    {
      title: '饮食文化',
      description: '品味各民族特色美食、饮食习惯及其文化背景',
      icon: 'fas fa-utensils',
      color: '#27ae60',
      path: '/food'
    },
    {
      title: '传统手工艺',
      description: '探索少数民族精湛的手工艺技术及其传承发展',
      icon: 'fas fa-tools',
      color: '#8e44ad',
      path: '/crafts'
    },
    {
      title: '民俗习惯',
      description: '了解少数民族日常生活中的风俗习惯及礼仪规范',
      icon: 'fas fa-home',
      color: '#16a085',
      path: '/customs'
    },
    {
      title: '民族分布',
      description: '通过交互地图了解中国少数民族的地理分布情况',
      icon: 'fas fa-map-marked-alt',
      color: '#2980b9',
      path: '/ethnic-map'
    }
  ]
  
  // 非物质文化遗产项目
  const heritageItems = [
    {
      title: '侗族大歌',
      ethnic: '侗族',
      image: '/minority-project-photo/Heritage/dong-song.jpg',
      isUNESCO: true,
      path: '/heritage/dong-song'
    },
    {
      title: '彝族火把节',
      ethnic: '彝族',
      image: '/minority-project-photo/Heritage/torch-festival.jpg',
      isUNESCO: false,
      path: '/heritage/torch-festival'
    },
    {
      title: '苗族蜡染',
      ethnic: '苗族',
      image: '/minority-project-photo/Heritage/miao-batik.jpg',
      isUNESCO: true,
      path: '/heritage/miao-batik'
    },
    {
      title: '维吾尔木卡姆',
      ethnic: '维吾尔族',
      image: 'minority-project-photo/Heritage/muqam.jpg',
      isUNESCO: true,
      path: '/heritage/muqam'
    }
  ]
  
  // 学术研究分类
  const academicItems = [
    {
      title: '学术论文',
      icon: 'fas fa-book',
      path: '/academic/papers'
    },
    {
      title: '研究报告',
      icon: 'fas fa-scroll',
      path: '/academic/reports'
    },
    {
      title: '学者访谈',
      icon: 'fas fa-microphone-alt',
      path: '/academic/interviews'
    },
    {
      title: '田野调查',
      icon: 'fas fa-mountain',
      path: '/academic/fieldwork'
    }
  ]
  
  // 推荐资源
  const recommendedResources = [
    {
      title: '中国非物质文化遗产网',
      description: '官方权威的中国非物质文化遗产数字博物馆',
      icon: 'fas fa-landmark',
      url: 'https://www.ihchina.cn'
    },
    {
      title: '民族文化数据库',
      description: '包含各少数民族的详细资料、图片和研究文献',
      icon: 'fas fa-database',
      url: '/resources/database'
    },
    {
      title: '少数民族影像档案',
      description: '珍贵的少数民族历史影像和纪录片资源',
      icon: 'fas fa-film',
      url: '/resources/videos'
    }
  ]
  
  // 导航函数
  const navigateTo = (path) => {
    if (path.startsWith('http')) {
      window.open(path, '_blank')
    } else {
      router.push(path)
    }
  }
  </script>
  
  <style scoped>
  .knowledge-page {
    min-height: 100vh;
    /* background-color: #e0d6c2; */
    padding-bottom: 50px;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  /* .content-section {
    background: white;
    padding: 30px;
    border-radius: 10px;
    margin: 30px 0;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  } */
  .content-section {
    background: rgba(255, 255, 255, 0.9);
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    border: 1px solid #e0d6c2;
  }
  .section-title {
    font-family: 'Ma Shan Zheng', cursive;
    font-size: 1.8rem;
    color: #005bac;
    margin-bottom: 15px;
    position: relative;
    display: inline-block;
    padding-bottom: 10px;
  }
  
  .section-title:after {
    content: '';
    position: absolute;
    width: 60px;
    height: 2px;
    background-color: #005bac;
    bottom: 0;
    left: 0;
  }
  
  .section-desc {
    color: #666;
    margin-bottom: 25px;
    max-width: 800px;
    line-height: 1.6;
  }
  
  /* 知识分类卡片 */
  .knowledge-categories {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }
  
  .category-card {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
    cursor: pointer;
    border: 1px solid #eee;
  }
  
  .category-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.1);
  }
  
  .category-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    flex-shrink: 0;
  }
  
  .category-icon i {
    font-size: 1.8rem;
    color: white;
  }
  
  .category-content {
    flex: 1;
  }
  
  .category-content h3 {
    font-size: 1.2rem;
    margin-bottom: 5px;
    color: #333;
  }
  
  .category-content p {
    font-size: 0.9rem;
    color: #666;
    margin: 0;
    line-height: 1.4;
  }
  
  .category-arrow {
    color: #ddd;
    transition: all 0.3s ease;
  }
  
  .category-card:hover .category-arrow {
    color: #005bac;
    transform: translateX(5px);
  }
  
  /* 非遗项目展示 */
  .heritage-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 25px;
    margin-bottom: 30px;
  }
  
  .heritage-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .heritage-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }
  
  .heritage-image {
    position: relative;
    height: 160px;
    overflow: hidden;
  }
  
  .heritage-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.5s ease;
  }
  
  .heritage-card:hover .heritage-image img {
    transform: scale(1.1);
  }
  
  .heritage-tag {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 91, 172, 0.8);
    color: white;
    padding: 3px 8px;
    font-size: 0.7rem;
    border-radius: 4px;
    font-weight: bold;
  }
  
  .heritage-info {
    padding: 15px;
  }
  
  .heritage-info h3 {
    margin: 0 0 5px 0;
    font-size: 1.1rem;
    color: #333;
  }
  
  .heritage-info p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }
  
  .view-more {
    text-align: center;
    margin-top: 10px;
  }
  
  .btn-more {
    display: inline-block;
    padding: 8px 20px;
    background-color: #f8f9fa;
    color: #005bac;
    border-radius: 5px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  .btn-more:hover {
    background-color: #e9ecef;
    transform: translateY(-2px);
  }
  
  .btn-more i {
    margin-left: 5px;
    transition: all 0.3s ease;
  }
  
  .btn-more:hover i {
    transform: translateX(3px);
  }
  
  /* 学术研究 */
  .academic-categories {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
  }
  
  .academic-card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 25px 20px;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
    border: 1px solid #eee;
  }
  
  .academic-card:hover {
    background: #005bac;
    color: white;
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.1);
  }
  
  .academic-icon {
    font-size: 2.5rem;
    margin-bottom: 15px;
    color: #005bac;
  }
  
  .academic-card:hover .academic-icon {
    color: white;
  }
  
  .academic-card h3 {
    margin: 0;
    font-size: 1.1rem;
  }
  
  /* 推荐资源 */
  .resources-section {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  }
  
  .resources-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .resource-item {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 8px;
    padding: 15px 20px;
    box-shadow: 0 3px 8px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .resource-item:hover {
    transform: translateX(5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
  
  .resource-icon {
    width: 50px;
    height: 50px;
    background: #f0f4f8;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    color: #005bac;
    font-size: 1.3rem;
    flex-shrink: 0;
  }
  
  .resource-content {
    flex: 1;
  }
  
  .resource-content h3 {
    margin: 0 0 5px 0;
    font-size: 1.1rem;
    color: #333;
  }
  
  .resource-content p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }
  
  .resource-link {
    color: #ddd;
    transition: all 0.3s ease;
  }
  
  .resource-item:hover .resource-link {
    color: #005bac;
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .knowledge-categories,
    .heritage-grid,
    .academic-categories {
      grid-template-columns: 1fr;
    }
    
    .content-section {
      padding: 20px;
    }
    
    .section-title {
      font-size: 1.5rem;
    }
  }
  
  .category-icon i,
  .academic-icon i,
  .resource-icon i,
  .category-arrow i,
  .resource-link i,
  .btn-more i {
    font-family: 'FontAwesome', sans-serif;
    display: inline-block;
  }
  
  /* 如果FontAwesome未加载，使用替代图标 */
  .category-icon i:empty:before,
  .academic-icon i:empty:before,
  .resource-icon i:empty:before {
    content: '•';
  }
  
  .category-arrow i:empty:before,
  .btn-more i:empty:before {
    content: '→';
  }
  
  .resource-link i:empty:before {
    content: '↗';
  }
  </style>