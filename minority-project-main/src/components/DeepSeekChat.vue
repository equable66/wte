<template>
  <div class="deepseek-chat" :class="{ 'is-open': isOpen }">
    <div class="chat-trigger" @click="toggleChat" v-if="!isOpen">
      <i class="fas fa-comments"></i>
      <span>AI助手</span>
    </div>
    
    <div class="chat-window" v-if="isOpen">
      <div class="chat-header">
        <div class="chat-title">
          <i class="fas fa-comment-dots"></i>
          <span>民族文化AI助手</span>
        </div>
        <button class="close-btn" @click="toggleChat" title="关闭对话">
          <i class="fas fa-times-circle"></i>
        </button>
      </div>
      
      <div class="chat-messages" ref="messagesContainer">
        <div class="message system">
          <div class="message-content">
            <p>您好，我是民族文化AI助手，可以回答您关于中国少数民族文化的问题。请问有什么可以帮助您的？</p>
          </div>
        </div>
        
        <div v-for="(message, index) in messages" :key="index" class="message" :class="message.role">
          <div class="message-avatar" v-if="message.role === 'user'">
            <i class="fas fa-user-circle"></i>
          </div>
          <div class="message-avatar" v-else>
            <i class="fas fa-robot"></i>
          </div>
          <div class="message-content">
            <p v-if="message.role === 'assistant' && message.content === ''" class="typing">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </p>
            <p v-else v-html="formatMessage(message.content)"></p>
          </div>
        </div>
      </div>
      
      <div class="chat-input">
        <textarea 
          ref="inputField"
          v-model="userInput" 
          placeholder="请输入您的问题..." 
          @keypress.enter.prevent="sendMessage"
          :disabled="isLoading"
        ></textarea>
        <button class="send-btn" @click="sendMessage" :disabled="!userInput.trim() || isLoading">
          <i class="fas fa-paper-plane" v-if="!isLoading"></i>
          <i class="fas fa-spinner fa-spin" v-else></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'

const props = defineProps({
  apiKey: {
    type: String,
    required: true
  }
})

const isOpen = ref(false)
const userInput = ref('')
const messages = ref([])
const isLoading = ref(false)
const messagesContainer = ref(null)
const inputField = ref(null)

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      inputField.value.focus()
    })
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 监听消息变化，自动滚动到底部
watch(messages, () => {
  scrollToBottom()
}, { deep: true })

const formatMessage = (content) => {
  if (!content) return ''
  
  // 将URL转换为链接
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const withLinks = content.replace(urlRegex, '<a href="$1" target="_blank">$1</a>')
  
  // 将换行符转换为<br>
  return withLinks.replace(/\n/g, '<br>')
}

