<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 模型列表
const models = ref<Array<{
  name: string
  path: string
  size: string
  modified: string
  description: string
  source: string
  modelType: string
}>>([])

// 自定义模型文件夹列表
const customModelFolders = ref<string[]>([])

// 选中的模型
const selectedModel = ref<string | null>(null)

// 模型详情
const modelDetails = ref<Record<string, string>>({})

// 加载状态
const loading = ref(true)
const detailsLoading = ref(false)

// 错误信息
const error = ref('')

// 加载模型列表
async function loadModels() {
  loading.value = true
  error.value = ''
  try {
    const result = await window.api.getLocalModels()
    if (result.success) {
      models.value = result.models
      customModelFolders.value = result.customFolders || []
    } else {
      error.value = result.error || '加载模型失败'
    }
  } catch (e) {
    error.value = '加载模型失败'
    console.error(e)
  } finally {
    loading.value = false
  }
}

// 选择模型
async function selectModel(model: typeof models.value[0]) {
  selectedModel.value = model.path
  detailsLoading.value = true
  modelDetails.value = {}
  
  try {
    const result = await window.api.getModelDetails(model.path)
    if (result.success && result.details) {
      modelDetails.value = result.details
    }
  } catch (e) {
    console.error('加载模型详情失败:', e)
  } finally {
    detailsLoading.value = false
  }
}

// 打开模型目录
async function openModelFolder(model: typeof models.value[0]) {
  await window.api.openFolder(model.path)
}

// 复制内容
async function copyContent(content: string) {
  await window.api.copyToClipboard(content)
}

// 添加模型文件夹
async function addModelFolder() {
  const path = await window.api.selectFolder()
  if (path) {
    try {
      const result = await window.api.addModelFolder(path)
      if (result && result.success) {
        await loadModels()
      } else {
        error.value = result?.error || '添加失败'
      }
    } catch (e) {
      error.value = '添加失败'
      console.error(e)
    }
  }
}

// 移除模型文件夹
async function removeModelFolder(folder: string) {
  try {
    const result = await window.api.removeModelFolder(folder)
    if (result.success) {
      await loadModels()
    } else {
      error.value = result.error || '移除失败'
    }
  } catch (e) {
    error.value = '移除失败'
    console.error(e)
  }
}

// 打开模型文件夹
async function openModelFolderLocation(folder: string) {
  await window.api.openFolder(folder)
}

onMounted(() => {
  loadModels()
})
</script>

<template>
  <div class="models-page">
    <div class="page-header">
      <div class="header-left">
        <h2>🤖 模型管理</h2>
        <p class="subtitle">管理本地模型文件</p>
      </div>
      <button class="btn btn-primary" @click="addModelFolder">
        ➕ 添加模型文件夹
      </button>
    </div>
    
    <!-- 自定义文件夹列表 -->
    <div v-if="customModelFolders.length > 0" class="folders-section">
      <div class="section-title">
        <span>📂 已添加的模型文件夹</span>
      </div>
      <div class="folders-list">
        <div v-for="folder in customModelFolders" :key="folder" class="folder-item">
          <div class="folder-info" @click="openModelFolderLocation(folder)">
            <span class="folder-icon">📁</span>
            <span class="folder-path">{{ folder }}</span>
          </div>
          <button class="btn-icon" @click="removeModelFolder(folder)" title="移除">🗑</button>
        </div>
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      <span>加载中...</span>
    </div>
    
    <div v-else-if="error" class="error-state">
      <span>❌ {{ error }}</span>
      <p>请确保已安装 OpenClaw 并配置模型目录</p>
      <button class="btn btn-primary" @click="loadModels">重试</button>
    </div>
    
    <div v-else class="models-container">
      <!-- 左侧：模型列表 -->
      <div class="models-list-panel">
        <div class="panel-header">
          <h3>📦 本地模型</h3>
          <span class="count">{{ models.length }} 个</span>
        </div>
        
        <div class="models-list">
          <div 
            v-for="model in models" 
            :key="model.path"
            class="model-item"
            :class="{ selected: selectedModel === model.path }"
            @click="selectModel(model)"
          >
            <div class="model-icon">🤖</div>
            <div class="model-info">
              <div class="model-name">{{ model.name }}</div>
              <div class="model-meta">
                <span class="meta-item">📦 {{ model.size }}</span>
                <span class="meta-item">📅 {{ model.modified }}</span>
                <span class="meta-type">{{ model.modelType || '本地模型' }}</span>
                <span class="meta-source" :class="model.source === '默认目录' ? 'default' : 'custom'">
                  {{ model.source === '默认目录' ? '🏠 默认' : '📂 自定义' }}
                </span>
              </div>
            </div>
          </div>
          
          <div v-if="models.length === 0" class="empty-state">
            <span>📭 未找到模型</span>
            <p>请添加模型文件夹来扫描模型文件</p>
          </div>
        </div>
      </div>
      
      <!-- 右侧：模型详情 -->
      <div class="model-details-panel">
        <div class="panel-header">
          <h3>📄 模型详情</h3>
          <button 
            v-if="selectedModel"
            class="btn btn-secondary btn-small"
            @click="openModelFolder(models.find(m => m.path === selectedModel)!)"
          >
            📂 打开目录
          </button>
        </div>
        
        <div v-if="detailsLoading" class="loading">
          <span>加载详情...</span>
        </div>
        
        <div v-else-if="Object.keys(modelDetails).length > 0" class="details-content">
          <div v-for="(content, filename) in modelDetails" :key="filename" class="detail-section">
            <div class="detail-header">
              <span class="detail-filename">📄 {{ filename }}</span>
              <button class="btn-icon" @click="copyContent(content)" title="复制">📋</button>
            </div>
            <pre class="detail-content">{{ content }}</pre>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <span>👈 选择一个模型</span>
          <p>点击左侧列表中的模型查看详情</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.models-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
}

