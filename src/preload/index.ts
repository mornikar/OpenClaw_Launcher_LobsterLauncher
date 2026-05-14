import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 自定义 API
const api = {
  // 配置相关
  getConfig: async () => {
    try {
      return await ipcRenderer.invoke('get-config')
    } catch (e) {
      console.error('IPC error in getConfig:', e)
      throw e
    }
  },
  saveConfig: (config: any) => ipcRenderer.invoke('save-config', config),

  // 服务相关
  getServices: async () => {
    try {
      return await ipcRenderer.invoke('get-services')
    } catch (e) {
      console.error('IPC error in getServices:', e)
      throw e
    }
  },
  saveServices: (services: any[]) => ipcRenderer.invoke('save-services', services),
  startService: (service: any) => ipcRenderer.invoke('start-service', service),
  stopService: (serviceName: string) => ipcRenderer.invoke('stop-service', serviceName),
  forceStopService: () => ipcRenderer.invoke('force-stop-service'),
  checkServiceStatus: (serviceName: string) => ipcRenderer.invoke('check-service-status', serviceName),
  startAllServices: () => ipcRenderer.invoke('start-all-services'),
  stopAllServices: () => ipcRenderer.invoke('stop-all-services'),
  startGateway: () => ipcRenderer.invoke('start-gateway'),
  stopGateway: () => ipcRenderer.invoke('stop-gateway'),

  // OpenClaw 相关
  detectOpenClaw: async () => {
    try {
      return await ipcRenderer.invoke('detect-openclaw')
    } catch (e) {
      console.error('IPC error in detectOpenClaw:', e)
      throw e
    }
  },
  fetchToken: () => ipcRenderer.invoke('fetch-token'),
  getOpenClawPaths: async () => {
    try {
      return await ipcRenderer.invoke('get-openclaw-paths')
    } catch (e) {
      console.error('IPC error in getOpenClawPaths:', e)
      throw e
    }
  },
  openTerminal: () => ipcRenderer.invoke('open-terminal'),
  installOpenClaw: () => ipcRenderer.invoke('install-openclaw'),
  onOpenClawInstallProgress: (callback: (data: any) => void) => {
    ipcRenderer.on('openclaw-install-progress', (_, data) => callback(data))
  },

  // 文件夹相关
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectFile: (filters?: any[]) => ipcRenderer.invoke('select-file', filters),
  selectImage: () => ipcRenderer.invoke('select-image'),
  getCustomFolders: () => ipcRenderer.invoke('get-custom-folders'),
  saveCustomFolders: (folders: any[]) => ipcRenderer.invoke('save-custom-folders', folders),
  bindFolder: (key: string, path: string) => ipcRenderer.invoke('bind-folder', key, path),
  saveIcon: (iconData: string, name: string) => ipcRenderer.invoke('save-icon', iconData, name),
  getIconPath: (name: string) => ipcRenderer.invoke('get-icon-path', name),

  // CodingPlan API配置
  getCodingPlanConfig: () => ipcRenderer.invoke('get-coding-plan-config'),
  saveCodingPlanConfig: (config: any) => ipcRenderer.invoke('save-coding-plan-config', config),

  // 系统相关
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  openFolder: (path: string) => ipcRenderer.invoke('open-folder', path),
  openUrl: (url: string) => ipcRenderer.invoke('open-url', url),

  // 剪贴板
  copyToClipboard: (text: string) => ipcRenderer.invoke('copy-to-clipboard', text),

  // 使用统计
  getApiUsage: () => ipcRenderer.invoke('get-api-usage'),
  getModelUsage: () => ipcRenderer.invoke('get-model-usage'),

  // Skills相关
  getAllSkills: () => ipcRenderer.invoke('get-all-skills'),
  getSkillsConfig: () => ipcRenderer.invoke('get-skills-config'),
  saveSkillsConfig: (config: any) => ipcRenderer.invoke('save-skills-config', config),
  importSkillsFromFolder: (folderPath: string) => ipcRenderer.invoke('import-skills-from-folder', folderPath),
  addCustomSkillsFolder: (folderPath: string) => ipcRenderer.invoke('add-custom-skills-folder', folderPath),

  // 模型管理相关
  getLocalModels: () => ipcRenderer.invoke('get-local-models'),
  getModelDetails: (modelPath: string) => ipcRenderer.invoke('get-model-details', modelPath),
  getModelFolders: () => ipcRenderer.invoke('get-model-folders'),
  addModelFolder: (folderPath: string) => ipcRenderer.invoke('add-model-folder', folderPath),
  removeModelFolder: (folderPath: string) => ipcRenderer.invoke('remove-model-folder', folderPath),

  // 终端相关
  getTerminalConfig: () => ipcRenderer.invoke('get-terminal-config'),

  // 小工具相关
  getTools: () => ipcRenderer.invoke('get-tools'),
  saveTools: (tools: any[]) => ipcRenderer.invoke('save-tools', tools),
  runTool: (tool: any) => ipcRenderer.invoke('run-tool', tool),
  openToolLocation: (toolPath: string) => ipcRenderer.invoke('open-tool-location', toolPath),

  // 事件监听
  onTriggerStartAll: (callback: () => void) => {
    ipcRenderer.on('trigger-start-all', callback)
    return () => ipcRenderer.removeListener('trigger-start-all', callback)
  },
  onTriggerStopAll: (callback: () => void) => {
    ipcRenderer.on('trigger-stop-all', callback)
    return () => ipcRenderer.removeListener('trigger-stop-all', callback)
  }
}

// 使用 contextBridge 暴露 API
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}