const sendMessage = async () => {
  const message = userInput.value.trim()
  if (!message || isLoading.value) return
  
  // 添加用户消息
  messages.value.push({ role: 'user', content: message })
  userInput.value = ''
  
  // 添加AI临时消息（用于显示加载动画）
  messages.value.push({ role: 'assistant', content: '' })
  isLoading.value = true
  
  try {
    // 准备API请求
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${props.apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个关于中国少数民族文化的专家，熟悉各民族的历史、风俗、服饰、节日等知识。请用准确、客观、通俗的语言回答用户的问题。如果不确定，请坦诚说明而不是编造信息。'
          },
          ...messages.value.filter(m => m.content !== '').map(m => ({
            role: m.role,
            content: m.content
          }))
        ],
        temperature: 0.7
      })
    })
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`)
    }
    
    const data = await response.json()
    
    // 更新最后一条消息为AI回复
    const lastIndex = messages.value.length - 1
    if (lastIndex >= 0 && messages.value[lastIndex].role === 'assistant') {
      messages.value[lastIndex].content = data.choices[0].message.content
    }
  } catch (error) {
    console.error('与AI交流时出错:', error)
    
    // 更新最后一条消息为错误消息
    const lastIndex = messages.value.length - 1
    if (lastIndex >= 0 && messages.value[lastIndex].role === 'assistant') {
      messages.value[lastIndex].content = '抱歉，我遇到了一些问题。请稍后再试。'
    }
  } finally {
    isLoading.value = false
  }
}

// 初始化时滚动到底部
onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.deepseek-chat {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
}

.chat-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8B5A2B, #A67C52);
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  box-shadow: 0 5px 15px rgba(139, 90, 43, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0 20px;
  position: relative;
}

.chat-trigger i {
  font-size: 24px;
  transition: transform 0.3s ease;
  margin-right: 8px;
}

.chat-trigger::after {
  content: '';
  position: absolute;
  top: -5px;
  right: -5px;
  width: 15px;
  height: 15px;
  background-color: #ff5252;
  border-radius: 50%;
  border: 2px solid #fff;
  display: none;
}

.chat-trigger.has-notification::after {
  display: block;
  animation: pulse-notification 2s infinite;
}

@keyframes pulse-notification {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.chat-trigger span {
  font-size: 16px;
  opacity: 0;
  max-width: 0;
  white-space: nowrap;
  transition: all 0.3s ease;
  font-weight: 500;
}

.chat-trigger:hover {
  width: 140px;
  background: linear-gradient(135deg, #A67C52, #8B5A2B);
  transform: translateY(-3px);
}

.chat-trigger:hover i {
  transform: rotate(10deg);
}

.chat-trigger:hover span {
  opacity: 1;
  max-width: 80px;
  margin-left: 4px;
}

.chat-window {
  width: 360px;
  height: 500px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
  border: 1px solid rgba(139, 90, 43, 0.2);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #8B5A2B, #A67C52);
  color: white;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.chat-title {
  display: flex;
  align-items: center;
  font-weight: 600;
}

.chat-title i {
  margin-right: 10px;
  font-size: 20px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s ease;
  padding: 6px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.close-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0);
  border-radius: 50%;
  transform: scale(0);
  transition: transform 0.3s ease, background 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

.close-btn:hover::before {
  transform: scale(1);
  background: rgba(255, 255, 255, 0.1);
}

.close-btn:hover i {
  transform: rotate(90deg);
}

.close-btn i {
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f8f4eb;
  background-image: url('https://www.transparenttextures.com/patterns/rice-paper.png');
}

.message {
  display: flex;
  margin-bottom: 15px;
}

.message-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.message.user .message-avatar {
  background: #e6f2ff;
  color: #007bff;
}

.message.assistant .message-avatar {
  background: #8B5A2B;
  color: white;
}

.message.assistant .message-avatar i {
  animation: assistant-icon 2s infinite;
}

@keyframes assistant-icon {
  0% { transform: scale(1); }
  10% { transform: scale(1.1); }
  20% { transform: scale(1); }
  100% { transform: scale(1); }
}

.message.system {
  margin-bottom: 20px;
}

.message.system .message-content {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #0050b3;
  width: 100%;
}

.message-content {
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  max-width: 80%;
  position: relative;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.user .message-content {
  background: #e6f2ff;
  margin-left: auto;
  border-left: 3px solid #007bff;
}

.message.assistant .message-content {
  border-left: 3px solid #8B5A2B;
}

.message.user {
  flex-direction: row-reverse;
}

.message.user .message-avatar {
  margin-right: 0;
  margin-left: 10px;
}

.message-content p {
  margin: 0;
  line-height: 1.5;
}

.chat-input {
  padding: 15px;
  background: white;
  border-top: 1px solid #e1e4e8;
  display: flex;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

textarea {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 12px 15px;
  resize: none;
  height: 45px;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

textarea:focus {
  border-color: #8B5A2B;
  box-shadow: 0 0 0 3px rgba(139, 90, 43, 0.2);
}

.send-btn {
  width: 45px;
  height: 45px;
  margin-left: 10px;
  background: linear-gradient(135deg, #8B5A2B, #A67C52);
  border: none;
  border-radius: 50%;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 8px rgba(139, 90, 43, 0.3);
}

.send-btn i {
  transition: transform 0.2s ease;
}

.send-btn:hover {
  background: linear-gradient(135deg, #A67C52, #8B5A2B);
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(139, 90, 43, 0.4);
}

.send-btn:hover i {
  transform: translateX(2px);
}

.send-btn:active {
  transform: translateY(0);
}

.send-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* 打字动画 */
.typing {
  display: flex;
  align-items: center;
  height: 20px;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #8B5A2B;
  margin-right: 4px;
  animation: typing 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* 媒体查询 */
@media (max-width: 576px) {
  .chat-window {
    width: 100%;
    height: 100%;
    position: fixed;
    bottom: 0;
    right: 0;
    border-radius: 0;
  }
  
  .chat-trigger {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    padding: 0;
  }
  
  .chat-trigger i {
    margin-right: 0;
  }
  
  .chat-trigger:hover {
    width: 55px;
    border-radius: 50%;
  }
  
  .chat-trigger:hover span {
    opacity: 0;
    max-width: 0;
  }
}
</style> 