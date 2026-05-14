<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'

// 配置
const config = ref({
  gatewayUrl: 'http://localhost:18789',
  token: '',
  password: ''
})

// 凭证编辑状态
const editingCredential = ref<string | null>(null)
const editingValue = ref('')

// CodingPlan 配置
const codingPlanConfig = ref({
  apiKey: '',
  baseUrl: ''
})

// OpenClaw 路径
const openclawPaths = ref({
  main: null as string | null,
  config: '',
  skills: '',
  agents: '',
  workspace: '',
  dotOpenclaw: ''
})

// OpenClaw 安装状态
const openclawInstallModal = ref({
  show: false,
  progress: 0,
  stage: '',
  message: ''
})

// 确认对话框
const confirmDialog = ref({
  show: false,
  title: '',
  message: '',
  onConfirm: null as (() => void) | null
})

// 自定义文件夹
const customFolders = ref<Array<{
  key: string
  name: string
  path: string
  icon: string
}>>([])

// 右键菜单状态
const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  target: null as any
})

// CodingPlan 编辑弹窗
const codingPlanModal = ref({
  show: false,
  apiKey: '',
  baseUrl: ''
})

// 收款码弹窗状态
const donateModal = ref({
  show: false
})

// 添加服务弹窗
const addServiceModal = ref({
  show: false,
  name: '',
  exePath: '',
  icon: '🔧',
  iconPath: '' as string | null
})

// 添加文件夹弹窗
const addFolderModal = ref({
  show: false,
  name: '',
  path: '',
  icon: '📁',
  iconPath: '' as string | null,
  error: '' as string  // 添加错误提示
})

// 服务列表
const services = ref<Array<{
  id: string
  name: string
  icon: string
  type: 'system' | 'local'
  exePath: string
  args?: string[]
  status: 'running' | 'stopped' | 'not_found'
}>>([])

// 本地服务列表
const localServices = ref<Array<{
  id: string
  name: string
  icon: string
  iconPath?: string
  exePath: string
  status: 'running' | 'stopped' | 'not_found'
}>>([])

// 常用链接
const commonLinks = ref([
  { id: 'dashboard', icon: '📊', name: 'Dashboard', type: 'url', url: 'http://localhost:18789/dashboard' },
  { id: 'onboard', icon: '🚀', name: '安装向导', type: 'url', url: 'http://localhost:18789/onboard/chat?session=agent%3Amain%3Amain' },
  { id: 'docs', icon: '📖', name: '官方文档', type: 'url', url: 'https://docs.openclaw.ai' },
  { id: 'clawhub', icon: '🛒', name: 'ClawHub', type: 'url', url: 'https://clawhub.ai' },
  { id: 'codingplan', icon: '💳', name: 'CodingPlan', type: 'codingplan', url: '' },
  { id: 'feishu', icon: '📮', name: '飞书开放平台', type: 'url', url: 'https://open.feishu.cn/app' }
])

// 凭证显示状态
const showPassword = ref(false)
const copiedField = ref<string | null>(null)
const isFetchingToken = ref(false)

// 加载数据
onMounted(async () => {
  console.log('HomePage 组件已挂载')
  console.log('window.api:', window.api)
  
  try {
    console.log('Loading config...')
    await loadConfig()
    console.log('Config loaded')
    
    console.log('Loading OpenClaw paths...')
    await loadOpenClawPaths()
    console.log('OpenClaw paths loaded')
    
    console.log('Loading custom folders...')
    await loadCustomFolders()
    console.log('Custom folders loaded')
    
    console.log('Loading services...')
    await loadServices()
    console.log('Services loaded')
    
    console.log('Loading CodingPlan config...')
    await loadCodingPlanConfig()
    console.log('CodingPlan config loaded')
    
    startStatusMonitor()
    console.log('Status monitor started')
  } catch (e) {
    console.error('Failed to load HomePage data:', e)
  }
  
  // 点击其他地方关闭右键菜单
  document.addEventListener('click', closeContextMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeContextMenu)
  if (statusInterval) {
    clearInterval(statusInterval)
  }
})

// 加载配置
async function loadConfig() {
  try {
    const savedConfig = await window.api.getConfig()
    config.value = savedConfig
    
    // 检测 OpenClaw 获取 Token
    const detected = await window.api.detectOpenClaw()
    if (detected.token) {
      config.value.token = detected.token
    }
  } catch (e) {
    console.error('加载配置失败:', e)
  }
}

// 加载 CodingPlan 配置
async function loadCodingPlanConfig() {
  try {
    const saved = await window.api.getCodingPlanConfig()
    codingPlanConfig.value = saved
    codingPlanModal.value.apiKey = saved.apiKey
    codingPlanModal.value.baseUrl = saved.baseUrl
  } catch (e) {
    console.error('加载 CodingPlan 配置失败:', e)
  }
}

// 保存 CodingPlan 配置
async function saveCodingPlan() {
  try {
    await window.api.saveCodingPlanConfig({
      apiKey: codingPlanModal.value.apiKey,
      baseUrl: codingPlanModal.value.baseUrl
    })
    codingPlanConfig.value = { ...codingPlanModal.value }
    codingPlanModal.value.show = false
  } catch (e) {
    console.error('保存 CodingPlan 配置失败:', e)
  }
}

