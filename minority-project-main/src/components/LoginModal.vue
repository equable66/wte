<template>
  <div class="modal-backdrop" v-if="show" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ isRegister ? '注册账号' : '账号登录' }}</h3>
        <button class="close-btn" @click="close">&times;</button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label for="username">账号</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            placeholder="请输入账号" 
            @keyup.enter="isRegister ? register() : login()"
          >
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="请输入密码" 
            @keyup.enter="isRegister ? register() : login()"
          >
        </div>
        
        <div class="form-group" v-if="isRegister">
          <label for="confirmPassword">确认密码</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            placeholder="请再次输入密码" 
            @keyup.enter="register"
          >
        </div>
        
        <div class="error-message" v-if="errorMsg">{{ errorMsg }}</div>
      </div>
      
      <div class="modal-footer">
        <button 
          class="switch-btn" 
          @click="isRegister = !isRegister"
        >
          {{ isRegister ? '已有账号？去登录' : '没有账号？去注册' }}
        </button>
        
        <button 
          class="submit-btn" 
          @click="isRegister ? register() : login()"
          :disabled="isSubmitting"
        >
          {{ isRegister ? '注册' : '登录' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'login-success'])

// 表单数据
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const isSubmitting = ref(false)
const isRegister = ref(false)

// 监听显示状态，重置表单
watch(() => props.show, (newVal) => {
  if (newVal) {
    resetForm()
  }
})

// 重置表单
const resetForm = () => {
  username.value = ''
  password.value = ''
  confirmPassword.value = ''
  errorMsg.value = ''
  isSubmitting.value = false
  isRegister.value = false
}

// 关闭模态框
const close = () => {
  emit('close')
}

// 登录逻辑
const login = async () => {
  // 表单验证
  if (!username.value || !password.value) {
    errorMsg.value = '请输入账号和密码'
    return
  }
  
  try {
    isSubmitting.value = true
    errorMsg.value = ''
    
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟成功登录
    console.log('登录成功', { username: username.value })
    
    // 通知父组件登录成功
    emit('login-success', { username: username.value })
    
    // 关闭模态框
    close()
  } catch (error) {
    errorMsg.value = '登录失败，请检查账号和密码'
    console.error('登录错误:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 注册逻辑
const register = async () => {
  // 表单验证
  if (!username.value || !password.value || !confirmPassword.value) {
    errorMsg.value = '请填写所有字段'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    errorMsg.value = '两次输入的密码不一致'
    return
  }
  
  try {
    isSubmitting.value = true
    errorMsg.value = ''
    
    // 模拟注册请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 注册成功后自动登录
    console.log('注册成功', { username: username.value })
    
    // 通知父组件登录成功
    emit('login-success', { username: username.value })
    
    // 关闭模态框
    close()
  } catch (error) {
    errorMsg.value = '注册失败，请稍后再试'
    console.error('注册错误:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s;
  overflow: hidden;
  font-family: 'Ma Shan Zheng', cursive, sans-serif;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #8B5A2B;
  color: #fff;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: normal;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #fff;
}

.close-btn:hover {
  color: #f0f0f0;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
  font-family: sans-serif;
}

.form-group input:focus {
  outline: none;
  border-color: #8B5A2B;
  box-shadow: 0 0 0 2px rgba(139, 90, 43, 0.2);
}

.error-message {
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 5px;
  font-family: sans-serif;
}

.modal-footer {
  padding: 15px 20px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
}

.switch-btn {
  background: none;
  border: none;
  color: #8B5A2B;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  font-family: sans-serif;
}

.switch-btn:hover {
  text-decoration: underline;
}

.submit-btn {
  background-color: #8B5A2B;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #A67C52;
}

.submit-btn:disabled {
  background-color: #d3b596;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@media (max-width: 480px) {
  .modal-content {
    width: 90%;
  }
}
</style> 