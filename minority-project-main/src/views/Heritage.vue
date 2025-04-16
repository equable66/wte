<template>
  <div class="heritage-page">
    <!-- 顶部装饰 -->
    <div class="top-decoration"></div>
    
    <div class="container">
      <!-- 复用主站标题 -->
      <page-header title="非物质文化遗产" subtitle="传承千年的民族文化瑰宝" />
      
      <!-- 导航栏 -->
      <main-nav />
      
      <!-- 主要内容 -->
      <main>
        <section class="content-section">
          <h2 class="section-title">非遗项目展示</h2>
          <p class="section-desc">非物质文化遗产是历史传承下来的传统文化表现形式，是人类宝贵的文化财富。以下展示了各少数民族的代表性非遗项目。</p>
          
          <!-- 过滤和分类控制区 -->
          <div class="filter-controls">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input type="text" v-model="searchQuery" placeholder="搜索非遗项目..." @input="filterHeritageItems">
            </div>
            
            <div class="filter-buttons">
              <button 
                v-for="(category, index) in categories" 
                :key="index"
                :class="['filter-btn', selectedCategory === category.value ? 'active' : '']"
                @click="selectCategory(category.value)"
              >
                {{ category.label }}
              </button>
            </div>
          </div>
          
          <!-- 百叶窗展示区域 -->
          <div class="heritage-grid louver-display">
            <div 
              v-for="(item, index) in filteredHeritageItems" 
              :key="index" 
              class="heritage-louver-item"
              @mouseenter="activeIndex = index"
              @mouseleave="activeIndex = null"
              :class="{'active': activeIndex === index}"
              @click="showHeritageDetail(item)"
            >
              <div class="louver-image">
                <img :src="item.image" :alt="item.title">
                <div class="heritage-tag" v-if="item.isUNESCO">UNESCO</div>
              </div>
              <div class="louver-info">
                <h3>{{ item.title }}</h3>
                <p class="ethnic-name">{{ item.ethnic }}</p>
                <p class="item-desc">{{ item.description }}</p>
                <div class="item-category" :style="{backgroundColor: getCategoryColor(item.category)}">
                  {{ getCategoryName(item.category) }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- 分页控制 -->
          <div class="pagination">
            <button class="page-btn" @click="changePage(-1)" :disabled="currentPage === 1">
              <i class="fas fa-chevron-left"></i>
            </button>
            <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
            <button class="page-btn" @click="changePage(1)" :disabled="currentPage === totalPages">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import MainNav from '@/components/MainNav.vue'

const router = useRouter()
const searchQuery = ref('')
const selectedCategory = ref('all')
const activeIndex = ref(null)
const currentPage = ref(1)
const itemsPerPage = 12

// 非遗项目分类
const categories = [
  { label: '全部', value: 'all' },
  { label: '音乐歌舞', value: 'music_dance' },
  { label: '传统技艺', value: 'craft' },
  { label: '节庆习俗', value: 'festival' },
  { label: '传统医药', value: 'medicine' }
]

// 获取分类名称
const getCategoryName = (value) => {
  const category = categories.find(c => c.value === value)
  return category ? category.label : '未分类'
}

// 获取分类颜色
const getCategoryColor = (category) => {
  const colors = {
    music_dance: '#3498db',
    craft: '#e67e22',
    festival: '#9b59b6',
    medicine: '#27ae60'
  }
  return colors[category] || '#95a5a6'
}

// 完整的非遗项目数据
const heritageItems = ref([
  {
    title: '侗族大歌',
    ethnic: '侗族',
    description: '侗族大歌是侗族民间多声部合唱形式，被誉为"天籁之音"，2009年被列入UNESCO人类非物质文化遗产名录。',
    image: '/minority-project-photo/Heritage/dong-song.jpg',
    isUNESCO: true,
    category: 'music_dance',
    path: '/heritage/dong-song'
  },
  {
    title: '彝族火把节',
    ethnic: '彝族',
    description: '火把节是彝族重要的传统节日，每年农历六月二十四举行，人们手持火把环绕村寨，祈求丰收和平安。',
    image: '/minority-project-photo/Heritage/torch-festival.jpg',
    isUNESCO: false,
    category: 'festival',
    path: '/heritage/torch-festival'
  },
  {
    title: '苗族蜡染',
    ethnic: '苗族',
    description: '苗族蜡染是用蜡刻画纹样后染色的传统工艺，图案精美，蕴含丰富的文化寓意，2009年被列入UNESCO非遗名录。',
    image: '/minority-project-photo/Heritage/miao-batik.jpg',
    isUNESCO: true,
    category: 'craft',
    path: '/heritage/miao-batik'
  },
  {
    title: '维吾尔木卡姆',
    ethnic: '维吾尔族',
    description: '木卡姆是维吾尔族的传统音乐艺术，集歌曲、舞蹈、民间音乐于一体，2005年被列入UNESCO人类非遗名录。',
    image: 'minority-project-photo/Heritage/muqam.jpg',
    isUNESCO: true,
    category: 'music_dance',
    path: '/heritage/muqam'
  },
  {
    title: '傣族孔雀舞',
    ethnic: '傣族',
    description: '孔雀舞是傣族传统舞蹈，舞者模仿孔雀优美的姿态，展现出傣族人民对孔雀的崇敬和对美好生活的向往。',
    image: 'minority-project-photo/Heritage/peacock-dance.jpg',
    isUNESCO: false,
    category: 'music_dance',
    path: '/heritage/peacock-dance'
  },
  {
    title: '蒙古族长调民歌',
    ethnic: '蒙古族',
    description: '长调民歌是蒙古族传统音乐的代表形式，以高亢、悠远的旋律著称，2005年被列入UNESCO非遗名录。',
    image: 'minority-project-photo/Heritage/mongol-long-song.jpg',
    isUNESCO: true,
    category: 'music_dance',
    path: '/heritage/mongol-long-song'
  },
  {
    title: '布依族传统刺绣',
    ethnic: '布依族',
    description: '布依族刺绣工艺精湛，色彩鲜艳，纹样多以自然景物和生活场景为主题，展现了布依族的审美观念。',
    image: 'minority-project-photo/Heritage/buyi-embroidery.jpg',
    isUNESCO: false,
    category: 'craft',
    path: '/heritage/buyi-embroidery'
  },
  {
    title: '彝族毕摩文化',
    ethnic: '彝族',
    description: '毕摩是彝族传统宗教信仰中的祭司，掌握着彝族的传统文化知识、历史记忆和宗教仪式。',
    image: 'minority-project-photo/Heritage/yi-bimo.jpg',
    isUNESCO: false,
    category: 'festival',
    path: '/heritage/yi-bimo'
  },
  {
    title: '壮族铜鼓艺术',
    ethnic: '壮族',
    description: '铜鼓是壮族重要的传统乐器和礼器，铜鼓制作工艺和铜鼓文化体现了壮族的历史智慧。',
    image: 'minority-project-photo/Heritage/zhuang-bronze-drum.jpg',
    isUNESCO: false,
    category: 'craft',
    path: '/heritage/zhuang-bronze-drum'
  },
  {
    title: '纳西族东巴文化',
    ethnic: '纳西族',
    description: '东巴文化以东巴文字和东巴经为核心，是研究纳西族历史文化的重要资料，2003年入选UNESCO记忆名录。',
    image: 'minority-project-photo/Heritage/dongba-culture.jpg',
    isUNESCO: true,
    category: 'festival',
    path: '/heritage/dongba-culture'
  },
  {
    title: '藏医药浴法',
    ethnic: '藏族',
    description: '藏医药浴法是藏族传统医学的重要组成部分，通过药物浸泡的方式治疗疾病，2018年被列入UNESCO非遗名录。',
    image: 'minority-project-photo/Heritage/tibetan-medicine-bathing.jpg',
    isUNESCO: true,
    category: 'medicine',
    path: '/heritage/tibetan-medicine-bathing'
  },
  {
    title: '哈尼梯田文化',
    ethnic: '哈尼族',
    description: '哈尼梯田是哈尼族人民创造的农业奇观，体现了人与自然和谐共生的智慧，2013年被列入UNESCO世界遗产名录。',
    image: 'minority-project-photo/Heritage/hani-terraces.jpg',
    isUNESCO: true,
    category: 'craft',
    path: '/heritage/hani-terraces'
  },
  {
    title: '土家族摆手舞',
    ethnic: '土家族',
    description: '摆手舞是土家族重要的传统舞蹈，一般在节庆、丰收或祭祀时表演，表达对自然和祖先的敬畏与感恩。',
    image: 'minority-project-photo/Heritage/tujia-hand-dance.jpg',
    isUNESCO: false,
    category: 'music_dance',
    path: '/heritage/tujia-hand-dance'
  },
  {
    title: '黎族传统纺染织绣技艺',
    ethnic: '黎族',
    description: '黎族纺织技艺包括纺、染、织、绣等工艺，图案丰富多彩，2009年被列入UNESCO急需保护的非遗名录。',
    image: 'minority-project-photo/Heritage/li-textile.jpg',
    isUNESCO: true,
    category: 'craft',
    path: '/heritage/li-textile'
  },
  {
    title: '回族清真饮食文化',
    ethnic: '回族',
    description: '清真饮食文化是回族重要的文化传统，反映了回族的宗教信仰、生活习俗和饮食智慧。',
    image: 'minority-project-photo/Heritage/hui-halal-food.jpg',
    isUNESCO: false,
    category: 'festival',
    path: '/heritage/hui-halal-food'
  },
  {
    title: '傈僳族刀杆节',
    ethnic: '傈僳族',
    description: '刀杆节是傈僳族传统节日，年轻人攀爬涂满油脂的刀杆，展示勇气和力量，祈求部落繁荣。',
    image: 'minority-project-photo/Heritage/lisu-knife-pole.jpg',
    isUNESCO: false,
    category: 'festival',
    path: '/heritage/lisu-knife-pole'
  }
])

// 根据搜索和分类筛选项目
const filteredItems = computed(() => {
  return heritageItems.value.filter(item => {
    // 搜索过滤
    const matchesSearch = searchQuery.value === '' || 
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.ethnic.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // 分类过滤
    const matchesCategory = selectedCategory.value === 'all' || item.category === selectedCategory.value
    
    return matchesSearch && matchesCategory
  })
})

// 处理分页
const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage)
})

