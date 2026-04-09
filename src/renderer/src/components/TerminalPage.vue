<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

// 终端引用
const terminalRef = ref<HTMLDivElement | null>(null)

// 终端配置
const shellConfig = ref({
  shell: 'cmd.exe'
})

// 输入命令
const command = ref('')

// 命令历史
const history = ref<Array<{
  type: 'command' | 'output' | 'error'
  content: string
  time: string
}>>([])

// 是否正在运行
const isRunning = ref(false)

// 加载终端配置
async function loadConfig() {
  try {
    const result = await window.api.getTerminalConfig()
    if (result.success) {
      shellConfig.value.shell = result.shell
    }
  } catch (e) {
    console.error('加载终端配置失败:', e)
  }
}

// 添加到历史
function addToHistory(type: 'command' | 'output' | 'error', content: string) {
  const now = new Date()
  const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  
  // 分割多行内容
  const lines = content.split('\n')
  for (const line of lines) {
    if (line.trim()) {
      history.value.push({ type, content: line, time })
    }
  }
  
  // 滚动到底部
  nextTick(() => {
    if (terminalRef.value) {
      terminalRef.value.scrollTop = terminalRef.value.scrollHeight
    }
  })
}

// 清除终端
function clearTerminal() {
  history.value = []
}

// 打开外部终端
async function openExternalTerminal() {
  await window.api.openTerminal()
}

onMounted(() => {
  loadConfig()
  addToHistory('output', '欢迎使用终端 - 输入命令并按 Enter 执行')
  addToHistory('output', `Shell: ${shellConfig.value.shell}`)
  addToHistory('output', '提示: 点击右下角"打开外部终端"可使用完整终端功能')
  addToHistory('output', '---')
})
</script>

<template>
  <div class="terminal-page">
    <div class="page-header">
      <div class="header-left">
        <h2>💻 终端</h2>
        <p class="subtitle">命令行工具</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" @click="clearTerminal">
          🗑 清除
        </button>
        <button class="btn btn-primary" @click="openExternalTerminal">
          📂 打开外部终端
        </button>
      </div>
    </div>
    
    <div class="terminal-container">
      <!-- 终端输出 -->
      <div ref="terminalRef" class="terminal-output">
        <div 
          v-for="(item, index) in history" 
          :key="index"
          class="history-item"
          :class="item.type"
        >
          <span class="time">{{ item.time }}</span>
          <span class="content">{{ item.content }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.terminal-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.header-left h2 {
  font-size: 24px;
  margin-bottom: var(--spacing-xs);
}

.subtitle {
  color: var(--color-text-secondary);
  font-size: 14px;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.terminal-container {
  flex: 1;
  background: #1e1e1e;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.terminal-output {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
}

.history-item {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: 2px;
}

.history-item.command {
  color: #4fc3f7;
}

.history-item.command .content::before {
  content: '';
}

.history-item.output {
  color: #e0e0e0;
}

.history-item.error {
  color: #ef5350;
}

.time {
  color: #666;
  font-size: 11px;
  flex-shrink: 0;
  width: 70px;
}

.content {
  word-break: break-all;
}

.terminal-input {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: #252526;
  border-top: 1px solid #333;
}

.prompt {
  color: #4fc3f7;
  font-size: 18px;
  font-weight: bold;
}

.command-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #e0e0e0;
  font-family: inherit;
  font-size: 13px;
  outline: none;
}

.command-input::placeholder {
  color: #666;
}

.command-input:disabled {
  opacity: 0.5;
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.btn-secondary {
  background: var(--color-bg-tertiary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-bg-secondary);
}
</style>
