<template>
  <div class="avatar-container" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
    <div class="avatar">
      <img src="/avatar.svg" alt="用户头像" />
      <div class="avatar-decoration" v-if="showDropdown"></div>
    </div>
    
    <transition name="dropdown">
      <div v-if="showDropdown" class="dropdown-menu">
        <div class="dropdown-arrow"></div>
        <template v-if="isLoggedIn">
          <div class="menu-header">
            <div class="user-info">
              <strong>{{ userInfo.username }}</strong>
              <span class="level">Lv.0</span>
            </div>
          </div>
          <div class="menu-divider"></div>
          <div class="menu-item" @click="goToProfile">
            <i class="fas fa-user"></i>
            个人中心
          </div>
          <div class="menu-item" @click="handleLogout">
            <i class="fas fa-sign-out-alt"></i>
            退出登录
          </div>
        </template>
        <template v-else>
          <div class="menu-header">
            <p>登录后参与交流</p>
          </div>
          <div class="menu-divider"></div>
          <div class="menu-item login-item" @click="openLoginModal">
            <i class="fas fa-sign-in-alt"></i>
            点击登录
          </div>
        </template>
      </div>
    </transition>
  </div>
  
  <!-- 登录对话框 -->
  <LoginModal
    :show="showLoginModal"
    @close="showLoginModal = false"
    @login-success="handleLoginSuccess"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginModal from './LoginModal.vue'

// 模拟登录状态，实际项目中应该从状态管理库获取
const isLoggedIn = ref(false)
const showDropdown = ref(false)
const showLoginModal = ref(false)
const userInfo = ref({ username: '用户名称' })
const router = useRouter()

// 打开登录对话框
const openLoginModal = () => {
  showLoginModal.value = true
  showDropdown.value = false
}

// 处理登录成功
const handleLoginSuccess = (data) => {
  isLoggedIn.value = true
  userInfo.value = data
}

const handleLogin = () => {
  // 现在改为打开登录对话框
  openLoginModal()
}

const handleLogout = () => {
  // 实现登出逻辑
  isLoggedIn.value = false
  // 可以添加其他登出操作，如清除token等
}

const goToProfile = () => {
  // 跳转到个人中心
  router.push('/profile')
}
</script>

<style scoped>
.avatar-container {
  position: relative;
  display: inline-block;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background-color: #fff;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 头像装饰效果 - 悬停时的环形光效 */
.avatar-decoration {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  border: 2px solid #00A1D6;
  box-shadow: 0 0 8px rgba(0, 161, 214, 0.8);
  animation: pulse 1.5s infinite;
  z-index: -1;
}

@keyframes pulse {
  0% { box-shadow: 0 0 8px rgba(0, 161, 214, 0.8); }
  50% { box-shadow: 0 0 12px rgba(0, 161, 214, 0.5); }
  100% { box-shadow: 0 0 8px rgba(0, 161, 214, 0.8); }
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  padding: 0;
  min-width: 220px;
  z-index: 1000;
  overflow: hidden;
}

/* 小三角形指示器 */
.dropdown-arrow {
  position: absolute;
  top: -8px;
  right: 16px;
  width: 16px;
  height: 16px;
  background-color: white;
  transform: rotate(45deg);
  box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.05);
}

.menu-header {
  padding: 16px;
  text-align: center;
  background-color: #f9f9f9;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.level {
  font-size: 12px;
  color: #00A1D6;
  background-color: rgba(0, 161, 214, 0.1);
  padding: 1px 6px;
  border-radius: 3px;
}

.menu-divider {
  height: 1px;
  background-color: #f0f0f0;
  margin: 0;
}

.menu-item {
  padding: 12px 16px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-item:hover {
  background-color: #f4f4f4;
  color: #00A1D6;
}

.login-item {
  color: #00A1D6;
  justify-content: center;
  font-weight: 500;
}

.login-item:hover {
  background-color: rgba(0, 161, 214, 0.1);
}

.menu-item i {
  font-size: 1.1em;
  color: #666;
}

.menu-item:hover i {
  color: #00A1D6;
}

/* 下拉菜单动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.25s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>