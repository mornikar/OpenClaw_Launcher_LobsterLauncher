<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// 设置配置
const settings = ref({
  gatewayUrl: 'http://localhost:18789',
  gatewayPort: 18789,
  startupDelay: 1000,
  theme: 'dark',
  autoStartGateway: true,
  minimizeToTray: true,
  restoreOnStart: true,
  showNotifications: true,
  checkUpdates: true,
  maxLogSize: 10,
  logRetention: 7
})

// 路径信息
const openclawPaths = ref({
  main: '',
  config: '',
  skills: '',
  models: '',
  workspace: ''
})

// 保存状态
const saveStatus = ref<'idle' | 'saving' | 'saved'>('idle')

// 版本信息
const versionInfo = ref({
  version: '1.0.0',
  electron: '',
  chrome: '',
  node: ''
})

onMounted(async () => {
  await loadSettings()
  await loadPaths()
  loadVersionInfo()
})

// 加载设置
async function loadSettings() {
  try {
    const config = await window.api.getConfig()
    settings.value = {
      gatewayUrl: config.gatewayUrl || 'http://localhost:18789',
      gatewayPort: config.gatewayPort || 18789,
      startupDelay: config.startupDelay || 1000,
      theme: config.theme || 'dark',
      autoStartGateway: config.autoStartGateway ?? true,
      minimizeToTray: config.minimizeToTray ?? true,
      restoreOnStart: config.restoreOnStart ?? true,
      showNotifications: true,
      checkUpdates: true,
      maxLogSize: 10,
      logRetention: 7
    }
  } catch (e) {
    console.error('加载设置失败:', e)
  }
}

// 加载路径信息
async function loadPaths() {
  try {
    const paths = await window.api.getOpenClawPaths()
    openclawPaths.value = {
      main: paths.main || '未检测到',
      config: paths.config || '未检测到',
      skills: paths.config ? `${paths.config}\\skills` : '未检测到',
      models: paths.config ? `${paths.config}\\models` : '未检测到',
      workspace: paths.workspace || '未检测到'
    }
  } catch (e) {
    console.error('加载路径信息失败:', e)
  }
}

// 加载版本信息
function loadVersionInfo() {
  versionInfo.value = {
    version: '1.0.0',
    electron: 'v28.0.0',
    chrome: 'v120.0.0',
    node: 'v18.19.0'
  }
}

// 保存设置
async function saveSettings() {
  saveStatus.value = 'saving'
  
  try {
    const config = await window.api.getConfig()
    const updatedConfig = {
      ...config,
      gatewayUrl: settings.value.gatewayUrl,
      gatewayPort: settings.value.gatewayPort,
      startupDelay: settings.value.startupDelay,
      theme: settings.value.theme,
      autoStartGateway: settings.value.autoStartGateway
    }
    
    await window.api.saveConfig(updatedConfig)
    saveStatus.value = 'saved'
    
    setTimeout(() => {
      saveStatus.value = 'idle'
    }, 2000)
  } catch (e) {
    console.error('保存设置失败:', e)
    saveStatus.value = 'idle'
  }
}

// 重置设置
function resetSettings() {
  settings.value = {
    gatewayUrl: 'http://localhost:18789',
    gatewayPort: 18789,
    startupDelay: 1000,
    theme: 'dark',
    autoStartGateway: true,
    minimizeToTray: true,
    restoreOnStart: true,
    showNotifications: true,
    checkUpdates: true,
    maxLogSize: 10,
    logRetention: 7
  }
}

// 打开路径
async function openPath(path: string) {
  if (path && path !== '未检测到') {
    await window.api.openFolder(path)
  }
}

// 打开日志目录
async function openLogDir() {
  await window.api.openFolder('C:\\Users\\Q\\AppData\\Roaming\\lobster-launcher\\logs')
}

// 打开数据目录
async function openDataDir() {
  await window.api.openFolder('C:\\Users\\Q\\AppData\\Roaming\\lobster-launcher\\data')
}

// 检查更新
async function checkForUpdates() {
  alert('当前已是最新版本！')
}

// 打开外部链接
function openExternalLink(url: string) {
  window.api.openUrl(url)
}

// 复制文本
async function copyText(text: string) {
  await window.api.copyToClipboard(text)
}
</script>

