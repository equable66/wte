<template>
  <div class="profile-page">
    <!-- 顶部装饰 -->
    <div class="top-decoration"></div>
    
    <div class="container">
      <!-- 复用主站标题 -->
      <page-header title="个人中心" subtitle="管理您的个人信息和收藏内容" />
      
      <!-- 导航栏 -->
      <main-nav />
      
      <!-- 主要内容 -->
      <main class="profile-content">
        <div class="profile-layout">
          <!-- 侧边栏导航 -->
          <div class="profile-sidebar">
            <div class="user-card">
              <div class="user-avatar">
                <img src="/avatar.svg" alt="用户头像" />
                <div class="edit-avatar">
                  <i class="fas fa-camera"></i>
                </div>
              </div>
              <h2 class="username">{{ userInfo.username }}</h2>
              <div class="user-level">
                <span class="level-tag">Lv.{{ userInfo.level }}</span>
                <div class="level-progress">
                  <div class="level-bar" :style="{width: userInfo.exp + '%'}"></div>
                </div>
                <span class="exp-text">{{ userInfo.exp }}/100</span>
              </div>
              <p class="join-date">加入时间：{{ userInfo.joinDate }}</p>
            </div>
            
            <div class="sidebar-menu">
              <div 
                v-for="(item, index) in menuItems" 
                :key="index"
                class="menu-item"
                :class="{ active: activeTab === item.value }"
                @click="activeTab = item.value"
              >
                <i :class="item.icon"></i>
                <span>{{ item.label }}</span>
              </div>
            </div>
          </div>
          
          <!-- 主内容区域 -->
          <div class="profile-main">
            <!-- 基本资料 -->
            <div v-if="activeTab === 'profile'" class="tab-content">
              <h3 class="section-title">基本资料</h3>
              <div class="profile-form">
                <div class="form-group">
                  <label>用户名</label>
                  <input type="text" v-model="profileData.username" placeholder="请输入用户名" />
                </div>
                <div class="form-group">
                  <label>邮箱</label>
                  <input type="email" v-model="profileData.email" placeholder="请输入邮箱地址" />
                  <div class="field-tip" v-if="!isEmailValid && profileData.email">
                    <i class="fas fa-exclamation-circle"></i>
                    请输入有效的邮箱地址
                  </div>
                </div>
                <div class="form-group">
                  <label>民族</label>
                  <select v-model="profileData.ethnicity">
                    <option value="">请选择</option>
                    <option v-for="item in ethnicList" :key="item" :value="item">{{ item }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>个人简介</label>
                  <textarea v-model="profileData.bio" placeholder="请输入个人简介" rows="4"></textarea>
                </div>
                <div class="form-group">
                  <label>兴趣标签</label>
                  <div class="tag-input-container">
                    <input 
                      type="text" 
                      v-model="newTag" 
                      placeholder="添加兴趣标签（按回车键添加）" 
                      @keydown.enter.prevent="addTag"
                      :maxlength="20"
                    />
                    <button class="btn-add-tag" @click.prevent="addTag" :disabled="!newTag.trim()">
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                  <div class="tag-list" v-if="profileData.interests.length > 0">
                    <span 
                      v-for="(tag, index) in profileData.interests" 
                      :key="index"
                      class="tag"
                    >
                      <span class="tag-text">{{ tag }}</span>
                      <button class="btn-remove-tag" @click="removeTag(index)"></button>
                    </span>
                  </div>
                  <div class="tag-empty" v-else>
                    <i class="fas fa-tag"></i>
                    <span>暂无兴趣标签</span>
                  </div>
                </div>
                <div class="form-actions">
                  <button class="btn-save" @click="saveProfile" :disabled="!isEmailValid && profileData.email">保存修改</button>
                </div>
              </div>
            </div>
            
            <!-- 我的收藏 -->
            <div v-if="activeTab === 'favorites'" class="tab-content">
              <h3 class="section-title">我的收藏</h3>
              <div class="empty-state" v-if="favorites.length === 0">
                <img src="/empty-box.svg" alt="暂无收藏" />
                <p>您暂未收藏任何内容</p>
                <button class="btn-explore" @click="router.push('/knowledge')">去浏览更多内容</button>
              </div>
              <div class="favorites-grid" v-else>
                <div class="favorite-item" v-for="(item, index) in favorites" :key="index">
                  <div class="favorite-image">
                    <img :src="item.image" :alt="item.title" />
                  </div>
                  <div class="favorite-info">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.category }}</p>
                  </div>
                  <div class="favorite-actions">
                    <button class="btn-view" @click="router.push(item.path)">查看</button>
                    <button class="btn-remove" @click="removeFavorite(index)">移除</button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 访问历史 -->
            <div v-if="activeTab === 'history'" class="tab-content">
              <h3 class="section-title">访问历史</h3>
              <div class="history-list" v-if="history.length > 0">
                <div class="history-item" v-for="(item, index) in history" :key="index">
                  <div class="history-time">{{ item.time }}</div>
                  <div class="history-content">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.description }}</p>
                  </div>
                  <div class="history-actions">
                    <button class="btn-revisit" @click="router.push(item.path)">
                      <i class="fas fa-external-link-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="empty-state" v-else>
                <img src="/history-empty.svg" alt="暂无历史记录" />
                <p>暂无访问历史记录</p>
              </div>
            </div>
            
            <!-- 账号安全 -->
            <div v-if="activeTab === 'security'" class="tab-content">
              <h3 class="section-title">账号安全</h3>
              <div class="security-form">
                <div class="form-group">
                  <label>修改密码</label>
                  <input type="password" v-model="securityData.oldPassword" placeholder="当前密码" />
                </div>
                <div class="form-group">
                  <input type="password" v-model="securityData.newPassword" placeholder="新密码" />
                </div>
                <div class="form-group">
                  <input type="password" v-model="securityData.confirmPassword" placeholder="确认新密码" />
                </div>
                <div class="form-actions">
                  <button class="btn-save" @click="changePassword">修改密码</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import MainNav from '@/components/MainNav.vue'

