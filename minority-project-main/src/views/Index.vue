<template>
  <!-- 全屏滚动容器 -->
  <div class="fullpage-container" ref="fullpageContainer" @wheel="handleWheel" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <!-- 顶部装饰 -->
    <div class="top-decoration"></div>
    
    <!-- 右上角头像 -->
    <div class="top-right-avatar">
      <Avatar />
    </div>
    
    <!-- 导航栏 -->
     <main-nav />
    <nav class="ancient-nav" :class="{ 'fixed-nav': isNavFixed }">
      <ul>
        <li v-for="(item, index) in navItems" :key="index">
          <router-link 
            :to="item.path" 
            :class="{ active: $route.path === item.path }"
          >
            {{ item.title }}
          </router-link>
        </li>
      </ul>
    </nav>
    
    <!-- 主要内容 -->
    <main>
      <!-- 首页部分 - 第一屏 -->
      <section class="fullpage-section hero" id="section-0">
        <div class="section-content">
          <div class="hero-text">
            <h1>华夏民族风情</h1>
            <p class="subtitle">探索少数民族的传统文化瑰宝</p>
            <h2>五十六个民族，五十六朵花</h2>
            <p>探索中国少数民族丰富多彩的文化遗产，感受千年传承的独特魅力</p>
            <a href="javascript:void(0)" class="explore-btn" @click="scrollToSection(1)">开始探索</a>
          </div>
        </div>
      </section>
      
      <!-- 民族分布地图区块 -->
      <section class="fullpage-section ethnic-map-preview" id="section-1">
        <div class="section-content">
          <div class="map-preview-content">
            <div class="map-title">
              <h2>中国少数民族分布地图</h2>
              <p>探索中国55个少数民族的地理分布</p>
            </div>
            <div class="map-preview-container">
              <div class="map-preview-image">
                <div class="map-overlay">
                  <router-link to="/ethnic-map" class="view-map-btn">查看完整地图</router-link>
                </div>
              </div>
              <div class="map-preview-info">
                <div class="info-card">
                  <div class="info-icon">🏔️</div>
                  <div class="info-content">
                    <h3>地域广阔</h3>
                    <p>少数民族主要分布在中国西南、西北、东北等地区</p>
                  </div>
                </div>
                <div class="info-card">
                  <div class="info-icon">👥</div>
                  <div class="info-content">
                    <h3>人口众多</h3>
                    <p>少数民族总人口超过1.2亿，占全国总人口约8.5%</p>
                  </div>
                </div>
                <div class="info-card">
                  <div class="info-icon">🏮</div>
                  <div class="info-content">
                    <h3>文化多元</h3>
                    <p>每个民族都有其独特的语言、服饰、节日和风俗习惯</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 特色卡片部分 - 后续屏 -->
      <section 
        v-for="(feature, index) in features" 
        :key="index" 
        :id="`section-${index + 2}`"
        class="fullpage-section feature-section"
        :style="{ backgroundImage: `url('${feature.bgImage}')` }"
      >
        <div class="section-content">
          <div class="feature-overlay"></div>
          <div class="feature-content">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
            <button class="feature-btn">了解更多</button>
          </div>
        </div>
      </section>
      
      <!-- 页脚部分 - 最后一屏 -->
      <section class="fullpage-section footer-section" id="section-last">
        <div class="section-content">
          <footer>
            <p>© 2023 华夏民族风情 - 少数民族传统文化保护与传承</p>
          </footer>
        </div>
      </section>
    </main>
    
    <!-- 滚动指示器 -->
    <div class="scroll-indicator" v-if="currentSection < totalSections - 1">
      <img src="/scroll-indicator.svg" alt="向下滚动" @click="scrollToSection(currentSection + 1)" />
    </div>
    
    <!-- 页面指示器 -->
    <div class="page-indicator">
      <span 
        v-for="index in totalSections" 
        :key="index - 1"
        class="page-dot"
        :class="{ 'active': currentSection === index - 1 }"
        @click="scrollToSection(index - 1)"
      ></span>
    </div>
    
    <!-- 添加AI助手组件 -->
    <DeepSeekChat :api-key="deepseekApiKey" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import Avatar from '../components/Avatar.vue'
import DeepSeekChat from '../components/DeepSeekChat.vue'
import { useRoute, useRouter } from 'vue-router'

