<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 系统信息
const systemInfo = ref<{
  cpu: { usage: number; cores: number }
  memory: { total: number; used: number; usage: number }
  disk: Array<{ mount: string; total: number; used: number; usage: number }>
  os: { platform: string; release: string }
} | null>(null)

// API 使用情况
const apiUsage = ref({
  today: { requests: 0, tokens: 0 },
  thisWeek: { requests: 0, tokens: 0 },
  thisMonth: { requests: 0, tokens: 0 }
})
const apiUsageNote = ref('')
const isLoadingApiUsage = ref(false)

// 模型使用分布
const modelUsage = ref<Array<{ name: string; usage: number; requests: number }>>([])
const modelUsageNote = ref('')
const isLoadingModelUsage = ref(false)

// 刷新状态
const isRefreshing = ref(false)
let refreshInterval: number | null = null

onMounted(async () => {
  await loadSystemInfo()
  await loadApiUsage()
  await loadModelUsage()
  startAutoRefresh()
})

// 加载系统信息
async function loadSystemInfo() {
  try {
    isRefreshing.value = true
    const info = await window.api.getSystemInfo()
    if (info) {
      systemInfo.value = info
    }
  } catch (e) {
    console.error('加载系统信息失败:', e)
  } finally {
    isRefreshing.value = false
  }
}

// 加载 API 使用统计
async function loadApiUsage() {
  try {
    isLoadingApiUsage.value = true
    const result = await window.api.getApiUsage()
    if (result.success && result.data) {
      apiUsage.value = result.data
      apiUsageNote.value = result.note || ''
    } else {
      apiUsageNote.value = result.error || '获取失败'
    }
  } catch (e) {
    console.error('加载API使用统计失败:', e)
    apiUsageNote.value = '加载失败'
  } finally {
    isLoadingApiUsage.value = false
  }
}

// 加载模型使用分布
async function loadModelUsage() {
  try {
    isLoadingModelUsage.value = true
    const result = await window.api.getModelUsage()
    if (result.success && result.data) {
      modelUsage.value = result.data.models || []
      modelUsageNote.value = result.note || ''
    } else {
      modelUsageNote.value = result.error || '获取失败'
    }
  } catch (e) {
    console.error('加载模型使用分布失败:', e)
    modelUsageNote.value = '加载失败'
  } finally {
    isLoadingModelUsage.value = false
  }
}

// 刷新所有数据
async function refreshAll() {
  await Promise.all([
    loadSystemInfo(),
    loadApiUsage(),
    loadModelUsage()
  ])
}

// 自动刷新
function startAutoRefresh() {
  refreshInterval = window.setInterval(loadSystemInfo, 5000)
}

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

// 格式化字节
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// 格式化数字
function formatNumber(num: number): string {
  return num.toLocaleString()
}

// 获取进度条类
function getProgressClass(usage: number): string {
  if (usage < 50) return 'low'
  if (usage < 80) return 'medium'
  return 'high'
}
</script>