const router = useRouter()
const activeTab = ref('profile')
const newTag = ref('')

// 用户信息
const userInfo = reactive({
  username: '云中漫步',
  level: 2,
  exp: 65,
  joinDate: '2023-09-15'
})

// 侧边栏菜单项
const menuItems = [
  { label: '基本资料', value: 'profile', icon: 'fas fa-user' },
  { label: '我的收藏', value: 'favorites', icon: 'fas fa-star' },
  { label: '访问历史', value: 'history', icon: 'fas fa-history' },
  { label: '账号安全', value: 'security', icon: 'fas fa-shield-alt' }
]

// 民族列表
const ethnicList = [
  '汉族', '蒙古族', '回族', '藏族', '维吾尔族', '苗族', '彝族', '壮族', '布依族', '朝鲜族',
  '满族', '侗族', '瑶族', '白族', '土家族', '哈尼族', '哈萨克族', '傣族', '黎族', '傈僳族',
  '佤族', '畲族', '高山族', '拉祜族', '水族', '东乡族', '纳西族', '景颇族', '柯尔克孜族', '土族',
  '达斡尔族', '仫佬族', '羌族', '布朗族', '撒拉族', '毛南族', '仡佬族', '锡伯族', '阿昌族', '普米族',
  '塔吉克族', '怒族', '乌孜别克族', '俄罗斯族', '鄂温克族', '德昂族', '保安族', '裕固族', '京族', '塔塔尔族',
  '独龙族', '鄂伦春族', '赫哲族', '门巴族', '珞巴族', '基诺族'
]

// 个人资料表单数据
const profileData = reactive({
  username: '云中漫步',
  email: 'user@example.com',
  ethnicity: '汉族',
  bio: '热爱民族文化，致力于民族文化研究与传播。',
  interests: ['传统音乐', '非物质文化遗产', '民族历史']
})

// 验证邮箱
const isEmailValid = computed(() => {
  if (!profileData.email) return true
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(profileData.email)
})

// 收藏列表
const favorites = ref([
  {
    title: '侗族大歌',
    category: '传统音乐',
    image: 'https://via.placeholder.com/400x250?text=侗族大歌',
    path: '/heritage/dong-song'
  },
  {
    title: '彝族火把节',
    category: '民族节日',
    image: 'https://via.placeholder.com/400x250?text=彝族火把节',
    path: '/heritage/torch-festival'
  },
  {
    title: '苗族蜡染',
    category: '传统手工艺',
    image: 'https://via.placeholder.com/400x250?text=苗族蜡染',
    path: '/heritage/miao-batik'
  }
])