// DeepSeek API密钥
const deepseekApiKey = ''

// 响应式数据
const isNavFixed = ref(false)
const currentSection = ref(0)
const isScrolling = ref(false)
const fullpageContainer = ref(null)
const touchStartY = ref(0)
const touchEndY = ref(0)
const scrollTimeout = ref(null)
const router = useRouter()

// 导航项数据
const navItems = ref([
  { title: '首页', path: '/' },
  { title: '知识导航', path: '/knowledge' },
  { title: '风俗习惯', path: '/customs' },
  { title: '传统节日', path: '/festivals' },
  { title: '民族地图', path: '/ethnic-map' },
  { title: '民族服饰', path: '/clothes' },
  { title: '民间艺术', path: '/art' },
  { title: '关于我们', path: '/about' }
])
  
// 特色卡片数据
const features = ref([
  { icon: '🎎', title: '民族服饰', desc: '了解各民族独特的服饰文化', bgImage: '/costume-bg.svg' },
  { icon: '🎉', title: '传统节日', desc: '探索丰富多彩的民族节日', bgImage: '/festival-bg.svg' },
  { icon: '🍜', title: '饮食文化', desc: '品尝各民族的特色美食', bgImage: '/food-bg.svg' }
])

// 计算总页面数量（首页 + 地图 + 特色卡片 + 页脚）
const totalSections = computed(() => features.value.length + 3)

// 滚动到指定部分
const scrollToSection = (index) => {
  if (isScrolling.value) return
  if (index < 0 || index >= totalSections.value) return
  
  isScrolling.value = true
  currentSection.value = index
  
  const targetSection = document.getElementById(`section-${index === totalSections.value - 1 ? 'last' : index}`)
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth' })
    
    // 设置滚动锁定时间
    if (scrollTimeout.value) clearTimeout(scrollTimeout.value)
    scrollTimeout.value = setTimeout(() => {
      isScrolling.value = false
    }, 1000) // 滚动动画大约需要1秒
  } else {
    isScrolling.value = false
  }
}

// 处理鼠标滚轮事件
const handleWheel = (e) => {
  e.preventDefault()
  
  if (isScrolling.value) return
  
  // 向下滚动
  if (e.deltaY > 0) {
    scrollToSection(currentSection.value + 1)
  }
  // 向上滚动
  else if (e.deltaY < 0) {
    scrollToSection(currentSection.value - 1)
  }
}

// 处理触摸事件 - 开始
const handleTouchStart = (e) => {
  touchStartY.value = e.touches[0].clientY
}

// 处理触摸事件 - 移动
const handleTouchMove = (e) => {
  if (isScrolling.value) {
    e.preventDefault()
    return
  }
  touchEndY.value = e.touches[0].clientY
}

// 处理触摸事件 - 结束
const handleTouchEnd = () => {
  if (isScrolling.value) return
  
  const touchDiff = touchStartY.value - touchEndY.value
  
  // 向上滑动 (正值)
  if (touchDiff > 50) {
    scrollToSection(currentSection.value + 1)
  }
  // 向下滑动 (负值)
  else if (touchDiff < -50) {
    scrollToSection(currentSection.value - 1)
  }
}

// 更新导航栏状态
const updateNavState = () => {
  isNavFixed.value = currentSection.value > 0
}

// 初始化页面
const initPage = () => {
  // 根据URL哈希值确定初始部分
  const hash = window.location.hash
  if (hash && hash.startsWith('#section-')) {
    const sectionIndex = parseInt(hash.replace('#section-', ''))
    if (!isNaN(sectionIndex) && sectionIndex >= 0 && sectionIndex < totalSections.value) {
      currentSection.value = sectionIndex
      nextTick(() => {
        scrollToSection(sectionIndex)
      })
    }
  }
  
  // 监听哈希变化
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash
    if (hash && hash.startsWith('#section-')) {
      const sectionIndex = parseInt(hash.replace('#section-', ''))
      if (!isNaN(sectionIndex) && sectionIndex >= 0 && sectionIndex < totalSections.value) {
        scrollToSection(sectionIndex)
      }
    }
  })
}