const filteredHeritageItems = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredItems.value.slice(startIndex, endIndex)
})

// 改变页码
const changePage = (direction) => {
  const newPage = currentPage.value + direction
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 选择分类
const selectCategory = (category) => {
  selectedCategory.value = category
  currentPage.value = 1
}

// 搜索过滤
const filterHeritageItems = () => {
  currentPage.value = 1
}

// 显示详情
const showHeritageDetail = (item) => {
  router.push(item.path)
}

onMounted(() => {
  // 初始化加载
})
</script>

<style scoped>
.heritage-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-bottom: 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.top-decoration {
  height: 4px;
  background: linear-gradient(90deg, #e74c3c, #3498db, #2ecc71, #f39c12);
}

.content-section {
  margin-top: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 30px;
}

.section-title {
  font-size: 24px;
  margin-bottom: 12px;
  color: #333;
  font-weight: 600;
  position: relative;
  padding-left: 16px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 6px;
  height: 20px;
  background-color: #00A1D6;
  border-radius: 3px;
}

.section-desc {
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
}

/* 过滤控制区 */
.filter-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 16px;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-box input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.search-box input:focus {
  border-color: #00A1D6;
  box-shadow: 0 0 0 2px rgba(0, 161, 214, 0.2);
  outline: none;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-btn {
  padding: 8px 16px;
  background-color: #f1f1f1;
  border: none;
  border-radius: 20px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.filter-btn:hover {
  background-color: #e0e0e0;
}

.filter-btn.active {
  background-color: #00A1D6;
  color: white;
}

/* 百叶窗展示样式 */
.heritage-grid.louver-display {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.heritage-louver-item {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  position: relative;
  height: 350px;
  perspective: 1000px;
  cursor: pointer;
}

.heritage-louver-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.louver-image {
  width: 100%;
  height: 180px;
  position: relative;
  overflow: hidden;
  transition: all 0.5s ease;
}

.louver-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
}

.heritage-louver-item:hover .louver-image img {
  transform: scale(1.05);
}

.heritage-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(231, 76, 60, 0.85);
  color: white;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 3px;
  letter-spacing: 1px;
}

.louver-info {
  padding: 20px;
  transition: all 0.5s ease;
  background-color: white;
  height: 170px;
  transform-origin: top;
}

.louver-info h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ethnic-name {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
}

.item-desc {
  color: #777;
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}

.item-category {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 12px;
  color: white;
  position: absolute;
  bottom: 20px;
  left: 20px;
}

/* 百叶窗效果 */
.heritage-louver-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.05) 50.1%,
    rgba(0, 0, 0, 0.05) 100%
  );
  background-size: 100% 10px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 2;
}

.heritage-louver-item:hover::after {
  opacity: 1;
}

/* 分页控制 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0 10px;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: #00A1D6;
  color: white;
  border-color: #00A1D6;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 16px;
  color: #666;
}

@media (max-width: 768px) {
  .heritage-grid.louver-display {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-box {
    max-width: 100%;
  }
}
</style> 