// 历史记录
const history = ref([
  {
    title: '纳西族东巴文化',
    description: '浏览了纳西族东巴文化的详细介绍和相关图片。',
    time: '2023-12-15 14:30',
    path: '/heritage/dongba-culture'
  },
  {
    title: '民族地图',
    description: '查看了中国少数民族地理分布地图。',
    time: '2023-12-14 10:15',
    path: '/ethnic-map'
  },
  {
    title: '藏族传统节日',
    description: '了解了藏族各大传统节日的习俗和庆祝方式。',
    time: '2023-12-10 16:45',
    path: '/festivals'
  }
])

// 安全设置表单数据
const securityData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 添加新标签
const addTag = () => {
  const trimmedTag = newTag.value.trim()
  if (trimmedTag && !profileData.interests.includes(trimmedTag)) {
    profileData.interests.push(trimmedTag)
    newTag.value = ''
  }
}

// 移除标签
const removeTag = (index) => {
  profileData.interests.splice(index, 1)
}

// 保存个人资料
const saveProfile = () => {
  // 验证邮箱
  if (!isEmailValid.value && profileData.email) {
    alert('请输入有效的邮箱地址')
    return
  }
  
  // 这里应该是保存到服务器的逻辑
  alert('个人资料保存成功！')
}

// 移除收藏
const removeFavorite = (index) => {
  favorites.value.splice(index, 1)
}

// 修改密码
const changePassword = () => {
  if (!securityData.oldPassword || !securityData.newPassword || !securityData.confirmPassword) {
    alert('请填写完整密码信息')
    return
  }
  
  if (securityData.newPassword !== securityData.confirmPassword) {
    alert('两次输入的新密码不一致')
    return
  }
  
  // 这里应该是修改密码的逻辑
  alert('密码修改成功！')
  
  // 清空表单
  securityData.oldPassword = ''
  securityData.newPassword = ''
  securityData.confirmPassword = ''
}
</script>

<style scoped>
.profile-page {
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

.profile-content {
  margin-top: 30px;
}

.profile-layout {
  display: flex;
  gap: 30px;
}

/* 侧边栏样式 */
.profile-sidebar {
  width: 280px;
  flex-shrink: 0;
}

.user-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto 16px;
  position: relative;
  background-color: #f8f9fa;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.edit-avatar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 32px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s;
}

.user-avatar:hover .edit-avatar {
  opacity: 1;
}

.username {
  font-size: 18px;
  margin: 0 0 12px;
  color: #333;
}

.user-level {
  margin: 0 0 16px;
}

.level-tag {
  display: inline-block;
  font-size: 12px;
  color: #00A1D6;
  background-color: rgba(0, 161, 214, 0.1);
  padding: 2px 8px;
  border-radius: 3px;
  margin-bottom: 8px;
}

.level-progress {
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  margin: 8px 0;
  overflow: hidden;
}

.level-bar {
  height: 100%;
  background-color: #00A1D6;
  border-radius: 3px;
}

.exp-text {
  font-size: 12px;
  color: #666;
}

.join-date {
  font-size: 12px;
  color: #888;
  margin: 8px 0 0;
}

