# 🦞 LobsterLauncher - 龙虾启动器

> A powerful desktop launcher for OpenClaw users | 专为 OpenClaw 用户打造的桌面启动器

[English](#english) / [中文](#中文)

---

## 📺 Preview | 预览

<div align="center">
  <img src=".github/preview.png" alt="LobsterLauncher Preview" width="800"/>
</div>

---

## 🌟 Features | 功能特点

### 🏠 Dashboard | 首页面板
- **Smart Detection** - Automatically detect OpenClaw installation paths
- **Credential Management** - One-click copy Gateway URL, Token, and Password
- **Quick Access** - Fast access to important files and folders
- **智能检测** - 自动检测 OpenClaw 安装路径
- **凭证管理** - 一键复制 Gateway URL、Token 和密码
- **快捷访问** - 快速访问重要文件和文件夹

### ⚡ Service Management | 服务管理
- **Gateway Control** - Start/Stop OpenClaw Gateway with one click
- **Local Model Services** - Manage LM Studio, Ollama, and other local AI services
- **Batch Operations** - Start/Stop all services at once
- **Gateway 控制** - 一键启动/停止 OpenClaw Gateway
- **本地模型服务** - 管理 LM Studio、Ollama 等本地 AI 服务
- **批量操作** - 一键启动/停止所有服务

### 🎯 Skills Manager | Skills 管理
- **Profile Management** - Create, edit, delete Skills configurations
- **Quick Switch** - One-click switch between different profiles (Cloud/Local)
- **Blacklist/Whitelist** - Fine-grained control over Skills enable/disable
- **配置管理** - 创建、编辑、删除 Skills 配置方案
- **快速切换** - 一键切换不同配置方案（联网模式/本地模式）
- **黑名单/白名单** - 精细化控制 Skills 启用/禁用

### 🚀 Installation Wizard | 安装向导
- **Smart Detection** - Check OpenClaw installation status automatically
- **One-Click Install** - Automatically install OpenClaw and dependencies
- **Progress Display** - Real-time installation progress feedback
- **智能检测** - 自动检测 OpenClaw 安装状态
- **一键安装** - 自动安装 OpenClaw 及其依赖
- **进度展示** - 实时显示安装进度

### 📊 Usage Analytics | 使用统计
- **API Usage** - Track token consumption and API calls
- **Local Resources** - Monitor CPU, Memory, GPU usage
- **API 用量** - 追踪 Token 消耗和 API 调用
- **本地资源** - 监控 CPU、内存、GPU 使用情况

---

## 📥 Download | 下载方式

### 🟢 Latest Release (Recommended) | 最新版本（推荐）

| Platform | Download | Size |
|----------|----------|------|
| Windows | [LobsterLauncher Setup.exe](https://github.com/YOUR_USERNAME/OpenClaw_Launcher_LobsterLauncher/releases/latest/download/LobsterLauncher-Setup.exe) | ~180MB |
| Windows (Portable) | [LobsterLauncher-Portable.zip](https://github.com/YOUR_USERNAME/OpenClaw_Launcher_LobsterLauncher/releases/latest/download/LobsterLauncher-Portable.zip) | ~180MB |

### 🔧 Clone Repository | 克隆仓库

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/OpenClaw_Launcher_LobsterLauncher.git

# Enter the project directory
cd OpenClaw_Launcher_LobsterLauncher

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

### 📦 Download Source Code | 下载源码

| Format | Download |
|--------|----------|
| ZIP | [Source Code (ZIP)](https://github.com/YOUR_USERNAME/OpenClaw_Launcher_LobsterLauncher/archive/refs/heads/main.zip) |
| TAR.GZ | [Source Code (TAR.GZ)](https://github.com/YOUR_USERNAME/OpenClaw_Launcher_LobsterLauncher/archive/refs/heads/main.tar.gz) |

### 🐳 Build from Source | 从源码构建

```bash
# Prerequisites | 前置条件
# - Node.js >= 18
# - npm >= 9
# - Git

# Step 1 | 步骤1: Clone the repo
git clone https://github.com/YOUR_USERNAME/OpenClaw_Launcher_LobsterLauncher.git
cd OpenClaw_Launcher_LobsterLauncher

# Step 2 | 步骤2: Install dependencies
npm install

# Step 3 | 步骤3: Start development
npm run dev

# Step 4 | 步骤4: Build for Windows
npm run build
npx electron-builder --win
```

---

## 🛠️ Tech Stack | 技术栈

| Category | Technology |
|----------|------------|
| Framework | Electron |
| Frontend | Vue 3 + Vite |
| UI | Custom Sci-Fi Theme + Glassmorphism |
| Terminal | node-pty + xterm.js |
| System Monitor | systeminformation |
| Storage | electron-store |
| Build | electron-builder |

---

## 📁 Project Structure | 项目结构

```
OpenClaw_Launcher_LobsterLauncher/
├── src/
│   ├── main/                 # Electron Main Process
│   │   └── index.ts         # Main entry
│   ├── preload/              # Preload Scripts
│   │   └── index.ts         # IPC Bridge
│   └── renderer/            # Vue Frontend
│       ├── src/
│       │   ├── components/  # Vue Components
│       │   ├── pages/       # Page Components
│       │   ├── assets/      # Styles & Assets
│       │   └── main.ts      # Frontend Entry
│       └── index.html        # HTML Template
├── data/                     # Application Data
├── SPEC.md                   # Feature Specification
├── CHANGELOG.md              # Version History
└── README.md                 # This File
```

---

## 🎯 Usage Guide | 使用指南

### First Launch | 首次启动

1. Download and run the installer
2. The app will automatically detect OpenClaw installation
3. Configure your Gateway URL and Token
4. Start using!

### Skills Management | Skills 管理

1. Go to **Skills** page
2. Create or select a profile
3. Configure blacklist/whitelist
4. Click **应用配置** to apply changes

### Service Management | 服务管理

1. Go to **Home** page
2. Find **服务管理** section
3. Right-click on a service for options
4. Or use **⚡全部启动** / **⏹全部停止** buttons

---

## 🔧 Configuration | 配置说明

### Data Storage | 数据存储

```
Windows: %APPDATA%/LobsterLauncher/
├── config.json          # App configuration
├── services.json        # Service configurations
├── skills-config.json   # Skills configurations
└── models-config.json   # Model configurations
```

### OpenClaw Path Detection | OpenClaw 路径检测

The app will automatically search for OpenClaw in:
1. `%OPENCLAW_HOME%` environment variable
2. `%USERPROFILE%\.openclaw`
3. `%APPDATA%\openclaw`
4. `%LOCALAPPDATA%\openclaw`
5. `C:\Program Files\OpenClaw`
6. `D:\Program Files\OpenClaw`

---

## 🤝 Contributing | 贡献指南

Issues and Pull Requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License | 许可证

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments | 致谢

- [OpenClaw](https://openclaw.ai) - The amazing AI agent platform
- [Electron](https://electronjs.org) - Cross-platform desktop framework
- [Vue.js](https://vuejs.org) - The progressive JavaScript framework

---

<div align="center">

**Made with ❤️ for OpenClaw users**

**为 OpenClaw 用户用心打造**

</div>

---

# English

## What is LobsterLauncher?

**LobsterLauncher** (龙虾启动器) is a powerful desktop management tool designed specifically for OpenClaw users. It provides a one-stop experience including:

- 🔑 Credential Management
- 📁 File Quick Access
- ⚡ Service Control
- 🎯 Skills Configuration
- 📊 Usage Analytics

## Why LobsterLauncher?

- **All-in-One**: No more switching between multiple tools
- **Smart Detection**: Automatically detect OpenClaw installation
- **Beautiful UI**: Modern sci-fi theme with glassmorphism
- **Cross-Platform**: Windows support (macOS/Linux coming soon)

## Getting Started

See [Download](#-download--下载方式) section above for installation options.

For development:
```bash
npm install
npm run dev
```

---

# 中文

## 龙虾启动器是什么？

**龙虾启动器** (LobsterLauncher) 是一款专为 OpenClaw 用户打造的桌面管理工具，提供：

- 🔑 凭证管理
- 📁 文件快速访问
- ⚡ 服务控制
- 🎯 Skills 配置
- 📊 使用统计

## 为什么选择龙虾启动器？

- **一站式**：无需在多个工具间切换
- **智能检测**：自动检测 OpenClaw 安装状态
- **美观界面**：现代科技风格 + 玻璃态设计
- **跨平台**：支持 Windows（macOS/Linux 即将支持）

## 快速开始

安装方式详见上方 [下载方式](#-download--下载方式) 部分。

开发调试：
```bash
npm install
npm run dev
```