// 加载 OpenClaw 路径
async function loadOpenClawPaths() {
  try {
    openclawPaths.value = await window.api.getOpenClawPaths()
  } catch (e) {
    console.error('加载路径失败:', e)
  }
}

// 加载自定义文件夹
async function loadCustomFolders() {
  try {
    const folders = await window.api.getCustomFolders()
    customFolders.value = folders.map((f: any) => ({
      ...f,
      icon: f.icon || '📁'
    }))
  } catch (e) {
    console.error('加载自定义文件夹失败:', e)
  }
}

// 加载服务列表
async function loadServices() {
  try {
    const savedServices = await window.api.getServices()
    
    // 默认服务
    services.value = [
      {
        id: 'gateway',
        name: 'OpenClaw Gateway',
        icon: '🦞',
        type: 'system',
        exePath: '',
        status: 'stopped'
      }
    ]
    
    // 添加保存的本地服务
    if (savedServices.length > 0) {
      localServices.value = savedServices
    }
    
    // 检测所有服务状态
    await checkAllServicesStatus()
  } catch (e) {
    console.error('加载服务失败:', e)
  }
}

// 检测所有服务状态
async function checkAllServicesStatus() {
  for (const service of localServices.value) {
    try {
      const status = await window.api.checkServiceStatus(service.exePath.split('\\').pop() || service.name)
      service.status = status
    } catch {
      service.status = 'not_found'
    }
  }
  
  // 检测 Gateway
  try {
    const result = await window.api.checkServiceStatus('openclaw.exe')
    services.value[0].status = result
  } catch {
    services.value[0].status = 'not_found'
  }
}

// 状态监控定时器
let statusInterval: number | null = null

function startStatusMonitor() {
  statusInterval = window.setInterval(checkAllServicesStatus, 5000)
}

// 打开文件夹
async function openFolder(path: string | null) {
  if (path) {
    await window.api.openFolder(path)
  }
}

// 打开链接
async function openLink(link: any) {
  if (link.type === 'codingplan') {
    // 打开 CodingPlan 配置弹窗
    codingPlanModal.value.apiKey = codingPlanConfig.value.apiKey
    codingPlanModal.value.baseUrl = codingPlanConfig.value.baseUrl
    codingPlanModal.value.show = true
  } else if (link.id === 'onboard') {
    // 安装向导：先检查 OpenClaw 是否已安装
    await handleOnboard()
  } else {
    await window.api.openUrl(link.url)
  }
}

// 处理安装向导
async function handleOnboard() {
  // 检查 OpenClaw 是否已安装
  const result = await window.api.detectOpenClaw()
  
  if (result.path) {
    // OpenClaw 目录存在，显示确认是否打开
    confirmDialog.value = {
      show: true,
      title: '打开安装向导',
      message: '检测到 OpenClaw 已安装目录，是否打开安装向导？',
      onConfirm: () => {
        confirmDialog.value.show = false
        window.api.openUrl('http://localhost:18789/onboard/chat?session=agent%3Amain%3Amain')
      }
    }
  } else {
    // OpenClaw 未安装，弹出确认对话框
    confirmDialog.value = {
      show: true,
      title: '安装 OpenClaw',
      message: '检测到本地未安装 OpenClaw，是否现在安装？\n\n安装过程将自动完成以下步骤：\n1. 创建安装目录\n2. 安装 OpenClaw CLI\n3. 初始化配置\n4. 启动 Gateway',
      onConfirm: startOpenClawInstall
    }
  }
}

// 开始安装 OpenClaw
async function startOpenClawInstall() {
  confirmDialog.value.show = false
  openclawInstallModal.value = {
    show: true,
    progress: 0,
    stage: 'preparing',
    message: '准备中...'
  }
  
  // 监听安装进度
  const removeListener = window.api.onOpenClawInstallProgress((data) => {
    openclawInstallModal.value.progress = data.progress
    openclawInstallModal.value.stage = data.stage
    openclawInstallModal.value.message = data.message
  })
  
  try {
    const result = await window.api.installOpenClaw()
    
    if (result.success) {
      openclawInstallModal.value.message = '安装完成！正在打开安装向导...'
      openclawInstallModal.value.progress = 100
      
      // 等待一下让用户看到完成消息
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 打开安装向导
      await window.api.openUrl('http://localhost:18789/onboard/chat?session=agent%3Amain%3Amain')
      
      // 关闭安装弹窗
      openclawInstallModal.value.show = false
    } else {
      openclawInstallModal.value.message = '安装失败: ' + (result.error || '未知错误')
    }
  } catch (e) {
    console.error('安装 OpenClaw 失败:', e)
    openclawInstallModal.value.message = '安装失败: ' + String(e)
  } finally {
    removeListener()
  }
}

// 关闭确认对话框
function closeConfirmDialog() {
  confirmDialog.value.show = false
  confirmDialog.value.onConfirm = null
}

// 打开终端
async function openTerminal() {
  await window.api.openTerminal()
}

// 复制凭证
async function copyCredential(field: string, value: string) {
  await window.api.copyToClipboard(value)
  copiedField.value = field
  setTimeout(() => {
    copiedField.value = null
  }, 1500)
}

// 切换密码显示
function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

// 凭证编辑
function startEditCredential(field: string, currentValue: string) {
  editingCredential.value = field
  editingValue.value = currentValue
}