<template>
  <div class="usage-page">
    <h2 class="page-title">📊 使用情况</h2>
    
    <!-- 本地资源监控 -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>💻</span>
          <span>本地资源监控</span>
        </div>
        <button 
          class="btn btn-sm btn-secondary" 
          @click="loadSystemInfo"
          :disabled="isRefreshing"
        >
          {{ isRefreshing ? '⏳' : '🔄' }} 刷新
        </button>
      </div>
      
      <div class="resources-grid" v-if="systemInfo">
        <!-- CPU -->
        <div class="resource-item">
          <div class="resource-header">
            <span class="resource-icon">🖥️</span>
            <span class="resource-name">CPU 使用率</span>
            <span class="resource-value">{{ systemInfo.cpu.usage }}%</span>
          </div>
          <div class="progress">
            <div 
              class="progress-bar" 
              :class="getProgressClass(systemInfo.cpu.usage)"
              :style="{ width: systemInfo.cpu.usage + '%' }"
            ></div>
          </div>
          <div class="resource-detail">{{ systemInfo.cpu.cores }} 核心</div>
        </div>
        
        <!-- 内存 -->
        <div class="resource-item">
          <div class="resource-header">
            <span class="resource-icon">🧠</span>
            <span class="resource-name">内存使用</span>
            <span class="resource-value">{{ systemInfo.memory.usage }}%</span>
          </div>
          <div class="progress">
            <div 
              class="progress-bar" 
              :class="getProgressClass(systemInfo.memory.usage)"
              :style="{ width: systemInfo.memory.usage + '%' }"
            ></div>
          </div>
          <div class="resource-detail">
            {{ formatBytes(systemInfo.memory.used) }} / {{ formatBytes(systemInfo.memory.total) }}
          </div>
        </div>
        
        <!-- 磁盘 -->
        <div class="resource-item" v-for="disk in systemInfo.disk" :key="disk.mount">
          <div class="resource-header">
            <span class="resource-icon">💾</span>
            <span class="resource-name">磁盘 {{ disk.mount }}</span>
            <span class="resource-value">{{ disk.usage }}%</span>
          </div>
          <div class="progress">
            <div 
              class="progress-bar" 
              :class="getProgressClass(disk.usage)"
              :style="{ width: disk.usage + '%' }"
            ></div>
          </div>
          <div class="resource-detail">
            {{ formatBytes(disk.used) }} / {{ formatBytes(disk.total) }}
          </div>
        </div>
      </div>
      
      <div class="loading-state" v-else>
        <span>⏳ 加载中...</span>
      </div>
    </div>
    
    <!-- API 使用统计 -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>🌐</span>
          <span>API 使用统计</span>
        </div>
        <button 
          class="btn btn-sm btn-primary" 
          @click="loadApiUsage"
          :disabled="isLoadingApiUsage"
        >
          {{ isLoadingApiUsage ? '⏳' : '📥' }} 从 Gateway 获取
        </button>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <div class="stat-label">今日请求</div>
            <div class="stat-value">{{ formatNumber(apiUsage.today.requests) }}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">💬</div>
          <div class="stat-content">
            <div class="stat-label">今日 Token</div>
            <div class="stat-value">{{ formatNumber(apiUsage.today.tokens) }}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📆</div>
          <div class="stat-content">
            <div class="stat-label">本周请求</div>
            <div class="stat-value">{{ formatNumber(apiUsage.thisWeek.requests) }}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🗓️</div>
          <div class="stat-content">
            <div class="stat-label">本月请求</div>
            <div class="stat-value">{{ formatNumber(apiUsage.thisMonth.requests) }}</div>
          </div>
        </div>
      </div>
      
      <div class="usage-note" v-if="apiUsageNote">
        <span>💡 {{ apiUsageNote }}</span>
      </div>
    </div>
    
    <!-- 模型使用分布 -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>🤖</span>
          <span>模型使用分布</span>
        </div>
        <button 
          class="btn btn-sm btn-primary" 
          @click="loadModelUsage"
          :disabled="isLoadingModelUsage"
        >
          {{ isLoadingModelUsage ? '⏳' : '📥' }} 刷新统计
        </button>
      </div>
      
      <div class="model-list" v-if="modelUsage.length > 0 && modelUsage[0].usage > 0">
        <div class="model-item" v-for="model in modelUsage" :key="model.name">
          <div class="model-info">
            <span class="model-name">{{ model.name }}</span>
            <span class="model-requests">{{ formatNumber(model.requests) }} 请求</span>
          </div>
          <div class="model-bar-container">
            <div 
              class="model-bar" 
              :style="{ width: model.usage + '%' }"
            ></div>
          </div>
          <span class="model-percent">{{ model.usage }}%</span>
        </div>
      </div>
      
      <div class="empty-state" v-else>
        <span class="empty-icon">📊</span>
        <span class="empty-text">{{ modelUsageNote || '暂无模型使用数据' }}</span>
        <span class="empty-hint">使用 AI 服务后会自动统计</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.usage-page {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.resource-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.resource-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.resource-icon {
  font-size: 18px;
}

.resource-name {
  flex: 1;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.resource-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.resource-detail {
  font-size: 12px;
  color: var(--color-text-muted);
}

.progress {
  height: 8px;
  background: var(--color-bg-card);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width var(--transition-normal);
}

.progress-bar.low {
  background: linear-gradient(90deg, var(--color-success), #00CC6A);
}

.progress-bar.medium {
  background: linear-gradient(90deg, var(--color-warning), #FF9500);
}

.progress-bar.high {
  background: linear-gradient(90deg, var(--color-danger), #FF2244);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.stat-icon {
  font-size: 32px;
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.usage-note {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(0, 212, 255, 0.1);
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: var(--color-accent);
}

.model-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.model-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.model-info {
  width: 150px;
  flex-shrink: 0;
}

.model-name {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.model-requests {
  font-size: 12px;
  color: var(--color-text-muted);
}

.model-bar-container {
  flex: 1;
  height: 24px;
  background: var(--color-bg-card);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.model-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-secondary));
  border-radius: var(--radius-sm);
  transition: width var(--transition-normal);
}

.model-percent {
  width: 50px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-accent);
}

.loading-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-muted);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  gap: var(--spacing-sm);
}

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.empty-hint {
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>
