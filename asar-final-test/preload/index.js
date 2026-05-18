"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {
  // 配置相关
  getConfig: async () => {
    try {
      return await electron.ipcRenderer.invoke("get-config");
    } catch (e) {
      console.error("IPC error in getConfig:", e);
      throw e;
    }
  },
  saveConfig: (config) => electron.ipcRenderer.invoke("save-config", config),
  // 服务相关
  getServices: async () => {
    try {
      return await electron.ipcRenderer.invoke("get-services");
    } catch (e) {
      console.error("IPC error in getServices:", e);
      throw e;
    }
  },
  saveServices: (services) => electron.ipcRenderer.invoke("save-services", services),
  startService: (service) => electron.ipcRenderer.invoke("start-service", service),
  stopService: (serviceName) => electron.ipcRenderer.invoke("stop-service", serviceName),
  forceStopService: () => electron.ipcRenderer.invoke("force-stop-service"),
  checkServiceStatus: (serviceName) => electron.ipcRenderer.invoke("check-service-status", serviceName),
  startAllServices: () => electron.ipcRenderer.invoke("start-all-services"),
  stopAllServices: () => electron.ipcRenderer.invoke("stop-all-services"),
  startGateway: () => electron.ipcRenderer.invoke("start-gateway"),
  stopGateway: () => electron.ipcRenderer.invoke("stop-gateway"),
  // OpenClaw 相关
  detectOpenClaw: async () => {
    try {
      return await electron.ipcRenderer.invoke("detect-openclaw");
    } catch (e) {
      console.error("IPC error in detectOpenClaw:", e);
      throw e;
    }
  },
  fetchToken: () => electron.ipcRenderer.invoke("fetch-token"),
  getOpenClawPaths: async () => {
    try {
      return await electron.ipcRenderer.invoke("get-openclaw-paths");
    } catch (e) {
      console.error("IPC error in getOpenClawPaths:", e);
      throw e;
    }
  },
  openTerminal: () => electron.ipcRenderer.invoke("open-terminal"),
  installOpenClaw: () => electron.ipcRenderer.invoke("install-openclaw"),
  onOpenClawInstallProgress: (callback) => {
    electron.ipcRenderer.on("openclaw-install-progress", (_, data) => callback(data));
  },
  // 文件夹相关
  selectFolder: () => electron.ipcRenderer.invoke("select-folder"),
  selectFile: (filters) => electron.ipcRenderer.invoke("select-file", filters),
  selectImage: () => electron.ipcRenderer.invoke("select-image"),
  getCustomFolders: () => electron.ipcRenderer.invoke("get-custom-folders"),
  saveCustomFolders: (folders) => electron.ipcRenderer.invoke("save-custom-folders", folders),
  bindFolder: (key, path) => electron.ipcRenderer.invoke("bind-folder", key, path),
  saveIcon: (iconData, name) => electron.ipcRenderer.invoke("save-icon", iconData, name),
  getIconPath: (name) => electron.ipcRenderer.invoke("get-icon-path", name),
  // CodingPlan API配置
  getCodingPlanConfig: () => electron.ipcRenderer.invoke("get-coding-plan-config"),
  saveCodingPlanConfig: (config) => electron.ipcRenderer.invoke("save-coding-plan-config", config),
  // 系统相关
  getSystemInfo: () => electron.ipcRenderer.invoke("get-system-info"),
  openFolder: (path) => electron.ipcRenderer.invoke("open-folder", path),
  openUrl: (url) => electron.ipcRenderer.invoke("open-url", url),
  // 剪贴板
  copyToClipboard: (text) => electron.ipcRenderer.invoke("copy-to-clipboard", text),
  // 使用统计
  getApiUsage: () => electron.ipcRenderer.invoke("get-api-usage"),
  getModelUsage: () => electron.ipcRenderer.invoke("get-model-usage"),
  // Skills相关
  getAllSkills: () => electron.ipcRenderer.invoke("get-all-skills"),
  getSkillsConfig: () => electron.ipcRenderer.invoke("get-skills-config"),
  saveSkillsConfig: (config) => electron.ipcRenderer.invoke("save-skills-config", config),
  importSkillsFromFolder: (folderPath) => electron.ipcRenderer.invoke("import-skills-from-folder", folderPath),
  addCustomSkillsFolder: (folderPath) => electron.ipcRenderer.invoke("add-custom-skills-folder", folderPath),
  // 模型管理相关
  getLocalModels: () => electron.ipcRenderer.invoke("get-local-models"),
  getModelDetails: (modelPath) => electron.ipcRenderer.invoke("get-model-details", modelPath),
  getModelFolders: () => electron.ipcRenderer.invoke("get-model-folders"),
  addModelFolder: (folderPath) => electron.ipcRenderer.invoke("add-model-folder", folderPath),
  removeModelFolder: (folderPath) => electron.ipcRenderer.invoke("remove-model-folder", folderPath),
  // 终端相关
  getTerminalConfig: () => electron.ipcRenderer.invoke("get-terminal-config"),
  // 小工具相关
  getTools: () => electron.ipcRenderer.invoke("get-tools"),
  saveTools: (tools) => electron.ipcRenderer.invoke("save-tools", tools),
  runTool: (tool) => electron.ipcRenderer.invoke("run-tool", tool),
  openToolLocation: (toolPath) => electron.ipcRenderer.invoke("open-tool-location", toolPath),
  // 事件监听
  onTriggerStartAll: (callback) => {
    electron.ipcRenderer.on("trigger-start-all", callback);
    return () => electron.ipcRenderer.removeListener("trigger-start-all", callback);
  },
  onTriggerStopAll: (callback) => {
    electron.ipcRenderer.on("trigger-stop-all", callback);
    return () => electron.ipcRenderer.removeListener("trigger-stop-all", callback);
  }
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