async function saveEditCredential() {
  if (editingCredential.value) {
    try {
      if (editingCredential.value === 'token') {
        config.value.token = editingValue.value
      } else if (editingCredential.value === 'password') {
        config.value.password = editingValue.value
      } else if (editingCredential.value === 'gatewayUrl') {
        config.value.gatewayUrl = editingValue.value
      }
      // 保存到配置
      await window.api.saveConfig(config.value)
    } catch (e) {
      console.error('保存凭证失败:', e)
    }
    // 退出编辑模式
    editingCredential.value = null
    editingValue.value = ''
  }
}

function cancelEditCredential() {
  editingCredential.value = null
  editingValue.value = ''
}

// 切换收款码显示
function toggleDonateModal() {
  donateModal.value.show = !donateModal.value.show
}

// 重新获取 Token
async function refreshToken() {
  isFetchingToken.value = true
  try {
    const result = await window.api.fetchToken()
    if (result.success && result.token) {
      config.value.token = result.token
      await window.api.saveConfig(config.value)
    } else if (result.token) {
      // 如果命令失败但有文件token
      config.value.token = result.token
      await window.api.saveConfig(config.value)
    }
  } catch (e) {
    console.error('获取 Token 失败:', e)
  } finally {
    isFetchingToken.value = false
  }
}

// 右键菜单
function showContextMenu(event: MouseEvent, item: any, type: 'folder' | 'service') {
  event.preventDefault()
  event.stopPropagation()
  contextMenu.value = {
    show: true,
    x: event.clientX,
    y: event.clientY,
    target: { ...item, type }
  }
}

function closeContextMenu() {
  contextMenu.value.show = false
}

// 右键菜单操作
async function handleContextMenuAction(action: string) {
  const target = contextMenu.value.target
  closeContextMenu()
  
  if (!target) return
  
  switch (action) {
    case 'open':
      if (target.path) {
        await openFolder(target.path)
      }
      break
    case 'bind':
      await bindNewFolder(target)
      break
    case 'start':
      await startServiceById(target.id)
      break
    case 'stop':
      await stopServiceById(target.id)
      break
    case 'force-stop':
      // 强制停止 - 直接调用主进程的强制停止
      await window.api.forceStopService()
      services.value[0].status = 'stopped'
      break
    case 'delete':
      await deleteLocalService(target.id)
      break
    case 'delete-folder':
      await deleteCustomFolder(target.key)
      break
  }
}

// 绑定新文件夹
async function bindNewFolder(target: any) {
  const path = await window.api.selectFolder()
  if (path) {
    if (target.key && !target.key.startsWith('custom_')) {
      // 绑定到现有文件夹
      await window.api.bindFolder(target.key, path)
      await loadCustomFolders()
    } else {
      // 添加新文件夹
      addFolderModal.value.show = true
      addFolderModal.value.path = path
    }
  }
}

// 添加文件夹弹窗
function showAddFolderModal() {
  addFolderModal.value = {
    show: true,
    name: '',
    path: '',
    icon: '📁',
    iconPath: null,
    error: ''
  }
}

// 选择文件夹路径
async function selectFolderPath() {
  const path = await window.api.selectFolder()
  if (path) {
    addFolderModal.value.path = path
    // 如果名称为空，用文件夹名作为默认名称
    if (!addFolderModal.value.name) {
      const parts = path.split('\\')
      addFolderModal.value.name = parts[parts.length - 1] || '自定义文件夹'
    }
  }
}

// 选择图标图片
async function selectFolderIcon() {
  const path = await window.api.selectImage()
  if (path) {
    addFolderModal.value.iconPath = path
    // 如果名称为空，用文件夹名作为默认名称
    if (!addFolderModal.value.name) {
      const parts = path.split('\\')
      addFolderModal.value.name = parts[parts.length - 1] || '自定义文件夹'
    }
  }
}

// 确认添加文件夹
async function confirmAddFolder() {
  console.log('confirmAddFolder 被调用')
  
  // 验证输入
  if (!addFolderModal.value.name.trim()) {
    addFolderModal.value.error = '请输入文件夹名称'
    return
  }
  if (!addFolderModal.value.path.trim()) {
    addFolderModal.value.error = '请选择文件夹路径'
    return
  }
  
  // 检查是否已存在同名文件夹
  const exists = customFolders.value.some(f => 
    f.name.toLowerCase() === addFolderModal.value.name.toLowerCase()
  )
  if (exists) {
    addFolderModal.value.error = '已存在同名文件夹'
    return
  }
  
  try {
    const newFolder = {
      key: `custom_${Date.now()}`,
      name: addFolderModal.value.name.trim(),
      path: addFolderModal.value.path.trim(),
      icon: addFolderModal.value.iconPath ? '📷' : addFolderModal.value.icon
    }
    
    // 使用 JSON.parse/JSON.stringify 确保数据是纯对象（移除响应式代理）
    const folders = JSON.parse(JSON.stringify([...customFolders.value, newFolder]))
    console.log('准备保存文件夹, folders:', JSON.stringify(folders))
    console.log('window.api:', window.api)
    console.log('window.api.saveCustomFolders:', window.api?.saveCustomFolders)
    
    const result = await window.api.saveCustomFolders(folders)
    console.log('保存结果:', result)
    
    // 检查保存结果
    if (!result || !result.success) {
      addFolderModal.value.error = result?.error || '保存失败，请重试'
      console.error('保存文件夹失败:', result?.error)
      return
    }
    
    await loadCustomFolders()
    
    // 成功后关闭弹窗
    addFolderModal.value.show = false
    addFolderModal.value.error = ''
  } catch (e) {
    addFolderModal.value.error = '保存失败，请重试'
    console.error('保存文件夹失败:', e)
  }
}