/* 模型文件夹列表样式 */
.folders-section {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.section-title {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.folders-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.folder-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-bg-tertiary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  max-width: 400px;
}

.folder-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  overflow: hidden;
}

.folder-info:hover .folder-path {
  color: var(--color-primary);
}

.folder-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.folder-path {
  font-size: 12px;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.header-left {
  display: flex;
  flex-direction: column;
}

.page-header h2 {
  font-size: 24px;
  margin-bottom: var(--spacing-xs);
}

.subtitle {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
}

.error-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.error-state span {
  font-size: 20px;
  color: #ef4444;
}

.error-state p {
  color: var(--color-text-secondary);
  margin: 0;
}

.models-container {
  flex: 1;
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: var(--spacing-md);
  min-height: 0;
}

.models-list-panel,
.model-details-panel {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-header h3 {
  font-size: 16px;
  margin: 0;
}

.count {
  font-size: 12px;
  color: var(--color-text-secondary);
  background: var(--color-bg-tertiary);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}

.models-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-sm);
}

.model-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: var(--spacing-xs);
}

.model-item:hover {
  background: var(--color-bg-tertiary);
}

.model-item.selected {
  background: var(--color-primary-dim);
  border: 1px solid var(--color-primary);
}

.model-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.model-info {
  flex: 1;
  min-width: 0;
}

.model-name {
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
  word-break: break-word;
}

.model-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.meta-item {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.meta-type {
  font-size: 10px;
  padding: 1px 4px;
  border-radius: var(--radius-sm);
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.meta-source {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: var(--radius-sm);
}

.meta-source.default {
  background: rgba(0, 212, 255, 0.1);
  color: var(--color-primary);
}

.meta-source.custom {
  background: rgba(123, 47, 255, 0.1);
  color: var(--color-accent-secondary, #7b2fff);
}

.details-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
}

.detail-section {
  margin-bottom: var(--spacing-lg);
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
}

.detail-filename {
  font-size: 13px;
  font-weight: 500;
}

.btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.btn-icon:hover {
  opacity: 1;
}

.detail-content {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-top: none;
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
  padding: var(--spacing-md);
  font-size: 12px;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 400px;
  overflow-y: auto;
  margin: 0;
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

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
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

.btn-small {
  padding: 4px 10px;
  font-size: 12px;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
  text-align: center;
}

.empty-state span {
  font-size: 24px;
  margin-bottom: var(--spacing-sm);
}

.empty-state p {
  font-size: 13px;
  margin: 0;
}
</style>
