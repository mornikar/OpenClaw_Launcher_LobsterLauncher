import { ElectronAPI } from '@electron-toolkit/preload'

interface Config {
  gatewayUrl: string
  token: string
  password: string
  theme: string
  startupDelay: number
  gatewayPort: number
  autoStartGateway: boolean
}

interface Service {
  id: string
  name: string
  exePath: string
  args?: string[]
  icon?: string
  type: 'system' | 'local'
  status: 'running' | 'stopped' | 'not_found'
}

interface OpenClawPaths {
  main: string | null
  config: string
  skills: string
  agents: string
  workspace: string
  dotOpenclaw: string
}

interface CustomFolder {
  key: string
  name: string
  path: string
  icon?: string
}

interface CodingPlanConfig {
  apiKey: string
  baseUrl: string
}

interface SystemInfo {
  cpu: {
    usage: number
    cores: number
  }
  memory: {
    total: number
    used: number
    usage: number
  }
  disk: Array<{
    mount: string
    total: number
    used: number
    usage: number
  }>
  os: {
    platform: string
    distro: string
    release: string
  }
}

interface API {
  getConfig: () => Promise<Config>
  saveConfig: (config: Config) => Promise<boolean>
  getServices: () => Promise<Service[]>
  saveServices: (services: Service[]) => Promise<boolean>
  startService: (service: Service) => Promise<boolean>
  stopService: (serviceName: string) => Promise<boolean>
  forceStopService: () => Promise<boolean>
  checkServiceStatus: (serviceName: string) => Promise<'running' | 'stopped' | 'not_found'>
  startAllServices: () => Promise<Array<{ name: string; success: boolean }>>
  stopAllServices: () => Promise<Array<{ name: string; success: boolean }>>
  startGateway: () => Promise<boolean>
  stopGateway: () => Promise<boolean>
  detectOpenClaw: () => Promise<{ path: string | null; token: string }>
  fetchToken: () => Promise<{ success: boolean; token: string; error: string }>
  getOpenClawPaths: () => Promise<OpenClawPaths>
  openTerminal: () => Promise<boolean>
  getSystemInfo: () => Promise<SystemInfo | null>
  openFolder: (path: string) => Promise<boolean>
  openUrl: (url: string) => Promise<boolean>
  copyToClipboard: (text: string) => Promise<boolean>
  selectFolder: () => Promise<string | null>
  selectFile: (filters?: any[]) => Promise<string | null>
  selectImage: () => Promise<string | null>
  saveIcon: (iconData: string, name: string) => Promise<string | null>
  getIconPath: (name: string) => Promise<string | null>
  getCustomFolders: () => Promise<CustomFolder[]>
  saveCustomFolders: (folders: CustomFolder[]) => Promise<boolean>
  bindFolder: (key: string, path: string) => Promise<boolean>
  getCodingPlanConfig: () => Promise<CodingPlanConfig>
  saveCodingPlanConfig: (config: CodingPlanConfig) => Promise<boolean>
  getApiUsage: () => Promise<{ success: boolean; data?: any; error?: string; note?: string }>
  getModelUsage: () => Promise<{ success: boolean; data?: { models: Array<{ name: string; usage: number; requests: number }> }; error?: string; note?: string }>
  
  // Skills相关
  getAllSkills: () => Promise<{ success: boolean; skills: Array<{ name: string; path: string; category: string; description: string; enabled: boolean }>; categories?: Record<string, number>; error?: string }>
  getSkillsConfig: () => Promise<{ success: boolean; config?: any; error?: string }>
  saveSkillsConfig: (config: any) => Promise<{ success: boolean; error?: string }>
  
  // 模型管理相关
  getLocalModels: () => Promise<{ success: boolean; models: Array<{ name: string; path: string; size: string; modified: string; description: string }>; error?: string }>
  getModelDetails: (modelPath: string) => Promise<{ success: boolean; details?: Record<string, string>; error?: string }>
  
  // 终端相关
  getTerminalConfig: () => Promise<{ success: boolean; shell: string }>
  
  // 小工具相关
  getTools: () => Promise<{ success: boolean; tools: any[]; error?: string }>
  saveTools: (tools: any[]) => Promise<{ success: boolean; error?: string }>
  runTool: (tool: any) => Promise<{ success: boolean; error?: string }>
  openToolLocation: (toolPath: string) => Promise<{ success: boolean }>
  
  onTriggerStartAll: (callback: () => void) => () => void
  onTriggerStopAll: (callback: () => void) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