// 删除自定义文件夹
async function deleteCustomFolder(key: string) {
  const folders = JSON.parse(JSON.stringify(customFolders.value.filter(f => f.key !== key)))
  await window.api.saveCustomFolders(folders)
  await loadCustomFolders()
}

// 添加文件夹（直接添加，已有路径）
async function addCustomFolder() {
  const path = await window.api.selectFolder()
  if (path) {
    addFolderModal.value = {
      show: true,
      name: '',
      path: path,
      icon: '📁',
      iconPath: null
    }
    // 默认名称
    const parts = path.split('\\')
    addFolderModal.value.name = parts[parts.length - 1] || '自定义文件夹'
  }
}

// 启动服务
async function startServiceById(id: string) {
  if (id === 'gateway') {
    const success = await window.api.startGateway()
    if (success) {
      setTimeout(() => checkAllServicesStatus(), 2000)
    }
  }
}

// 停止服务
async function stopServiceById(id: string) {
  if (id === 'gateway') {
    const success = await window.api.stopGateway()
    if (success) {
      services.value[0].status = 'stopped'
    }
  } else {
    const service = localServices.value.find(s => s.id === id)
    if (service) {
      const exeName = service.exePath.split('\\').pop() || service.name
      const success = await window.api.stopService(exeName)
      if (success) {
        service.status = 'stopped'
      }
    }
  }
}

// 启动本地服务
async function startService(service: any) {
  const success = await window.api.startService({
    id: service.id,
    name: service.name,
    exePath: service.exePath
  })
  
  if (success) {
    setTimeout(() => checkAllServicesStatus(), 2000)
  }
}

// 停止本地服务
async function stopLocalService(service: any) {
  const exeName = service.exePath.split('\\').pop() || service.name
  const success = await window.api.stopService(exeName)
  
  if (success) {
    service.status = 'stopped'
  }
}

// 启动所有服务
async function startAllServices() {
  // 启动本地服务
  for (const service of localServices.value) {
    if (service.status !== 'running') {
      await startService(service)
    }
  }
  // 启动 Gateway
  await startServiceById('gateway')
  // 延迟检查状态
  setTimeout(() => checkAllServicesStatus(), 2000)
}

// 停止所有服务
async function stopAllServices() {
  // 停止 Gateway
  await stopServiceById('gateway')
  // 停止所有本地服务
  for (const service of localServices.value) {
    if (service.status === 'running') {
      await stopLocalService(service)
    }
  }
  // 延迟检查状态
  setTimeout(() => checkAllServicesStatus(), 1000)
}

// 添加本地服务弹窗
function showAddServiceModal() {
  addServiceModal.value = {
    show: true,
    name: '',
    exePath: '',
    icon: '🔧',
    iconPath: null
  }
}

// 选择服务文件（支持exe）
async function selectServiceFile() {
  const path = await window.api.selectFile([
    { name: '可执行文件', extensions: ['exe', 'bat', 'cmd'] },
    { name: '所有文件', extensions: ['*'] }
  ])
  if (path) {
    addServiceModal.value.exePath = path
    // 自动用文件名作为服务名
    if (!addServiceModal.value.name) {
      const parts = path.split('\\')
      const fileName = parts[parts.length - 1] || ''
      addServiceModal.value.name = fileName.replace(/\.(exe|bat|cmd)$/i, '')
    }
  }
}

// 选择服务图标
async function selectServiceIcon() {
  const path = await window.api.selectImage()
  if (path) {
    addServiceModal.value.iconPath = path
  }
}

// 添加本地服务
async function addLocalService() {
  if (!addServiceModal.value.name || !addServiceModal.value.exePath) {
    return
  }
  
  const newService = {
    id: `local_${Date.now()}`,
    name: addServiceModal.value.name,
    icon: addServiceModal.value.iconPath ? '📷' : addServiceModal.value.icon,
    iconPath: addServiceModal.value.iconPath,
    exePath: addServiceModal.value.exePath,
    status: 'stopped' as const
  }
  
  const servicesList = [...localServices.value, newService]
  await window.api.saveServices(servicesList)
  localServices.value = servicesList
  addServiceModal.value.show = false
}

// 删除本地服务
async function deleteLocalService(id: string) {
  const servicesList = localServices.value.filter(s => s.id !== id)
  await window.api.saveServices(servicesList)
  localServices.value = servicesList
}

// 格式化 Token 显示
const displayToken = computed(() => {
  if (!config.value.token) return ''
  return config.value.token.length > 20 
    ? config.value.token.substring(0, 20) + '...' 
    : config.value.token
})

// 获取文件夹项
function getFolderItems() {
  return [
    { key: 'main', name: 'OpenClaw 文件', icon: '🦞', path: openclawPaths.value.main, description: '主目录' },
    { key: 'dotOpenclaw', name: '配置目录', icon: '⚙️', path: openclawPaths.value.dotOpenclaw, description: '.openclaw' },
    { key: 'skills', name: 'Skills 目录', icon: '🎯', path: openclawPaths.value.skills, description: 'skills' },
    { key: 'agents', name: 'Agents 目录', icon: '🤖', path: openclawPaths.value.agents, description: 'agents' },
    { key: 'workspace', name: '工作空间', icon: '📂', path: openclawPaths.value.workspace, description: 'workspace' },
    { key: 'terminal', name: '命令行', icon: '💻', path: 'terminal', description: '打开终端' }
  ]
}
</script>