// 生命周期钩子
onMounted(() => {
  initPage()
  
  // 监听滚动事件以更新导航栏状态
  window.addEventListener('scroll', updateNavState)
  
  // 禁用默认滚动行为
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateNavState)
  window.removeEventListener('hashchange', initPage)
  document.body.style.overflow = ''
  
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }
})
</script>

<style scoped>
/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 全屏滚动容器 */
.fullpage-container {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
  background-color: #f9f4e6;
  color: #333;
  font-family: 'Noto Serif SC', serif;
  background-image: url('https://www.transparenttextures.com/patterns/rice-paper.png');
  line-height: 1.6;
}

/* 顶部装饰 */
.top-decoration {
  height: 10px;
  background: linear-gradient(90deg, #8B5A2B, #D2B48C, #8B5A2B);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}

/* 古风导航栏 */
.ancient-nav {
  background-color: #8B5A2B;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border: 1px solid #D2B48C;
  border-top: none;
  transition: all 0.3s ease;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 1200px;
  z-index: 100;
  border-radius: 5px;
}

.ancient-nav.fixed-nav {
  position: fixed;
  top: 0;
  border-radius: 0;
  width: 100%;
  max-width: 100%;
}

.ancient-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.ancient-nav ul {
  display: flex;
  list-style: none;
  justify-content: center;
  flex: 1;
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

/* 全屏部分通用样式 */
.fullpage-section {
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;
}

/* 民族分布地图预览 */
.ethnic-map-preview {
  background-color: #f5f5f5;
  background-image: url('https://www.transparenttextures.com/patterns/rice-paper-dark.png');
  position: relative;
}

.ethnic-map-preview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(139, 90, 43, 0.1) 0%, rgba(139, 90, 43, 0.2) 100%);
  z-index: 1;
}

.map-preview-content {
  text-align: center;
  padding: 40px 0;
}

.map-title {
  margin-bottom: 30px;
}

.map-title h2 {
  font-family: 'Ma Shan Zheng', cursive;
  font-size: 2.5rem;
  color: #8B5A2B;
  margin-bottom: 10px;
  position: relative;
  display: inline-block;
}

.map-title h2::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8B5A2B, transparent);
  transform: translateX(-50%);
}

.map-title p {
  font-size: 1.2rem;
  color: #666;
}

.map-preview-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 30px;
}

.map-preview-image {
  flex: 1;
  min-width: 300px;
  height: 400px;
  background-image: url('/map-preview.svg'); /* 需要添加地图预览图 */
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6));
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.map-preview-image:hover .map-overlay {
  opacity: 1;
}

.view-map-btn {
  padding: 12px 25px;
  background-color: #8B5A2B;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.view-map-btn:hover {
  background-color: #A67C52;
  transform: translateY(-3px);
}

.map-preview-info {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  text-align: left;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.info-icon {
  font-size: 2.5rem;
  margin-right: 20px;
  color: #8B5A2B;
}

.info-content h3 {
  font-size: 1.3rem;
  color: #8B5A2B;
  margin-bottom: 5px;
  font-family: 'Ma Shan Zheng', cursive;
}

.info-content p {
  color: #666;
  font-size: 1rem;
}

/* 首页部分 */
.hero {
  /* background-image: url('/test.jpg'); */
  background-size: cover;
  background-position: center;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(139, 90, 43, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%);
  z-index: 1;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  z-index: 1;
}

.hero-text {
  max-width: 800px;
  width: 100%;
  padding: 60px 50px;
  text-align: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transform: translateY(0);
  animation: float 6s ease-in-out infinite;
  z-index: 2;
}

/* 添加装饰元素 */
.hero-text::before {
  content: '';
  position: absolute;
  top: -50px;
  left: -50px;
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #D2B48C, #8B5A2B);
  opacity: 0.1;
  border-radius: 50%;
  z-index: -1;
}

.hero-text::after {
  content: '';
  position: absolute;
  bottom: -50px;
  right: -50px;
  width: 120px;
  height: 120px;
  background: linear-gradient(45deg, #8B5A2B, #D2B48C);
  opacity: 0.1;
  border-radius: 50%;
  z-index: -1;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

h1 {
  font-family: 'Ma Shan Zheng', cursive;
  font-size: 3rem;
  color: #8B5A2B;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-top: 10px;
  margin-bottom: 20px;
}

.hero h2 {
  font-size: 2.5rem;
  color: #8B5A2B;
  margin-bottom: 20px;
  font-family: 'Ma Shan Zheng', cursive;
  position: relative;
  display: inline-block;
  text-shadow: 1px 1px 3px rgba(139, 90, 43, 0.2);
}

.hero h2::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8B5A2B, transparent);
  transform: translateX(-50%);
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 30px;
  color: #666;
  line-height: 1.8;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  padding: 0 20px;
}

.hero p::before, .hero p::after {
  content: '"';
  font-family: 'Ma Shan Zheng', cursive;
  font-size: 1.8rem;
  color: rgba(139, 90, 43, 0.3);
  position: absolute;
}

.hero p::before {
  left: 0;
  top: -10px;
}

.hero p::after {
  right: 0;
  bottom: -20px;
}

.explore-btn {
  display: inline-block;
  padding: 12px 30px;
  margin-top: 20px;
  background-color: #8B5A2B;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  text-decoration: none;
}

.explore-btn::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #A67C52;
  transform: translateY(100%);
  transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  z-index: -1;
}

