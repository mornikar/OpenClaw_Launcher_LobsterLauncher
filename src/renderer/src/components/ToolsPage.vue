<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 小工具列表
const tools = ref<Array<{
  id: string
  name: string
  path: string
  icon: string
  description: string
  runInTerminal: boolean
}>>([])

// 添加工具弹窗
const addToolModal = ref({
  show: false,
  name: '',
  path: '',
  icon: '🔧',
  description: '',
  runInTerminal: false
})

// 加载状态
const loading = ref(true)

// 加载工具
async function loadTools() {
  loading.value = true
  try {
    const result = await window.api.getTools()
    if (result.success) {
      tools.value = result.tools || []
    }
  } catch (e) {
    console.error('加载工具失败:', e)
  } finally {
    loading.value = false
  }
}

// 保存工具
async function saveTools() {
  try {
    await window.api.saveTools(tools.value)
  } catch (e) {
    console.error('保存工具失败:', e)
  }
}

// 选择脚本文件
async function selectScript() {
  try {
    const path = await window.api.selectFile([
      { name: '脚本文件', extensions: ['bat', 'cmd', 'ps1', 'py', 'js', 'ts', 'sh'] },
      { name: '可执行文件', extensions: ['exe', 'bat', 'cmd'] },
      { name: '所有文件', extensions: ['*'] }
    ])
    if (path) {
      addToolModal.value.path = path
      // 自动从路径提取名称
      if (!addToolModal.value.name) {
        const parts = path.split(/[/\\]/)
        const filename = parts[parts.length - 1]
        addToolModal.value.name = filename.replace(/\.[^.]+$/, '')
      }
    }
  } catch (e) {
    console.error('选择文件失败:', e)
  }
}

// 添加工具
async function addTool() {
  if (!addToolModal.value.name || !addToolModal.value.path) return
  
  const newTool = {
    id: Date.now().toString(),
    name: addToolModal.value.name,
    path: addToolModal.value.path,
    icon: addToolModal.value.icon,
    description: addToolModal.value.description,
    runInTerminal: addToolModal.value.runInTerminal
  }
  
  tools.value.push(newTool)
  await saveTools()
  
  // 重置弹窗
  addToolModal.value = {
    show: false,
    name: '',
    path: '',
    icon: '🔧',
    description: '',
    runInTerminal: false
  }
}

// 删除工具
async function deleteTool(id: string) {
  const index = tools.value.findIndex(t => t.id === id)
  if (index !== -1) {
    tools.value.splice(index, 1)
    await saveTools()
  }
}

// 运行工具
async function runTool(tool: typeof tools.value[0]) {
  try {
    await window.api.runTool(tool)
  } catch (e) {
    console.error('运行工具失败:', e)
  }
}

// 打开工具位置
async function openToolLocation(tool: typeof tools.value[0]) {
  await window.api.openToolLocation(tool.path)
}

// 图标列表
const iconList = ['🔧', '⚙️', '🔨', '💻', '📦', '📁', '🛠️', '⚡', '🚀', '🎯', '📝', '🔍', '📊', '🎨', '🧩', '🔗']

onMounted(() => {
  loadTools()
})
</script>