<template>
  <div class="home-page" @click="closeContextMenu">
    <!-- 凭证信息卡片 -->
    <div class="card credentials-card">
      <div class="card-header">
        <div class="card-title">
          <span>🔑</span>
          <span>凭证信息</span>
        </div>
        <button class="btn btn-sm btn-secondary" @click="togglePasswordVisibility" title="切换密码显示">
          {{ showPassword ? '🙈' : '👁' }}
        </button>
      </div>
      
      <div class="credential-row">
        <span class="credential-label">Gateway URL:</span>
        <template v-if="editingCredential === 'gatewayUrl'">
          <input 
            v-model="editingValue" 
            class="credential-input"
            @keyup.enter="saveEditCredential"
            @keyup.escape="cancelEditCredential"
          />
          <button class="copy-btn success" @click="saveEditCredential">✓</button>
          <button class="copy-btn" @click="cancelEditCredential">✕</button>
        </template>
        <template v-else>
          <span class="credential-value">{{ config.gatewayUrl }}</span>
          <button class="copy-btn" @click="startEditCredential('gatewayUrl', config.gatewayUrl)">✏️</button>
          <button 
            class="copy-btn"
            :class="{ copied: copiedField === 'gatewayUrl' }"
            @click="copyCredential('gatewayUrl', config.gatewayUrl)"
          >
            {{ copiedField === 'gatewayUrl' ? '✓' : '📋' }}
          </button>
        </template>
      </div>
      
      <div class="credential-row">
        <span class="credential-label">Token:</span>
        <template v-if="editingCredential === 'token'">
          <input 
            v-model="editingValue" 
            class="credential-input"
            @keyup.enter="saveEditCredential"
            @keyup.escape="cancelEditCredential"
          />
          <button class="copy-btn success" @click="saveEditCredential">✓</button>
          <button class="copy-btn" @click="cancelEditCredential">✕</button>
        </template>
        <template v-else>
          <span class="credential-value" :title="config.token">
            {{ displayToken || '未检测到 Token' }}
          </span>
          <button class="copy-btn" @click="startEditCredential('token', config.token)">✏️</button>
          <button 
            class="copy-btn"
            :class="{ copied: copiedField === 'token' }"
            @click="copyCredential('token', config.token)"
            :disabled="!config.token"
          >
            {{ copiedField === 'token' ? '✓' : '📋' }}
          </button>
          <button 
            class="copy-btn primary"
            :disabled="isFetchingToken"
            @click="refreshToken"
            title="重新获取 Token"
          >
            {{ isFetchingToken ? '⏳' : '🔄' }}
          </button>
        </template>
      </div>
      
      <div class="credential-row">
        <span class="credential-label">密码:</span>
        <template v-if="editingCredential === 'password'">
          <input 
            v-model="editingValue" 
            type="password"
            class="credential-input"
            @keyup.enter="saveEditCredential"
            @keyup.escape="cancelEditCredential"
          />
          <button class="copy-btn success" @click="saveEditCredential">✓</button>
          <button class="copy-btn" @click="cancelEditCredential">✕</button>
        </template>
        <template v-else>
          <span class="credential-value" :class="{ masked: !showPassword }">
            {{ showPassword ? (config.password || '未设置') : '••••••••' }}
          </span>
          <button class="copy-btn" @click="startEditCredential('password', config.password)">✏️</button>
          <button 
            class="copy-btn"
            :class="{ copied: copiedField === 'password' }"
            @click="copyCredential('password', config.password)"
            :disabled="!config.password"
          >
            {{ copiedField === 'password' ? '✓' : '📋' }}
          </button>
        </template>
      </div>
    </div>
    
    <!-- 文件夹区域 -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>📁</span>
          <span>文件夹</span>
        </div>
        <button class="btn btn-sm btn-primary" @click="showAddFolderModal">
          ➕ 添加
        </button>
      </div>
      
      <div class="card-content">
        <!-- 内置文件夹 -->
        <div 
          v-for="item in getFolderItems()" 
          :key="item.key"
          class="shortcut-card"
          :class="{ 'no-path': !item.path && item.key !== 'terminal' }"
          @click="item.key === 'terminal' ? openTerminal() : openFolder(item.path)"
          @contextmenu="showContextMenu($event, item, 'folder')"
        >
          <span class="shortcut-icon">{{ item.icon }}</span>
          <span class="shortcut-name">{{ item.name }}</span>
          <span class="shortcut-path">{{ item.path || item.description }}</span>
        </div>
        
        <!-- 自定义文件夹 -->
        <div 
          v-for="folder in customFolders" 
          :key="folder.key"
          class="shortcut-card"
          @click="openFolder(folder.path)"
          @contextmenu="showContextMenu($event, folder, 'folder')"
        >
          <span class="shortcut-icon">{{ folder.icon }}</span>
          <span class="shortcut-name">{{ folder.name }}</span>
          <span class="shortcut-path">{{ folder.path }}</span>
        </div>
      </div>
    </div>
    
    <!-- 常用链接区域 -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>⭐</span>
          <span>常用</span>
        </div>
      </div>
      
      <div class="card-content">
        <div 
          v-for="link in commonLinks" 
          :key="link.id" 
          class="shortcut-card"
          @click="openLink(link)"
        >
          <span class="shortcut-icon">{{ link.icon }}</span>
          <span class="shortcut-name">{{ link.name }}</span>
          <span class="shortcut-path" v-if="link.type === 'url'">{{ link.url }}</span>
          <span class="shortcut-path" v-else>点击配置</span>
        </div>
      </div>
    </div>
    
    <!-- 服务管理区域 -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>⚡</span>
          <span>服务管理</span>
        </div>
      </div>
      
      <!-- 默认服务 -->
      <div class="section-title">默认服务</div>
      <div class="services-grid">
        <div 
          v-for="service in services" 
          :key="service.id"
          class="service-card shortcut-card"
          @contextmenu="showContextMenu($event, service, 'service')"
        >
          <div class="service-status">
            <span class="status-dot" :class="service.status"></span>
            <span>{{ service.status === 'running' ? '运行中' : service.status === 'stopped' ? '已停止' : '未找到' }}</span>
          </div>
          <span class="service-icon">{{ service.icon }}</span>
          <span class="service-name">{{ service.name }}</span>
          <span class="service-type">系统服务</span>
          <div class="service-actions">
            <button 
              v-if="service.status !== 'running'" 
              class="btn btn-sm btn-success"
              @click="startServiceById(service.id)"
            >
              ▶ 启动
            </button>
            <button 
              v-else 
              class="btn btn-sm btn-danger"
              @click="stopServiceById(service.id)"
            >
              ⏹ 停止
            </button>
          </div>
        </div>
      </div>
      
      <!-- 本地服务 -->
      <div class="section-title" v-if="localServices.length > 0">本地服务</div>
      <div class="services-grid" v-if="localServices.length > 0">
        <div 
          v-for="service in localServices" 
          :key="service.id"
          class="service-card shortcut-card"
          @contextmenu="showContextMenu($event, service, 'service')"
        >
          <div class="service-status">
            <span class="status-dot" :class="service.status"></span>
            <span>{{ service.status === 'running' ? '运行中' : service.status === 'stopped' ? '已停止' : '未找到' }}</span>
          </div>
          <span class="service-icon">{{ service.icon }}</span>
          <span class="service-name">{{ service.name }}</span>
          <span class="service-type">本地应用</span>
          <div class="service-actions">
            <button 
              v-if="service.status !== 'running'" 
              class="btn btn-sm btn-success"
              @click="startService(service)"
            >
              ▶ 启动
            </button>
            <button 
              v-else 
              class="btn btn-sm btn-danger"
              @click="stopLocalService(service)"
            >
              ⏹ 停止
            </button>
          </div>
        </div>
        
        <!-- 添加服务卡片 -->
        <div class="shortcut-card add-card" @click="showAddServiceModal">
          <span class="shortcut-icon">➕</span>
          <span class="shortcut-name">添加服务</span>
        </div>
      </div>
      
      <!-- 无本地服务时显示添加按钮 -->
      <div class="section-title" v-if="localServices.length === 0">
        <button class="btn btn-primary btn-sm" @click="showAddServiceModal">
          ➕ 添加本地服务
        </button>
      </div>
    </div>
    
    <!-- 底部控制栏 -->
    <div class="bottom-bar">
      <button 
        class="btn btn-coffee" 
        @click.stop="toggleDonateModal" 
        title="☕ 请作者GT喝杯咖啡 - 点击打赏"
      >
        <span class="coffee-icon">☕</span>
        <span class="coffee-text">请作者GT喝咖啡</span>
      </button>
      <button class="btn btn-danger btn-lg" @click.stop="stopAllServices">
        ⏹ 全部停止
      </button>
      <button class="btn btn-success btn-lg" @click.stop="startAllServices">
        ⚡ 全部启动
      </button>
    </div>
    
    <!-- 收款码悬浮窗口 -->
    <div v-if="donateModal.show" class="donate-overlay" @click="toggleDonateModal">
      <div class="donate-modal" @click.stop>
        <div class="donate-header">
          <h3>☕ 请作者GT喝杯咖啡</h3>
          <button class="close-btn" @click="toggleDonateModal">✕</button>
        </div>
        <div class="donate-content">
          <p class="donate-tip">您的支持是我最大的动力 💪</p>
          <div class="qrcode-container">
            <div class="qrcode-item">
              <span class="qrcode-label">💚 微信</span>
              <img src="/qrcode/476d247a7f3a7ac35e70d25ef915e6e.jpg" alt="微信收款码" class="qrcode-img" />
            </div>
            <div class="qrcode-item">
              <span class="qrcode-label">💙 支付宝</span>
              <img src="/qrcode/c3acf471c8be6977b8af49c7bcfc359.jpg" alt="支付宝收款码" class="qrcode-img" />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 右键菜单 -->
    <div 
      v-if="contextMenu.show"
      class="context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
      @click.stop
    >
      <template v-if="contextMenu.target?.type === 'folder'">
        <div class="context-menu-item" @click="handleContextMenuAction('open')">
          📂 打开
        </div>
        <div class="context-menu-item" @click="handleContextMenuAction('bind')">
          🔗 绑定/添加文件夹
        </div>
        <div 
          v-if="contextMenu.target?.key?.startsWith('custom_')" 
          class="context-menu-item danger" 
          @click="handleContextMenuAction('delete-folder')"
        >
          🗑 删除
        </div>
      </template>
      <template v-if="contextMenu.target?.type === 'service'">
        <div 
          v-if="contextMenu.target?.status !== 'running'" 
          class="context-menu-item" 
          @click="handleContextMenuAction('start')"
        >
          ▶ 启动
        </div>
        <div 
          v-if="contextMenu.target?.status === 'running'" 
          class="context-menu-item" 
          @click="handleContextMenuAction('stop')"
        >
          ⏹ 停止
        </div>
        <!-- Gateway 强制停止选项 -->
        <div 
          v-if="contextMenu.target?.id === 'gateway' && contextMenu.target?.status === 'running'" 
          class="context-menu-item danger"
          @click="handleContextMenuAction('force-stop')"
        >
          💀 强制停止
        </div>
        <div 
          v-if="contextMenu.target?.id?.startsWith('local_')" 
          class="context-menu-item danger"
          @click="handleContextMenuAction('delete')"
        >
          🗑 删除
        </div>
      </template>
    </div>
    
    <!-- CodingPlan 配置弹窗 -->
    <div v-if="codingPlanModal.show" class="modal-overlay" @click="codingPlanModal.show = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>💳 CodingPlan 配置</h3>
          <button class="close-btn" @click="codingPlanModal.show = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>API Key</label>
            <input 
              type="password" 
              v-model="codingPlanModal.apiKey" 
              placeholder="输入 API Key"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Base URL</label>
            <input 
              type="text" 
              v-model="codingPlanModal.baseUrl" 
              placeholder="https://api.codingplan.dev"
              class="form-input"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="codingPlanModal.show = false">取消</button>
          <button class="btn btn-primary" @click="saveCodingPlan">保存</button>
        </div>
      </div>
    </div>

    <!-- 确认对话框 -->
    <div v-if="confirmDialog.show" class="modal-overlay" @click="closeConfirmDialog">
      <div class="modal confirm-modal" @click.stop>
        <div class="modal-header">
          <h3>⚠️ {{ confirmDialog.title }}</h3>
          <button class="close-btn" @click="closeConfirmDialog">✕</button>
        </div>
        <div class="modal-body">
          <div class="confirm-message">{{ confirmDialog.message }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeConfirmDialog">取消</button>
          <button class="btn btn-primary" @click="confirmDialog.onConfirm?.()">确定</button>
        </div>
      </div>
    </div>

    <!-- OpenClaw 安装进度弹窗 -->
    <div v-if="openclawInstallModal.show" class="modal-overlay">
      <div class="modal install-modal">
        <div class="modal-header">
          <h3>🚀 安装 OpenClaw</h3>
        </div>
        <div class="modal-body">
          <div class="install-progress">
            <div class="progress-stage">{{ openclawInstallModal.message }}</div>
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: openclawInstallModal.progress + '%' }"></div>
            </div>
            <div class="progress-percentage">{{ openclawInstallModal.progress }}%</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 添加服务弹窗 -->
    <div v-if="addServiceModal.show" class="modal-overlay" @click="addServiceModal.show = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>➕ 添加本地服务</h3>
          <button class="close-btn" @click="addServiceModal.show = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>图标（点击选择图片）</label>
            <div class="icon-picker">
              <span class="icon-preview">{{ addServiceModal.icon }}</span>
              <input 
                type="text" 
                v-model="addServiceModal.icon" 
                placeholder="🔧"
                class="form-input"
              />
              <button class="btn btn-secondary" @click="selectServiceIcon">📷 上传</button>
            </div>
          </div>
          <div class="form-group">
            <label>服务名称</label>
            <input 
              type="text" 
              v-model="addServiceModal.name" 
              placeholder="输入服务名称"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>启动文件路径（支持 .exe/.bat）</label>
            <div class="input-with-btn">
              <input 
                type="text" 
                v-model="addServiceModal.exePath" 
                placeholder="选择或输入路径"
                class="form-input"
              />
              <button class="btn btn-secondary" @click="selectServiceFile">📂 浏览</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="addServiceModal.show = false">取消</button>
          <button class="btn btn-primary" @click="addLocalService">添加</button>
        </div>
      </div>
    </div>
    
    <!-- 添加文件夹弹窗 -->
    <div v-if="addFolderModal.show" class="modal-overlay" @click="addFolderModal.show = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>📁 添加文件夹</h3>
          <button class="close-btn" @click="addFolderModal.show = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>图标（点击选择图片）</label>
            <div class="icon-picker">
              <span class="icon-preview">{{ addFolderModal.icon }}</span>
              <input 
                type="text" 
                v-model="addFolderModal.icon" 
                placeholder="📁"
                class="form-input"
              />
              <button class="btn btn-secondary" @click="selectFolderIcon">📷 上传</button>
            </div>
          </div>
          <div class="form-group">
            <label>文件夹名称</label>
            <input 
              type="text" 
              v-model="addFolderModal.name" 
              placeholder="输入文件夹名称"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>文件夹路径</label>
            <div class="input-with-btn">
              <input 
                type="text" 
                v-model="addFolderModal.path" 
                placeholder="选择文件夹路径"
                class="form-input"
              />
              <button class="btn btn-secondary" @click="selectFolderPath">📂 浏览</button>
            </div>
          </div>
          <!-- 错误提示 -->
          <div v-if="addFolderModal.error" class="error-message">
            ⚠️ {{ addFolderModal.error }}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="addFolderModal.show = false">取消</button>
          <button class="btn btn-primary" @click="confirmAddFolder">添加</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding-bottom: 80px;
}