<template>
  <div class="settings-page">
    <h2 class="page-title">⚙️ 设置</h2>
    
    <!-- 启动设置 -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>🚀</span>
          <span>启动设置</span>
        </div>
      </div>
      
      <div class="settings-list">
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">开机自启动</span>
            <span class="setting-desc">启动时自动运行龙虾启动器</span>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="settings.autoStartGateway">
            <span class="slider"></span>
          </label>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">启动时还原窗口</span>
            <span class="setting-desc">启动应用时自动显示主窗口</span>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="settings.restoreOnStart">
            <span class="slider"></span>
          </label>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">全部启动延迟</span>
            <span class="setting-desc">批量启动服务时的间隔时间（毫秒）</span>
          </div>
          <input 
            type="number" 
            class="input setting-input setting-input-sm"
            v-model.number="settings.startupDelay"
            placeholder="1000"
            min="0"
            max="10000"
          >
        </div>
      </div>
    </div>
    
    <!-- 窗口设置 -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>🪟</span>
          <span>窗口设置</span>
        </div>
      </div>
      
      <div class="settings-list">
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">最小化到托盘</span>
            <span class="setting-desc">关闭窗口时最小化到系统托盘</span>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="settings.minimizeToTray">
            <span class="slider"></span>
          </label>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">显示通知</span>
            <span class="setting-desc">服务状态变化时显示系统通知</span>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="settings.showNotifications">
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>
    
    <!-- 服务设置 -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>🔌</span>
          <span>服务设置</span>
        </div>
      </div>
      
      <div class="settings-list">
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">Gateway 地址</span>
            <span class="setting-desc">OpenClaw Gateway 服务地址</span>
          </div>
          <input 
            type="text" 
            class="input setting-input"
            v-model="settings.gatewayUrl"
            placeholder="http://localhost:18789"
          >
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">Gateway 端口</span>
            <span class="setting-desc">Gateway 检测端口号</span>
          </div>
          <input 
            type="number" 
            class="input setting-input setting-input-sm"
            v-model.number="settings.gatewayPort"
            placeholder="18789"
          >
        </div>
      </div>
    </div>
    
    <!-- 外观设置 -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>🎨</span>
          <span>外观设置</span>
        </div>
      </div>
      
      <div class="settings-list">
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">主题</span>
            <span class="setting-desc">选择应用主题</span>
          </div>
          <select class="input setting-input setting-select" v-model="settings.theme">
            <option value="dark">深色</option>
            <option value="light">浅色</option>
            <option value="system">跟随系统</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- 日志设置 -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>📋</span>
          <span>日志设置</span>
        </div>
      </div>
      
      <div class="settings-list">
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">单个日志最大</span>
            <span class="setting-desc">单个日志文件最大大小（MB）</span>
          </div>
          <input 
            type="number" 
            class="input setting-input setting-input-sm"
            v-model.number="settings.maxLogSize"
            min="1"
            max="100"
          >
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">日志保留天数</span>
            <span class="setting-desc">自动清理超过指定天数的日志</span>
          </div>
          <input 
            type="number" 
            class="input setting-input setting-input-sm"
            v-model.number="settings.logRetention"
            min="1"
            max="365"
          >
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">日志目录</span>
            <span class="setting-desc path-desc">C:\Users\Q\AppData\Roaming\lobster-launcher\logs</span>
          </div>
          <button class="btn btn-secondary btn-sm" @click="openLogDir">
            📂 打开
          </button>
        </div>
      </div>
    </div>
    
    <!-- 路径信息 -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>📁</span>
          <span>路径信息</span>
        </div>
      </div>
      
      <div class="settings-list">
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">OpenClaw 主目录</span>
            <span class="setting-desc path-desc">{{ openclawPaths.main }}</span>
          </div>
          <button class="btn btn-secondary btn-sm" @click="openPath(openclawPaths.main)">
            📂
          </button>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">配置目录</span>
            <span class="setting-desc path-desc">{{ openclawPaths.config }}</span>
          </div>
          <button class="btn btn-secondary btn-sm" @click="openPath(openclawPaths.config)">
            📂
          </button>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">Skills 目录</span>
            <span class="setting-desc path-desc">{{ openclawPaths.skills }}</span>
          </div>
          <button class="btn btn-secondary btn-sm" @click="openPath(openclawPaths.skills)">
            📂
          </button>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">模型目录</span>
            <span class="setting-desc path-desc">{{ openclawPaths.models }}</span>
          </div>
          <button class="btn btn-secondary btn-sm" @click="openPath(openclawPaths.models)">
            📂
          </button>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">工作区目录</span>
            <span class="setting-desc path-desc">{{ openclawPaths.workspace }}</span>
          </div>
          <button class="btn btn-secondary btn-sm" @click="openPath(openclawPaths.workspace)">
            📂
          </button>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">数据目录</span>
            <span class="setting-desc path-desc">C:\Users\Q\AppData\Roaming\lobster-launcher\data</span>
          </div>
          <button class="btn btn-secondary btn-sm" @click="openDataDir">
            📂
          </button>
        </div>
      </div>
    </div>
    
    <!-- 更新设置 -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>🔄</span>
          <span>更新设置</span>
        </div>
      </div>
      
      <div class="settings-list">
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">自动检查更新</span>
            <span class="setting-desc">启动时自动检查是否有新版本</span>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="settings.checkUpdates">
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>
    
    <!-- 关于 -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>ℹ️</span>
          <span>关于</span>
        </div>
      </div>
      
      <div class="about-info">
        <div class="about-logo">🦞</div>
        <div class="about-name">龙虾启动器</div>
        <div class="about-version">版本 {{ versionInfo.version }}</div>
        <div class="about-desc">OpenClaw 桌面管理工具</div>
        
        <div class="version-details">
          <div class="version-item">
            <span>Electron</span>
            <span>{{ versionInfo.electron }}</span>
          </div>
          <div class="version-item">
            <span>Chrome</span>
            <span>{{ versionInfo.chrome }}</span>
          </div>
          <div class="version-item">
            <span>Node.js</span>
            <span>{{ versionInfo.node }}</span>
          </div>
        </div>
        
        <div class="about-links">
          <button class="btn btn-secondary btn-sm" @click="checkForUpdates">
            📝 检查更新
          </button>
          <button class="btn btn-secondary btn-sm" @click="openExternalLink('https://github.com')">
            🐛 反馈问题
          </button>
          <button class="btn btn-secondary btn-sm" @click="openExternalLink('https://openclaw.com')">
            📖 使用文档
          </button>
        </div>
      </div>
    </div>
    
    <!-- 保存按钮 -->
    <div class="settings-actions">
      <button class="btn btn-secondary" @click="resetSettings">
        🔄 重置
      </button>
      <button 
        class="btn btn-primary" 
        @click="saveSettings"
        :disabled="saveStatus === 'saving'"
      >
        <span v-if="saveStatus === 'saving'">保存中...</span>
        <span v-else-if="saveStatus === 'saved'">✓ 已保存</span>
        <span v-else>💾 保存设置</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  max-width: 800px;
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

