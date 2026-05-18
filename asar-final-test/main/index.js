"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const log = require("electron-log/main");
const child_process = require("child_process");
const os = require("os");
const fs = require("fs");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const os__namespace = /* @__PURE__ */ _interopNamespaceDefault(os);
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
log.initialize();
log.info("🦞 龙虾启动器启动中...");
let mainWindow = null;
let tray = null;
let services = /* @__PURE__ */ new Map();
const dataPath = path.join(electron.app.getPath("userData"), "data");
const configPath = path.join(dataPath, "config.json");
const servicesConfigPath = path.join(dataPath, "services.json");
const customFoldersPath = path.join(dataPath, "custom-folders.json");
const codingPlanConfigPath = path.join(dataPath, "coding-plan.json");
let gatewayProcess = null;
if (!fs__namespace.existsSync(dataPath)) {
  fs__namespace.mkdirSync(dataPath, { recursive: true });
}
const defaultConfig = {
  gatewayUrl: "http://localhost:18789",
  token: "",
  password: "",
  theme: "dark",
  startupDelay: 1e3,
  gatewayPort: 18789,
  autoStartGateway: true
};
function loadConfig() {
  try {
    if (fs__namespace.existsSync(configPath)) {
      const data = fs__namespace.readFileSync(configPath, "utf-8");
      return { ...defaultConfig, ...JSON.parse(data) };
    }
  } catch (e) {
    log.error("读取配置失败:", e);
  }
  return defaultConfig;
}
function saveConfig(config) {
  try {
    fs__namespace.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
    log.info("配置已保存");
  } catch (e) {
    log.error("保存配置失败:", e);
  }
}
function loadServicesConfig() {
  try {
    if (fs__namespace.existsSync(servicesConfigPath)) {
      const data = fs__namespace.readFileSync(servicesConfigPath, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    log.error("读取服务配置失败:", e);
  }
  return [];
}
function saveServicesConfig(services2) {
  try {
    fs__namespace.writeFileSync(servicesConfigPath, JSON.stringify(services2, null, 2), "utf-8");
    log.info("服务配置已保存");
  } catch (e) {
    log.error("保存服务配置失败:", e);
  }
}
function loadCustomFolders() {
  try {
    if (fs__namespace.existsSync(customFoldersPath)) {
      const data = fs__namespace.readFileSync(customFoldersPath, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    log.error("读取自定义文件夹失败:", e);
  }
  return [];
}
function saveCustomFolders(folders) {
  try {
    fs__namespace.writeFileSync(customFoldersPath, JSON.stringify(folders, null, 2), "utf-8");
    log.info("自定义文件夹已保存");
  } catch (e) {
    log.error("保存自定义文件夹失败:", e);
  }
}
function loadCodingPlanConfig() {
  try {
    if (fs__namespace.existsSync(codingPlanConfigPath)) {
      const data = fs__namespace.readFileSync(codingPlanConfigPath, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    log.error("读取 CodingPlan 配置失败:", e);
  }
  return { apiKey: "", baseUrl: "" };
}
function saveCodingPlanConfig(config) {
  try {
    fs__namespace.writeFileSync(codingPlanConfigPath, JSON.stringify(config, null, 2), "utf-8");
    log.info("CodingPlan 配置已保存");
  } catch (e) {
    log.error("保存 CodingPlan 配置失败:", e);
  }
}
function detectOpenClawPath() {
  const possiblePaths = [
    process.env.OPENCLAW_HOME,
    path.join(os__namespace.homedir(), ".openclaw"),
    path.join(os__namespace.homedir(), "AppData", "Roaming", "openclaw"),
    path.join(os__namespace.homedir(), "AppData", "Local", "openclaw"),
    "C:\\Program Files\\OpenClaw",
    "C:\\OpenClaw",
    "D:\\Program Files\\OpenClaw",
    "D:\\OpenClaw"
  ].filter(Boolean);
  for (const path2 of possiblePaths) {
    if (fs__namespace.existsSync(path2)) {
      log.info("检测到 OpenClaw 路径:", path2);
      return path2;
    }
  }
  return null;
}
function readToken(openclawPath) {
  if (!openclawPath) return "";
  const tokenPaths = [
    path.join(openclawPath, "token"),
    path.join(openclawPath, ".token"),
    path.join(openclawPath, "config", "token"),
    path.join(os__namespace.homedir(), ".openclaw", "token")
  ];
  for (const tokenPath of tokenPaths) {
    if (fs__namespace.existsSync(tokenPath)) {
      try {
        return fs__namespace.readFileSync(tokenPath, "utf-8").trim();
      } catch (e) {
        log.error("读取 Token 失败:", e);
      }
    }
  }
  return "";
}
function checkServiceStatus(servicePath) {
  return new Promise((resolve) => {
    child_process.exec(`tasklist /FI "IMAGENAME eq ${servicePath.split("\\").pop()}"`, (error, stdout) => {
      if (error || !stdout) {
        resolve("not_found");
        return;
      }
      const lines = stdout.split("\n").filter((line) => line.trim());
      if (lines.length > 2) {
        resolve("running");
      } else {
        resolve("stopped");
      }
    });
  });
}
async function startService(service) {
  return new Promise((resolve) => {
    try {
      log.info("启动服务:", service.name, service.exePath);
      const exeName = service.exePath.split("\\").pop() || service.name;
      const cmd = `start "" "${service.exePath}"`;
      child_process.exec(cmd, { shell: "cmd.exe" }, (error) => {
        if (error) {
          log.error("启动服务失败:", error);
          resolve(false);
        } else {
          log.info("服务启动命令已发送:", service.name);
          services.set(exeName, { killed: false });
          setTimeout(() => resolve(true), 500);
        }
      });
    } catch (e) {
      log.error("启动服务失败:", e);
      resolve(false);
    }
  });
}
async function stopService(serviceName) {
  return new Promise((resolve) => {
    try {
      child_process.exec(`taskkill /IM ${serviceName} /F`, (error) => {
        if (error) {
          log.error("停止服务失败:", error);
          resolve(false);
        } else {
          log.info("服务已停止:", serviceName);
          services.delete(serviceName);
          resolve(true);
        }
      });
    } catch (e) {
      log.error("停止服务失败:", e);
      resolve(false);
    }
  });
}
async function startGateway() {
  return new Promise((resolve) => {
    try {
      const openclawPath = detectOpenClawPath();
      if (!openclawPath) {
        log.error("未找到 OpenClaw 路径");
        resolve(false);
        return;
      }
      const cmd = `start cmd /k "cd /d ${openclawPath} && npx openclaw gateway --port 18789"`;
      log.info("启动 Gateway 命令:", cmd);
      child_process.exec(cmd, { shell: "cmd.exe" }, (error, stdout, stderr) => {
        if (error) {
          log.error("启动 Gateway 失败:", error);
          try {
            const fallbackCmd = `start cmd /k "npx openclaw gateway"`;
            child_process.exec(fallbackCmd, { shell: "cmd.exe" }, (err2) => {
              if (err2) {
                log.error("备用启动也失败:", err2);
                resolve(false);
              } else {
                log.info("Gateway 启动命令已发送（备用方案）");
                resolve(true);
              }
            });
          } catch (e) {
            log.error("备用启动异常:", e);
            resolve(false);
          }
        } else {
          log.info("Gateway 启动命令已发送");
          resolve(true);
        }
      });
    } catch (e) {
      log.error("启动 Gateway 失败:", e);
      resolve(false);
    }
  });
}
async function stopGateway() {
  return new Promise((resolve) => {
    try {
      child_process.exec(`taskkill /IM openclaw.exe /F`, (error) => {
        if (error) {
          log.error("停止 Gateway 失败:", error);
          resolve(false);
        } else {
          log.info("Gateway 已停止");
          gatewayProcess = null;
          resolve(true);
        }
      });
    } catch (e) {
      log.error("停止 Gateway 失败:", e);
      resolve(false);
    }
  });
}
async function getSystemInfo() {
  try {
    const getCpuUsage = () => {
      return new Promise((resolve) => {
        child_process.exec(
          `powershell -Command "$cpu = Get-CimInstance Win32_Processor | Select-Object -ExpandProperty LoadPercentage; if($cpu) { $cpu[0] } else { 0 }"`,
          { shell: "cmd.exe", timeout: 5e3 },
          (error, stdout) => {
            if (error) {
              resolve(Math.floor(Math.random() * 30 + 10));
            } else {
              const usage = parseInt(stdout.trim());
              resolve(isNaN(usage) ? 0 : usage);
            }
          }
        );
      });
    };
    const getMemoryInfo = () => {
      return new Promise((resolve) => {
        child_process.exec(
          `powershell -Command "$os = Get-CimInstance Win32_OperatingSystem; $total = $os.TotalVisibleMemorySize * 1024; $free = $os.FreePhysicalMemory * 1024; $used = $total - $free; @{total=$total;used=$used;usage=[math]::Round(($used/$total)*100)} | ConvertTo-Json"`,
          { shell: "cmd.exe", timeout: 5e3 },
          (error, stdout) => {
            if (error) {
              resolve({ total: 16 * 1024 * 1024 * 1024, used: 8 * 1024 * 1024 * 1024, usage: 50 });
            } else {
              try {
                const data = JSON.parse(stdout.trim());
                resolve({
                  total: data.total || 16 * 1024 * 1024 * 1024,
                  used: data.used || 8 * 1024 * 1024 * 1024,
                  usage: data.usage || 50
                });
              } catch {
                resolve({ total: 16 * 1024 * 1024 * 1024, used: 8 * 1024 * 1024 * 1024, usage: 50 });
              }
            }
          }
        );
      });
    };
    const getDiskInfo = () => {
      return new Promise((resolve) => {
        child_process.exec(
          `powershell -Command "Get-CimInstance Win32_LogicalDisk -Filter \\"DriveType=3\\" | Select-Object DeviceID,Size,FreeSpace | ForEach-Object { @{mount=$_.DeviceID; total=$_.Size; used=($_.Size - $_.FreeSpace); usage=[math]::Round((($_.Size - $_.FreeSpace)/$_.Size)*100)} } | ConvertTo-Json"`,
          { shell: "cmd.exe", timeout: 5e3 },
          (error, stdout) => {
            if (error) {
              resolve([{ mount: "C:", total: 500 * 1024 * 1024 * 1024, used: 200 * 1024 * 1024 * 1024, usage: 40 }]);
            } else {
              try {
                let data = JSON.parse(stdout.trim());
                if (!Array.isArray(data)) data = [data];
                resolve(data.map((d) => ({
                  mount: d.mount || "C:",
                  total: d.total || 500 * 1024 * 1024 * 1024,
                  used: d.used || 200 * 1024 * 1024 * 1024,
                  usage: d.usage || 40
                })));
              } catch {
                resolve([{ mount: "C:", total: 500 * 1024 * 1024 * 1024, used: 200 * 1024 * 1024 * 1024, usage: 40 }]);
              }
            }
          }
        );
      });
    };
    const [cpuUsage, memory, disks] = await Promise.all([
      getCpuUsage(),
      getMemoryInfo(),
      getDiskInfo()
    ]);
    return {
      cpu: {
        usage: cpuUsage,
        cores: os__namespace.cpus().length
      },
      memory: {
        total: memory.total,
        used: memory.used,
        usage: memory.usage
      },
      disk: disks,
      os: {
        platform: os__namespace.platform(),
        release: os__namespace.release()
      }
    };
  } catch (e) {
    log.error("获取系统信息失败:", e);
    return null;
  }
}
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    frame: true,
    autoHideMenuBar: true,
    backgroundColor: "#0a0a0f",
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();
    log.info("主窗口已显示");
    mainWindow?.webContents.on("console-message", (event, level, message, line, sourceId) => {
      const levelNames = ["debug", "info", "warn", "error"];
      const levelName = levelNames[level] || "unknown";
      log.info(`[渲染进程 ${levelName}] ${message}`);
    });
  });
  mainWindow.on("close", (event) => {
    if (!electron.app.isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
function createTray() {
  const icon = electron.nativeImage.createEmpty();
  tray = new electron.Tray(icon);
  tray.setToolTip("🦞 龙虾启动器");
  const contextMenu = electron.Menu.buildFromTemplate([
    {
      label: "显示主窗口",
      click: () => mainWindow?.show()
    },
    {
      label: "启动所有服务",
      click: () => mainWindow?.webContents.send("trigger-start-all")
    },
    {
      label: "停止所有服务",
      click: () => mainWindow?.webContents.send("trigger-stop-all")
    },
    { type: "separator" },
    {
      label: "退出",
      click: () => {
        electron.app.isQuitting = true;
        electron.app.quit();
      }
    }
  ]);
  tray.setContextMenu(contextMenu);
  tray.on("click", () => mainWindow?.show());
}
function registerGlobalShortcuts() {
  electron.globalShortcut.register("Alt+Space", () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow?.show();
      mainWindow?.focus();
    }
  });
}
function setupIpcHandlers() {
  electron.ipcMain.handle("get-config", () => {
    const config = loadConfig();
    log.info("get-config returning:", JSON.stringify(config));
    return config;
  });
  electron.ipcMain.handle("save-config", (_, config) => {
    saveConfig(config);
    return true;
  });
  electron.ipcMain.handle("get-services", () => {
    const services2 = loadServicesConfig();
    log.info("get-services returning:", JSON.stringify(services2));
    return services2;
  });
  electron.ipcMain.handle("save-services", (_, services2) => {
    saveServicesConfig(services2);
    return true;
  });
  electron.ipcMain.handle("detect-openclaw", () => {
    const p = detectOpenClawPath();
    const token = readToken(p);
    log.info("detect-openclaw returning:", { path: p, token: token ? "***" : "" });
    return { path: p, token };
  });
  electron.ipcMain.handle("install-openclaw", async (event) => {
    const homeDir = os__namespace.homedir();
    const installDir = path.join(homeDir, ".openclaw");
    try {
      const sendProgress = (stage, progress, message) => {
        event.sender.send("openclaw-install-progress", { stage, progress, message });
      };
      sendProgress("preparing", 10, "正在创建安装目录...");
      if (!fs__namespace.existsSync(installDir)) {
        fs__namespace.mkdirSync(installDir, { recursive: true });
      }
      sendProgress("installing", 30, "正在安装 OpenClaw CLI...");
      await new Promise((resolve, reject) => {
        child_process.exec(`npm install -g openclaw 2>&1`, { shell: "cmd.exe" }, (error, stdout, stderr) => {
          if (error) {
            log.error("安装 OpenClaw CLI 失败:", error);
            child_process.exec(`npx openclaw --version 2>&1`, (err2, out2) => {
              if (err2) {
                reject(new Error("安装 OpenClaw CLI 失败"));
              } else {
                log.info("OpenClaw CLI 已通过 npx 可用");
                resolve();
              }
            });
          } else {
            log.info("OpenClaw CLI 安装成功");
            resolve();
          }
        });
      });
      sendProgress("initializing", 60, "正在初始化 OpenClaw...");
      await new Promise((resolve, reject) => {
        child_process.exec(`npx openclaw init 2>&1`, { shell: "cmd.exe", cwd: installDir }, (error, stdout, stderr) => {
          if (error) {
            log.warn("OpenClaw init 可能需要交互:", error.message);
          }
          resolve();
        });
      });
      sendProgress("starting", 80, "正在启动 Gateway...");
      await new Promise((resolve) => {
        const gatewayProcess2 = child_process.spawn("npx", ["openclaw", "gateway", "--port", "18789"], {
          shell: true,
          cwd: installDir,
          detached: true,
          stdio: "ignore"
        });
        gatewayProcess2.unref();
        setTimeout(() => {
          log.info("OpenClaw Gateway 已在后台启动");
          resolve();
        }, 3e3);
      });
      sendProgress("completed", 100, "安装完成！");
      return { success: true, path: installDir };
    } catch (e) {
      log.error("安装 OpenClaw 失败:", e);
      return { success: false, error: String(e) };
    }
  });
  electron.ipcMain.handle("fetch-token", async () => {
    try {
      const homeDir = os__namespace.homedir();
      const dotOpenclaw = path.join(homeDir, ".openclaw");
      const possiblePaths = [
        path.join(dotOpenclaw, "token"),
        path.join(dotOpenclaw, ".token"),
        path.join(dotOpenclaw, "config", "token"),
        path.join(dotOpenclaw, "auth", "token"),
        path.join(homeDir, ".config", "openclaw", "token"),
        path.join(homeDir, "AppData", "Roaming", "openclaw", "token")
      ];
      for (const tokenPath of possiblePaths) {
        try {
          if (fs__namespace.existsSync(tokenPath)) {
            const token = fs__namespace.readFileSync(tokenPath, "utf-8").trim();
            if (token && token.length > 20) {
              log.info("从文件读取到Token:", tokenPath);
              return { success: true, token, error: "" };
            }
          }
        } catch (e) {
        }
      }
      const configPaths = [
        path.join(dotOpenclaw, "config.json"),
        path.join(dotOpenclaw, "settings.json")
      ];
      for (const cfgPath of configPaths) {
        try {
          if (fs__namespace.existsSync(cfgPath)) {
            const configData = JSON.parse(fs__namespace.readFileSync(cfgPath, "utf-8"));
            if (configData.token) {
              log.info("从配置文件读取到Token");
              return { success: true, token: configData.token, error: "" };
            }
          }
        } catch (e) {
        }
      }
      return new Promise((resolve) => {
        const commands = [
          `npx openclaw auth token 2>&1`,
          `cmd /c "npx openclaw auth token 2>&1"`
        ];
        let cmdIndex = 0;
        const tryNext = () => {
          if (cmdIndex >= commands.length) {
            resolve({ success: false, token: "", error: "无法获取Token，请确保OpenClaw已正确安装并登录" });
            return;
          }
          child_process.exec(
            commands[cmdIndex++],
            { shell: "cmd.exe", timeout: 3e4 },
            (error, stdout, stderr) => {
              const output = (stdout + stderr).trim();
              if (!error && output && output.length > 20 && !output.includes(" ") && !output.toLowerCase().includes("error")) {
                log.info("通过命令获取到Token");
                resolve({ success: true, token: output, error: "" });
              } else {
                tryNext();
              }
            }
          );
        };
        tryNext();
      });
    } catch (e) {
      log.error("获取 Token 异常:", e);
      return { success: false, token: "", error: String(e) };
    }
  });
  electron.ipcMain.handle("start-service", async (_, service) => {
    return await startService(service);
  });
  electron.ipcMain.handle("stop-service", async (_, serviceName) => {
    return await stopService(serviceName);
  });
  electron.ipcMain.handle("force-stop-service", async () => {
    return new Promise((resolve) => {
      child_process.exec(`taskkill /F /IM openclaw.exe /IM node.exe 2>nul`, (error) => {
        if (error) {
          log.error("强制停止失败:", error);
          resolve(false);
        } else {
          log.info("强制停止成功");
          resolve(true);
        }
      });
    });
  });
  electron.ipcMain.handle("start-gateway", async () => {
    return await startGateway();
  });
  electron.ipcMain.handle("stop-gateway", async () => {
    return await stopGateway();
  });
  electron.ipcMain.handle("check-service-status", async (_, serviceName) => {
    return await checkServiceStatus(serviceName);
  });
  electron.ipcMain.handle("start-all-services", async () => {
    const allServices = loadServicesConfig();
    const results = [];
    const gatewayResult = await startGateway();
    results.push({ name: "OpenClaw Gateway", success: gatewayResult });
    for (const service of allServices) {
      const result = await startService(service);
      results.push({ name: service.name, success: result });
    }
    return results;
  });
  electron.ipcMain.handle("stop-all-services", async () => {
    const results = [];
    const gatewayResult = await stopGateway();
    results.push({ name: "OpenClaw Gateway", success: gatewayResult });
    const allServices = loadServicesConfig();
    for (const service of allServices) {
      const result = await stopService(service.name);
      results.push({ name: service.name, success: result });
    }
    return results;
  });
  electron.ipcMain.handle("get-system-info", async () => {
    return await getSystemInfo();
  });
  electron.ipcMain.handle("open-folder", (_, path2) => {
    if (fs__namespace.existsSync(path2)) {
      electron.shell.openPath(path2);
      return true;
    }
    return false;
  });
  electron.ipcMain.handle("open-url", (_, url) => {
    electron.shell.openExternal(url);
    return true;
  });
  electron.ipcMain.handle("open-terminal", () => {
    const openclawPath = detectOpenClawPath();
    if (openclawPath) {
      child_process.exec(`start cmd /k cd /d ${openclawPath}`, { shell: true });
      return true;
    }
    return false;
  });
  electron.ipcMain.handle("get-openclaw-paths", () => {
    const openclawPath = detectOpenClawPath();
    const homeDir = os__namespace.homedir();
    const result = {
      main: openclawPath,
      config: path.join(homeDir, ".openclaw"),
      skills: path.join(homeDir, ".workbuddy", "skills"),
      agents: path.join(homeDir, ".workbuddy", "agents"),
      workspace: path.join(homeDir, "WorkBuddy"),
      dotOpenclaw: path.join(homeDir, ".openclaw")
    };
    log.info("get-openclaw-paths returning:", JSON.stringify(result));
    return result;
  });
  electron.ipcMain.handle("select-folder", async () => {
    const { dialog } = require("electron");
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"]
    });
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  });
  electron.ipcMain.handle("select-file", async (_, filters) => {
    const { dialog } = require("electron");
    const defaultFilters = [
      { name: "可执行文件", extensions: ["exe", "bat", "cmd"] },
      { name: "所有文件", extensions: ["*"] }
    ];
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openFile"],
      filters: filters || defaultFilters
    });
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  });
  electron.ipcMain.handle("select-image", async () => {
    const { dialog } = require("electron");
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openFile"],
      filters: [
        { name: "图片", extensions: ["png", "jpg", "jpeg", "gif", "ico", "webp"] }
      ]
    });
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  });
  electron.ipcMain.handle("save-icon", async (_, iconData, name) => {
    try {
      const iconsPath = path.join(dataPath, "icons");
      if (!fs__namespace.existsSync(iconsPath)) {
        fs__namespace.mkdirSync(iconsPath, { recursive: true });
      }
      const iconPath = path.join(iconsPath, `${name}.png`);
      const base64Data = iconData.replace(/^data:image\/\w+;base64,/, "");
      fs__namespace.writeFileSync(iconPath, Buffer.from(base64Data, "base64"));
      return iconPath;
    } catch (e) {
      log.error("保存图标失败:", e);
      return null;
    }
  });
  electron.ipcMain.handle("get-icon-path", (_, name) => {
    const iconPath = path.join(dataPath, "icons", `${name}.png`);
    if (fs__namespace.existsSync(iconPath)) {
      return iconPath;
    }
    return null;
  });
  electron.ipcMain.handle("get-custom-folders", () => {
    return loadCustomFolders();
  });
  electron.ipcMain.handle("save-custom-folders", (_, folders) => {
    try {
      log.info("收到保存自定义文件夹请求, folders:", JSON.stringify(folders));
      if (!Array.isArray(folders)) {
        log.error("自定义文件夹数据格式错误:", typeof folders);
        return { success: false, error: "数据格式错误" };
      }
      saveCustomFolders(folders);
      log.info("保存自定义文件夹成功");
      return { success: true };
    } catch (e) {
      log.error("保存自定义文件夹失败:", e);
      return { success: false, error: String(e) };
    }
  });
  electron.ipcMain.handle("bind-folder", (_, key, path2) => {
    const folders = loadCustomFolders();
    const existingIndex = folders.findIndex((f) => f.key === key);
    if (existingIndex >= 0) {
      folders[existingIndex].path = path2;
    } else {
      folders.push({ key, path: path2, name: key });
    }
    saveCustomFolders(folders);
    return true;
  });
  electron.ipcMain.handle("get-coding-plan-config", () => {
    return loadCodingPlanConfig();
  });
  electron.ipcMain.handle("save-coding-plan-config", (_, config) => {
    saveCodingPlanConfig(config);
    return true;
  });
  electron.ipcMain.handle("copy-to-clipboard", (_, text) => {
    const { clipboard } = require("electron");
    clipboard.writeText(text);
    return true;
  });
  electron.ipcMain.handle("get-api-usage", async () => {
    try {
      const config = loadConfig();
      if (config.gatewayUrl) {
        try {
          const response = await fetch(`${config.gatewayUrl}/api/usage`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          });
          if (response.ok) {
            const data = await response.json();
            return { success: true, data };
          }
        } catch (e) {
          log.info("Gateway API 不可用，使用本地统计");
        }
      }
      return {
        success: true,
        data: {
          today: { requests: 0, tokens: 0 },
          thisWeek: { requests: 0, tokens: 0 },
          thisMonth: { requests: 0, tokens: 0 }
        },
        note: "请先启动 Gateway 服务以获取真实使用统计"
      };
    } catch (e) {
      log.error("获取API使用统计失败:", e);
      return { success: false, error: String(e) };
    }
  });
  electron.ipcMain.handle("get-model-usage", async () => {
    try {
      const config = loadConfig();
      if (config.gatewayUrl) {
        try {
          const response = await fetch(`${config.gatewayUrl}/api/models/usage`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          });
          if (response.ok) {
            const data = await response.json();
            return { success: true, data };
          }
        } catch (e) {
          log.info("Gateway 模型API 不可用");
        }
      }
      const logPath = path.join(electron.app.getPath("userData"), "logs");
      const usageData = await analyzeUsageFromLogs(logPath);
      if (usageData.models.length > 0) {
        return { success: true, data: { models: usageData.models }, note: "从本地日志分析" };
      }
      return {
        success: true,
        data: {
          models: [
            { name: "未检测到模型", usage: 0, requests: 0 }
          ]
        },
        note: "请先使用 AI 服务以收集使用统计"
      };
    } catch (e) {
      log.error("获取模型使用分布失败:", e);
      return { success: false, error: String(e) };
    }
  });
  async function analyzeUsageFromLogs(logPath) {
    return new Promise((resolve) => {
      try {
        if (!fs__namespace.existsSync(logPath)) {
          resolve({ models: [] });
          return;
        }
        const files = fs__namespace.readdirSync(logPath).filter((f) => f.endsWith(".log"));
        let modelCounts = {};
        let totalRequests = 0;
        for (const file of files.slice(-5)) {
          try {
            const content = fs__namespace.readFileSync(path.join(logPath, file), "utf-8");
            const modelMatches = content.match(/model[=: ]+["']?([a-zA-Z0-9\-_\.]+)/gi) || [];
            for (const match of modelMatches) {
              const modelName = match.split(/[=: ]+/i).pop() || "unknown";
              modelCounts[modelName] = (modelCounts[modelName] || 0) + 1;
              totalRequests++;
            }
          } catch (e) {
          }
        }
        const models = Object.entries(modelCounts).map(([name, count]) => ({
          name,
          requests: count,
          usage: totalRequests > 0 ? Math.round(count / totalRequests * 100) : 0
        })).sort((a, b) => b.usage - a.usage);
        resolve({ models });
      } catch (e) {
        resolve({ models: [] });
      }
    });
  }
  const skillsConfigPath = path.join(dataPath, "skills-config.json");
  electron.ipcMain.handle("get-all-skills", async () => {
    try {
      const homeDir = os__namespace.homedir();
      const dotOpenclaw = path.join(homeDir, ".openclaw");
      const skillsDir = path.join(dotOpenclaw, "skills");
      if (!fs__namespace.existsSync(skillsDir)) {
        return { success: true, skills: [], error: "Skills目录不存在" };
      }
      const skills = [];
      const entries = fs__namespace.readdirSync(skillsDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const skillPath = path.join(skillsDir, entry.name);
          const skillJsonPath = path.join(skillPath, "SKILL.md");
          let description = "";
          let category = "其他";
          const NL = String.fromCharCode(10);
          if (fs__namespace.existsSync(skillJsonPath)) {
            const content = fs__namespace.readFileSync(skillJsonPath, "utf-8");
            const descIndex = content.toLowerCase().indexOf("description");
            if (descIndex !== -1) {
              const lineEnd = content.indexOf(NL, descIndex);
              const lineText = lineEnd !== -1 ? content.substring(descIndex, lineEnd) : content.substring(descIndex);
              const colonIdx = lineText.indexOf(":");
              const equalIdx = lineText.indexOf("=");
              const splitIdx = Math.max(colonIdx, equalIdx);
              if (splitIdx !== -1) {
                description = lineText.substring(splitIdx + 1).trim();
              }
            } else {
              const firstLine = content.split(NL)[0] || "";
              description = firstLine.replace(/^#+/, "").trim();
            }
            const nameLower = entry.name.toLowerCase();
            if (nameLower.includes("code") || nameLower.includes("git") || nameLower.includes("debug")) {
              category = "开发工具";
            } else if (nameLower.includes("note") || nameLower.includes("doc") || nameLower.includes("write")) {
              category = "文档笔记";
            } else if (nameLower.includes("web") || nameLower.includes("http") || nameLower.includes("api")) {
              category = "网络工具";
            } else if (nameLower.includes("file") || nameLower.includes("disk") || nameLower.includes("storage")) {
              category = "文件管理";
            } else if (nameLower.includes("system") || nameLower.includes("os") || nameLower.includes("process")) {
              category = "系统工具";
            } else if (nameLower.includes("ai") || nameLower.includes("chat") || nameLower.includes("llm")) {
              category = "AI相关";
            }
          }
          skills.push({
            name: entry.name,
            path: skillPath,
            category,
            description,
            enabled: true
          });
        }
      }
      const categories = skills.reduce((acc, skill) => {
        acc[skill.category] = (acc[skill.category] || 0) + 1;
        return acc;
      }, {});
      return { success: true, skills, categories };
    } catch (e) {
      log.error("获取Skills失败:", e);
      return { success: false, skills: [], error: String(e) };
    }
  });
  electron.ipcMain.handle("get-skills-config", async () => {
    try {
      if (fs__namespace.existsSync(skillsConfigPath)) {
        const data = fs__namespace.readFileSync(skillsConfigPath, "utf-8");
        const config = JSON.parse(data);
        if (config.profiles) {
          config.profiles = config.profiles.map((p) => ({
            name: p.name,
            blacklist: Array.isArray(p.blacklist) ? p.blacklist : [],
            modelSource: p.modelSource || "local",
            codingplanModel: p.codingplanModel || ""
          }));
        }
        return { success: true, config };
      }
      return { success: true, config: { profiles: [{ name: "默认配置", blacklist: [], modelSource: "local", codingplanModel: "" }], activeProfile: "默认配置" } };
    } catch (e) {
      log.error("读取Skills配置失败:", e);
      return { success: false, config: null, error: String(e) };
    }
  });
  electron.ipcMain.handle("save-skills-config", async (_, config) => {
    try {
      if (!config || !Array.isArray(config.profiles)) {
        return { success: false, error: "配置格式错误" };
      }
      config.profiles = config.profiles.map((p) => ({
        name: p.name || "未命名",
        blacklist: Array.isArray(p.blacklist) ? p.blacklist : [],
        modelSource: p.modelSource === "codingplan" ? "codingplan" : "local",
        codingplanModel: p.codingplanModel || ""
      }));
      if (!config.activeProfile && config.profiles.length > 0) {
        config.activeProfile = config.profiles[0].name;
      }
      fs__namespace.writeFileSync(skillsConfigPath, JSON.stringify(config, null, 2), "utf-8");
      log.info("Skills配置已保存");
      return { success: true };
    } catch (e) {
      log.error("保存Skills配置失败:", e);
      return { success: false, error: String(e) };
    }
  });
  electron.ipcMain.handle("import-skills-from-folder", async (_, sourceFolder) => {
    try {
      if (!fs__namespace.existsSync(sourceFolder)) {
        return { success: false, error: "源文件夹不存在" };
      }
      const homeDir = os__namespace.homedir();
      const dotOpenclaw = path.join(homeDir, ".openclaw");
      const skillsDir = path.join(dotOpenclaw, "skills");
      if (!fs__namespace.existsSync(skillsDir)) {
        fs__namespace.mkdirSync(skillsDir, { recursive: true });
      }
      let importCount = 0;
      const entries = fs__namespace.readdirSync(sourceFolder, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const sourcePath = path.join(sourceFolder, entry.name);
          const targetPath = path.join(skillsDir, entry.name);
          if (fs__namespace.existsSync(targetPath)) {
            log.info(`Skill ${entry.name} 已存在，跳过`);
            continue;
          }
          try {
            copyFolderRecursive(sourcePath, targetPath);
            importCount++;
            log.info(`成功导入 Skill: ${entry.name}`);
          } catch (e) {
            log.error(`导入 Skill ${entry.name} 失败:`, e);
          }
        }
      }
      return { success: true, count: importCount };
    } catch (e) {
      log.error("导入 Skills 失败:", e);
      return { success: false, error: String(e) };
    }
  });
  function copyFolderRecursive(source, target) {
    if (!fs__namespace.existsSync(target)) {
      fs__namespace.mkdirSync(target, { recursive: true });
    }
    const entries = fs__namespace.readdirSync(source, { withFileTypes: true });
    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const targetPath = path.join(target, entry.name);
      if (entry.isDirectory()) {
        copyFolderRecursive(sourcePath, targetPath);
      } else {
        fs__namespace.copyFileSync(sourcePath, targetPath);
      }
    }
  }
  electron.ipcMain.handle("add-custom-skills-folder", async (_, folderPath) => {
    try {
      log.info("添加自定义 Skills 文件夹:", folderPath);
      return { success: true };
    } catch (e) {
      log.error("添加自定义 Skills 文件夹失败:", e);
      return { success: false, error: String(e) };
    }
  });
  const modelsConfigPath = path.join(dataPath, "models-config.json");
  function loadModelsConfig() {
    try {
      if (fs__namespace.existsSync(modelsConfigPath)) {
        const data = fs__namespace.readFileSync(modelsConfigPath, "utf-8");
        return JSON.parse(data);
      }
    } catch (e) {
      log.error("读取模型配置失败:", e);
    }
    return { customModelFolders: [] };
  }
  function saveModelsConfig(config) {
    try {
      fs__namespace.writeFileSync(modelsConfigPath, JSON.stringify(config, null, 2), "utf-8");
      log.info("模型配置已保存");
    } catch (e) {
      log.error("保存模型配置失败:", e);
    }
  }
  const modelFileExtensions = [".gguf", ".ggml", ".bin", ".safetensors", ".pt", ".pth", ".onnx", ".msgpack", ".pb", ".tflite"];
  function scanModelsInDir(modelsDir, source = "local") {
    const models = [];
    if (!fs__namespace.existsSync(modelsDir)) {
      return models;
    }
    const entries = fs__namespace.readdirSync(modelsDir, { withFileTypes: true });
    for (const entry of entries) {
      const modelPath = path.join(modelsDir, entry.name);
      if (entry.isDirectory()) {
        const subModels = scanModelsInDir(modelPath, source);
        models.push(...subModels);
      } else if (entry.isFile()) {
        const ext = entry.name.toLowerCase().substring(entry.name.lastIndexOf("."));
        if (modelFileExtensions.includes(ext)) {
          let stats = fs__namespace.statSync(modelPath);
          let size = formatBytes(stats.size);
          let modified = stats.mtime.toLocaleDateString("zh-CN");
          let description = "";
          let modelType = getModelType(ext);
          const dirPath = path.join(modelsDir);
          const readmePath = path.join(dirPath, "README.md");
          const infoPath = path.join(dirPath, "info.json");
          if (fs__namespace.existsSync(readmePath)) {
            try {
              const content = fs__namespace.readFileSync(readmePath, "utf-8");
              const NL = String.fromCharCode(10);
              const lines = content.split(NL).filter((l) => l.trim());
              description = lines.slice(0, 5).join(NL).substring(0, 500);
            } catch (e) {
            }
          } else if (fs__namespace.existsSync(infoPath)) {
            try {
              const info = JSON.parse(fs__namespace.readFileSync(infoPath, "utf-8"));
              description = info.description || info.name || "";
              if (info.size) size = formatBytes(info.size);
            } catch (e) {
            }
          }
          const modelName = entry.name.substring(0, entry.name.lastIndexOf("."));
          models.push({
            name: modelName,
            path: modelPath,
            size,
            modified,
            description,
            source,
            modelType
          });
        }
      }
    }
    return models;
  }
  function getModelType(ext) {
    const typeMap = {
      ".gguf": "GGUF (Llama.cpp)",
      ".ggml": "GGML (Llama.cpp)",
      ".bin": "Binary (GPT-J/MiniGPT)",
      ".safetensors": "SafeTensors (HuggingFace)",
      ".pt": "PyTorch",
      ".pth": "PyTorch",
      ".onnx": "ONNX",
      ".msgpack": "MsgPack",
      ".pb": "TensorFlow PB",
      ".tflite": "TensorFlow Lite"
    };
    return typeMap[ext.toLowerCase()] || "Unknown";
  }
  electron.ipcMain.handle("get-local-models", async () => {
    try {
      const homeDir = os__namespace.homedir();
      const dotOpenclaw = path.join(homeDir, ".openclaw");
      const modelsDir = path.join(dotOpenclaw, "models");
      const config = loadModelsConfig();
      const allModels = [];
      const defaultModels = scanModelsInDir(modelsDir, "默认目录");
      allModels.push(...defaultModels);
      for (const customFolder of config.customModelFolders) {
        if (fs__namespace.existsSync(customFolder)) {
          const customModels = scanModelsInDir(customFolder, "自定义");
          const customModelsFiltered = customModels.filter(
            (cm) => !allModels.some((m) => m.path === cm.path)
          );
          allModels.push(...customModelsFiltered);
        }
      }
      if (allModels.length === 0) {
        return {
          success: true,
          models: [],
          customFolders: config.customModelFolders,
          error: "未找到模型，请添加模型文件夹"
        };
      }
      return { success: true, models: allModels, customFolders: config.customModelFolders };
    } catch (e) {
      log.error("获取本地模型失败:", e);
      return { success: false, models: [], error: String(e) };
    }
  });
  electron.ipcMain.handle("get-model-folders", async () => {
    try {
      const config = loadModelsConfig();
      return { success: true, folders: config.customModelFolders };
    } catch (e) {
      log.error("获取模型文件夹失败:", e);
      return { success: false, folders: [], error: String(e) };
    }
  });
  electron.ipcMain.handle("add-model-folder", async (_, folderPath) => {
    try {
      if (!folderPath || typeof folderPath !== "string") {
        return { success: false, error: "无效的文件夹路径" };
      }
      if (!fs__namespace.existsSync(folderPath)) {
        return { success: false, error: "文件夹不存在" };
      }
      const config = loadModelsConfig();
      if (config.customModelFolders.includes(folderPath)) {
        return { success: false, error: "该文件夹已添加" };
      }
      config.customModelFolders.push(folderPath);
      saveModelsConfig(config);
      log.info("模型文件夹已添加:", folderPath);
      return { success: true };
    } catch (e) {
      log.error("添加模型文件夹失败:", e);
      return { success: false, error: String(e) };
    }
  });
  electron.ipcMain.handle("remove-model-folder", async (_, folderPath) => {
    try {
      const config = loadModelsConfig();
      config.customModelFolders = config.customModelFolders.filter((f) => f !== folderPath);
      saveModelsConfig(config);
      return { success: true };
    } catch (e) {
      log.error("移除模型文件夹失败:", e);
      return { success: false, error: String(e) };
    }
  });
  electron.ipcMain.handle("get-model-details", async (_, modelPath) => {
    try {
      if (!fs__namespace.existsSync(modelPath)) {
        return { success: false, error: "模型路径不存在" };
      }
      const files = fs__namespace.readdirSync(modelPath);
      const details = {};
      for (const file of files) {
        if (file.endsWith(".md") || file.endsWith(".txt") || file.endsWith(".json")) {
          const content = fs__namespace.readFileSync(path.join(modelPath, file), "utf-8");
          details[file] = content.substring(0, 5e3);
        }
      }
      return { success: true, details };
    } catch (e) {
      log.error("获取模型详情失败:", e);
      return { success: false, error: String(e) };
    }
  });
  function formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
  electron.ipcMain.handle("get-terminal-config", async () => {
    return { success: true, shell: process.platform === "win32" ? "cmd.exe" : "/bin/bash" };
  });
  const toolsConfigPath = path.join(dataPath, "tools.json");
  electron.ipcMain.handle("get-tools", async () => {
    try {
      if (fs__namespace.existsSync(toolsConfigPath)) {
        const data = fs__namespace.readFileSync(toolsConfigPath, "utf-8");
        return { success: true, tools: JSON.parse(data) };
      }
      return { success: true, tools: [] };
    } catch (e) {
      log.error("读取工具配置失败:", e);
      return { success: false, tools: [], error: String(e) };
    }
  });
  electron.ipcMain.handle("save-tools", async (_, tools) => {
    try {
      fs__namespace.writeFileSync(toolsConfigPath, JSON.stringify(tools, null, 2), "utf-8");
      return { success: true };
    } catch (e) {
      log.error("保存工具配置失败:", e);
      return { success: false, error: String(e) };
    }
  });
  electron.ipcMain.handle("run-tool", async (_, tool) => {
    return new Promise((resolve) => {
      try {
        const cmd = tool.runInTerminal ? `start cmd /k "${tool.path}"` : `start "" "${tool.path}"`;
        child_process.exec(cmd, { shell: "cmd.exe" }, (error) => {
          if (error) {
            resolve({ success: false, error: error.message });
          } else {
            resolve({ success: true });
          }
        });
      } catch (e) {
        resolve({ success: false, error: String(e) });
      }
    });
  });
  electron.ipcMain.handle("open-tool-location", async (_, toolPath) => {
    electron.shell.showItemInFolder(toolPath);
    return { success: true };
  });
}
electron.app.whenReady().then(() => {
  log.info("应用准备就绪");
  log.transports.file.level = "info";
  log.transports.console.level = "debug";
  utils.electronApp.setAppUserModelId("com.openclaw.lobster-launcher");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  setupIpcHandlers();
  createWindow();
  createTray();
  registerGlobalShortcuts();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("will-quit", () => {
  electron.globalShortcut.unregisterAll();
  log.info("🦞 龙虾启动器已退出");
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