.section-title {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: var(--spacing-md) 0 var(--spacing-sm);
  padding-left: var(--spacing-xs);
  border-left: 3px solid var(--color-accent);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--spacing-md);
}

.service-card {
  position: relative;
}

.service-card .service-status {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-muted);
}

.service-card .service-icon {
  font-size: 36px;
  margin-bottom: var(--spacing-xs);
}

.service-card .service-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  text-align: center;
}

.service-card .service-type {
  font-size: 11px;
  color: var(--color-text-muted);
  text-align: center;
  margin-bottom: var(--spacing-sm);
}

.service-actions {
  margin-top: var(--spacing-sm);
  width: 100%;
}

.service-actions .btn {
  width: 100%;
}

.credentials-card {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(123, 47, 255, 0.05));
  border: 1px solid var(--color-border-glow);
}

.credential-row {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--color-border);
}

.credential-row:last-child {
  border-bottom: none;
}

.credential-label {
  width: 100px;
  font-size: 13px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.credential-value {
  flex: 1;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: var(--spacing-sm);
}

.credential-value.masked {
  color: var(--color-text-muted);
}

.credential-input {
  flex: 1;
  padding: 4px 8px;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
  font-size: 13px;
  font-family: var(--font-mono);
  margin-right: var(--spacing-sm);
}

.credential-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
}