.sidebar-menu {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.menu-item {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #444;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.menu-item i {
  width: 20px;
  text-align: center;
  color: #666;
}

.menu-item:hover {
  background-color: #f5f5f5;
  color: #00A1D6;
}

.menu-item:hover i {
  color: #00A1D6;
}

.menu-item.active {
  background-color: #f5f5f5;
  color: #00A1D6;
  border-left-color: #00A1D6;
}

.menu-item.active i {
  color: #00A1D6;
}

/* 主内容区域样式 */
.profile-main {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 30px;
  min-height: 600px;
}

.section-title {
  font-size: 20px;
  margin: 0 0 24px;
  position: relative;
  padding-left: 16px;
  color: #333;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  width: 4px;
  height: 18px;
  background-color: #00A1D6;
  border-radius: 2px;
}

/* 表单样式 */
.form-group {
  margin-bottom: 24px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 15px;
  color: #444;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #00A1D6;
  box-shadow: 0 0 0 2px rgba(0, 161, 214, 0.2);
  outline: none;
}

.field-tip {
  color: #e74c3c;
  font-size: 13px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.field-tip i {
  font-size: 14px;
}

.tag-input-container {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.btn-add-tag {
  padding: 10px 20px;
  background-color: #00A1D6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add-tag:hover {
  background-color: #0093c4;
}

.btn-add-tag:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px 5px 12px;
  background-color: rgba(0, 161, 214, 0.1);
  border-radius: 16px;
  font-size: 14px;
  color: #00A1D6;
  transition: all 0.3s;
  margin-bottom: 10px;
  max-width: 100%;
  border: 1px solid rgba(0, 161, 214, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tag:hover {
  background-color: rgba(0, 161, 214, 0.2);
  transform: translateY(-1px);
}

.tag-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.btn-remove-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background-color: transparent;
  color: #00A1D6;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
  margin-left: 8px;
  font-size: 12px;
  position: relative;
}

.btn-remove-tag:hover {
  background-color: rgba(244, 67, 54, 0.15);
  color: #f44336;
  transform: rotate(90deg);
}

.btn-remove-tag::before {
  content: '';
  position: absolute;
  left: 4px;
  right: 4px;
  top: 8px;
  height: 2px;
  background-color: currentColor;
  border-radius: 1px;
  transform: rotate(45deg);
}

.btn-remove-tag::after {
  content: '';
  position: absolute;
  left: 4px;
  right: 4px;
  top: 8px;
  height: 2px;
  background-color: currentColor;
  border-radius: 1px;
  transform: rotate(-45deg);
}

.tag-empty {
  text-align: center;
  padding: 60px 20px;
}

.tag-empty i {
  font-size: 24px;
  color: #888;
  margin-bottom: 20px;
}

.tag-empty span {
  font-size: 16px;
  color: #888;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}

.btn-save {
  padding: 10px 24px;
  background-color: #00A1D6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-save:hover:not(:disabled) {
  background-color: #0093c4;
}

.btn-save:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* 收藏列表样式 */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.favorite-item {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s;
}

.favorite-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.favorite-image {
  height: 150px;
  overflow: hidden;
}

.favorite-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s;
}

.favorite-item:hover .favorite-image img {
  transform: scale(1.05);
}

.favorite-info {
  padding: 16px;
}

.favorite-info h4 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #333;
}

.favorite-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.favorite-actions {
  display: flex;
  padding: 0 16px 16px;
  gap: 10px;
}

.btn-view, .btn-remove {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-view {
  background-color: #00A1D6;
  color: white;
  flex: 1;
}

.btn-view:hover {
  background-color: #0093c4;
}

.btn-remove {
  background-color: #f1f1f1;
  color: #666;
}

.btn-remove:hover {
  background-color: #f44336;
  color: white;
}

/* 历史记录样式 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-item {
  display: flex;
  align-items: start;
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: all 0.3s;
}

.history-item:hover {
  background-color: #f1f1f1;
}

.history-time {
  width: 150px;
  flex-shrink: 0;
  font-size: 14px;
  color: #888;
}

.history-content {
  flex: 1;
}

.history-content h4 {
  margin: 0 0 6px;
  font-size: 16px;
  color: #333;
}

.history-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.history-actions {
  flex-shrink: 0;
  margin-left: 16px;
}

.btn-revisit {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f1f1f1;
  color: #666;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-revisit:hover {
  background-color: #00A1D6;
  color: white;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-state img {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-state p {
  font-size: 16px;
  color: #888;
  margin-bottom: 20px;
}

.btn-explore {
  padding: 10px 20px;
  background-color: #00A1D6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-explore:hover {
  background-color: #0093c4;
}

/* 响应式调整 */
@media (max-width: 900px) {
  .profile-layout {
    flex-direction: column;
  }
  
  .profile-sidebar {
    width: 100%;
  }
  
  .sidebar-menu {
    display: flex;
    flex-wrap: wrap;
  }
  
  .menu-item {
    flex: 1;
    min-width: 120px;
    justify-content: center;
    border-left: none;
    border-bottom: 3px solid transparent;
  }
  
  .menu-item.active {
    border-left-color: transparent;
    border-bottom-color: #00A1D6;
  }
  
  .history-item {
    flex-direction: column;
    gap: 10px;
  }
  
  .history-time {
    width: 100%;
  }
  
  .history-actions {
    margin-left: 0;
    align-self: flex-end;
  }
}

@media (max-width: 600px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }
  
  .sidebar-menu {
    flex-direction: column;
  }
  
  .menu-item {
    width: 100%;
  }
}
</style> 