<template>
  <div class="tools-page">
    <div class="page-header">
      <div class="header-left">
        <h2>🔧 小工具</h2>
        <p class="subtitle">管理常用脚本和工具</p>
      </div>
      <button class="btn btn-primary" @click="addToolModal.show = true">
        ➕ 添加工具
      </button>
    </div>
    
    <div v-if="loading" class="loading">
      <span>加载中...</span>
    </div>
    
    <div v-else class="tools-container">
      <div v-if="tools.length === 0" class="empty-state">
        <span>🛠️</span>
        <h3>暂无小工具</h3>
        <p>点击右上角按钮添加常用脚本和工具</p>
      </div>
      
      <div v-else class="tools-grid">
        <div 
          v-for="tool in tools" 
          :key="tool.id"
          class="tool-card"
        >
          <div class="tool-icon">{{ tool.icon }}</div>
          <div class="tool-info">
            <div class="tool-name">{{ tool.name }}</div>
            <div class="tool-path">{{ tool.path }}</div>
            <div v-if="tool.description" class="tool-desc">{{ tool.description }}</div>
            <div class="tool-badges">
              <span v-if="tool.runInTerminal" class="badge">终端</span>
            </div>
          </div>
          <div class="tool-actions">
            <button class="btn btn-primary btn-small" @click="runTool(tool)" title="运行">
              ▶
            </button>
            <button class="btn btn-secondary btn-small" @click="openToolLocation(tool)" title="打开位置">
              📂
            </button>
            <button class="btn btn-danger btn-small" @click="deleteTool(tool.id)" title="删除">
              🗑
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 添加工具弹窗 -->
    <div v-if="addToolModal.show" class="modal-overlay" @click.self="addToolModal.show = false">
      <div class="modal">
        <div class="modal-header">
          <h3>添加小工具</h3>
          <button class="btn-close" @click="addToolModal.show = false">✕</button>
        </div>
        
        <div class="modal-body">
          <!-- 名称 -->
          <div class="form-item">
            <label>名称</label>
            <input v-model="addToolModal.name" type="text" class="input" placeholder="工具名称">
          </div>
          
          <!-- 路径 -->
          <div class="form-item">
            <label>脚本路径</label>
            <div class="input-group">
              <input v-model="addToolModal.path" type="text" class="input" placeholder="选择脚本文件">
              <button class="btn btn-secondary" @click="selectScript">浏览</button>
            </div>
          </div>
          
          <!-- 图标 -->
          <div class="form-item">
            <label>图标</label>
            <div class="icon-picker">
              <button 
                v-for="icon in iconList" 
                :key="icon"
                class="icon-btn"
                :class="{ selected: addToolModal.icon === icon }"
                @click="addToolModal.icon = icon"
              >
                {{ icon }}
              </button>
            </div>
          </div>
          
          <!-- 描述 -->
          <div class="form-item">
            <label>描述（可选）</label>
            <input v-model="addToolModal.description" type="text" class="input" placeholder="简短描述">
          </div>
          
          <!-- 终端运行 -->
          <div class="form-item">
            <label class="checkbox-label">
              <input v-model="addToolModal.runInTerminal" type="checkbox">
              <span>在终端中运行</span>
            </label>
            <p class="hint">勾选后将在新终端窗口中运行脚本</p>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="addToolModal.show = false">取消</button>
          <button 
            class="btn btn-primary" 
            :disabled="!addToolModal.name || !addToolModal.path"
            @click="addTool"
          >
            添加
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tools-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
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

.loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
}

.tools-container {
  flex: 1;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-secondary);
  text-align: center;
}

.empty-state span {
  font-size: 64px;
  margin-bottom: var(--spacing-md);
}

.empty-state h3 {
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
}

.empty-state p {
  margin: 0;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-md);
}

.tool-card {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  display: flex;
  gap: var(--spacing-md);
  transition: all 0.2s;
}

.tool-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tool-icon {
  font-size: 36px;
  flex-shrink: 0;
}

.tool-info {
  flex: 1;
  min-width: 0;
}

.tool-name {
  font-weight: 500;
  font-size: 16px;
  margin-bottom: var(--spacing-xs);
}

.tool-path {
  font-size: 12px;
  color: var(--color-text-secondary);
  word-break: break-all;
  margin-bottom: var(--spacing-xs);
}

.tool-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.tool-badges {
  display: flex;
  gap: var(--spacing-xs);
}

.badge {
  font-size: 11px;
  background: var(--color-primary-dim);
  color: var(--color-primary);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}

.tool-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
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

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-small {
  padding: 6px 10px;
  font-size: 12px;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  width: 500px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.6;
}

.btn-close:hover {
  opacity: 1;
}

.modal-body {
  padding: var(--spacing-md);
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.form-item {
  margin-bottom: var(--spacing-md);
}

.form-item label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
}

.input {
  width: 100%;
  padding: var(--spacing-sm);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-size: 13px;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.input-group {
  display: flex;
  gap: var(--spacing-sm);
}

.input-group .input {
  flex: 1;
}

.icon-picker {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.icon-btn {
  width: 40px;
  height: 40px;
  font-size: 20px;
  background: var(--color-bg-tertiary);
  border: 2px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: var(--color-bg-secondary);
}

.icon-btn.selected {
  border-color: var(--color-primary);
  background: var(--color-primary-dim);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.checkbox-label input {
  width: auto;
}

.hint {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
}
</style>