.settings-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  gap: var(--spacing-md);
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.setting-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.setting-desc {
  font-size: 12px;
  color: var(--color-text-muted);
}

.path-desc {
  word-break: break-all;
  font-family: monospace;
  font-size: 11px;
}

.setting-input {
  width: 200px;
  flex-shrink: 0;
}

.setting-input-sm {
  width: 80px;
}

.setting-select {
  cursor: pointer;
}

/* 开关样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  flex-shrink: 0;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  transition: var(--transition-normal);
}

.slider::before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: var(--color-text-muted);
  border-radius: 50%;
  transition: var(--transition-normal);
}

.switch input:checked + .slider {
  background-color: rgba(0, 212, 255, 0.2);
  border-color: var(--color-accent);
}

.switch input:checked + .slider::before {
  transform: translateX(24px);
  background-color: var(--color-accent);
}

/* 关于 */
.about-info {
  text-align: center;
  padding: var(--spacing-lg);
}

.about-logo {
  font-size: 64px;
  margin-bottom: var(--spacing-md);
}

.about-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.about-version {
  font-size: 14px;
  color: var(--color-accent);
  margin-bottom: var(--spacing-sm);
}

.about-desc {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.version-details {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
}

.version-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.version-item span:first-child {
  font-size: 11px;
  color: var(--color-text-muted);
}

.version-item span:last-child {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.about-links {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  flex-wrap: wrap;
}

/* 保存按钮 */
.settings-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

/* 按钮 */
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

.btn-sm {
  padding: 4px 10px;
  font-size: 11px;
}
</style>