.copy-btn {
  padding: 4px 8px;
  font-size: 11px;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.2);
  color: var(--color-accent);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.copy-btn:hover:not(:disabled) {
  background: rgba(0, 212, 255, 0.2);
  border-color: var(--color-accent);
}

.copy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.copy-btn.copied {
  background: rgba(0, 255, 136, 0.2);
  border-color: var(--color-success);
  color: var(--color-success);
}

.copy-btn.success {
  background: rgba(0, 255, 136, 0.2);
  border-color: var(--color-success);
  color: var(--color-success);
}

.copy-btn.primary {
  background: rgba(123, 47, 255, 0.2);
  border-color: rgba(123, 47, 255, 0.3);
  color: #7b2fff;
}

/* 右键菜单 */
.context-menu {
  position: fixed;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  min-width: 150px;
  padding: var(--spacing-xs);
}

.context-menu-item {
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast);
  font-size: 13px;
}

.context-menu-item:hover {
  background: var(--color-bg-hover);
}

.context-menu-item.danger {
  color: var(--color-danger);
}

.context-menu-item.danger:hover {
  background: rgba(255, 71, 87, 0.1);
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 400px;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
}

.close-btn:hover {
  color: var(--color-text-primary);
}

.modal-body {
  padding: var(--spacing-lg);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.form-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: 14px;
  transition: border-color var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.input-with-btn {
  display: flex;
  gap: var(--spacing-sm);
}

.input-with-btn .form-input {
  flex: 1;
}

.error-message {
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid rgba(255, 71, 87, 0.3);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  color: #ff4757;
  font-size: 13px;
  margin-top: var(--spacing-sm);
}

.icon-picker {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.icon-picker .icon-preview {
  font-size: 28px;
  width: 40px;
  text-align: center;
}

.icon-picker .form-input {
  flex: 1;
}

.no-path {
  opacity: 0.6;
}

.no-path .shortcut-path {
  color: var(--color-danger);
}

/* 底部控制栏样式调整 */
.bottom-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

/* 请作者喝咖啡按钮 */
.btn-coffee {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.btn-coffee:hover {
  background: linear-gradient(135deg, #ff4757, #ff6348);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.5);
}

.btn-coffee:active {
  transform: translateY(0);
}

.coffee-icon {
  font-size: 16px;
}

.coffee-text {
  white-space: nowrap;
}

/* 收款码悬浮窗口 */
.donate-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.donate-modal {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 500px;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease;
}

.donate-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.donate-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--color-text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--color-text-primary);
}

.donate-content {
  padding: var(--spacing-lg);
}

.donate-tip {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 14px;
  margin-bottom: var(--spacing-lg);
}

.qrcode-container {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
}

.qrcode-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.qrcode-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.qrcode-img {
  width: 200px;
  height: 200px;
  border-radius: var(--radius-md);
  border: 2px solid var(--color-border);
  object-fit: cover;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* 确认对话框 */
.confirm-modal {
  max-width: 420px;
}

.confirm-message {
  white-space: pre-line;
  line-height: 1.6;
  color: var(--color-text-secondary);
  font-size: 14px;
}

/* 安装进度弹窗 */
.install-modal {
  max-width: 400px;
}

.install-progress {
  text-align: center;
  padding: var(--spacing-lg) 0;
}

.progress-stage {
  font-size: 16px;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
  font-weight: 500;
}

.progress-bar-container {
  height: 12px;
  background: var(--color-bg-tertiary);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: var(--spacing-sm);
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent), #10b981);
  border-radius: 6px;
  transition: width 0.3s ease;
}

.progress-percentage {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-accent);
}
</style>