.explore-btn:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

.explore-btn:hover::before {
  transform: translateY(0);
}

/* 特色部分 */
.feature-section {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: all 0.5s ease;
}

.feature-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.feature-content {
  max-width: 800px;
  padding: 50px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 2;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transform: translateY(0);
  transition: transform 0.5s ease;
  text-align: center;
}

.feature-content:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3.5rem;
  margin-bottom: 20px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.feature-section h3 {
  color: #8B5A2B;
  margin-bottom: 15px;
  font-size: 2rem;
  position: relative;
  display: inline-block;
}

.feature-section h3::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #8B5A2B, transparent);
  transform: translateX(-50%);
}

.feature-section p {
  margin-bottom: 25px;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666;
}

.feature-btn {
  background: linear-gradient(135deg, #8B5A2B, #A67C52);
  color: white;
  border: none;
  padding: 10px 25px;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.4s ease;
  font-family: 'Noto Serif SC', serif;
  position: relative;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(139, 90, 43, 0.3);
  z-index: 1;
}

.feature-btn:hover {
  background: linear-gradient(135deg, #A67C52, #8B5A2B);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(139, 90, 43, 0.4);
}

/* 页脚部分 */
.footer-section {
  background-color: #8B5A2B;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* 滚动指示器 */
.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  cursor: pointer;
  animation: bounce 2s infinite;
}

.scroll-indicator img {
  width: 40px;
  height: auto;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.scroll-indicator img:hover {
  opacity: 1;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
  40% { transform: translateY(-10px) translateX(-50%); }
  60% { transform: translateY(-5px) translateX(-50%); }
}

/* 页面指示器 */
.page-indicator {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 100;
}

/* 右上角头像样式 */
.top-right-avatar {
  position: fixed;
  top: 20px;
  right: 30px;
  z-index: 200;
}

.page-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(139, 90, 43, 0.3);
}

.page-dot.active {
  background-color: #8B5A2B;
  transform: scale(1.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-text {
    padding: 40px 30px;
    margin: 0 20px;
    width: calc(100% - 40px);
    max-width: none;
  }
  
  .top-right-avatar {
    top: 15px;
    right: 20px;
  }
  
  .hero h2 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1.1rem;
    max-width: 100%;
  }
  
  .explore-btn {
    padding: 10px 25px;
    font-size: 1.1rem;
  }
  
  .ancient-nav ul {
    flex-wrap: wrap;
  }
  
  .ancient-nav li {
    flex: 1 0 50%;
  }
  
  .ancient-nav li:not(:last-child)::after {
    display: none;
  }
  
  .page-indicator {
    right: 10px;
  }
}

@media (max-width: 480px) {
  .hero-text {
    padding: 30px 20px;
  }
  
  .top-right-avatar {
    top: 10px;
    right: 15px;
  }
  
  .hero h2 {
    font-size: 1.8rem;
  }
  
  .hero p {
    font-size: 1rem;
    margin-bottom: 25px;
  }
  
  .explore-btn {
    padding: 10px 20px;
    font-size: 1rem;
  }
  
  .feature-content {
    padding: 30px 20px;
  }
  
  .feature-section h3 {
    font-size: 1.6rem;
  }
  
  .feature-section p {
    font-size: 1rem;
  }
}
</style>