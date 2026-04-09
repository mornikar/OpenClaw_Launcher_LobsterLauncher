# 龙虾启动器 v1.4 更新说明

> 发布日期：2026-04-10

---

## 一、本次更新内容

### 1.1 安装向导智能检测 ⭐ 新功能

**问题背景**：
用户点击"安装向导"按钮时，之前的行为是直接跳转到 OpenClaw 的 Onboard 页面。但如果用户尚未安装 OpenClaw，直接跳转会导致页面无法访问。

**解决方案**：
实现了智能检测机制，在跳转前先检查 OpenClaw 是否已安装：

```
用户点击"安装向导"
       ↓
检测 ~/.openclaw 目录是否存在
       ↓
    ┌───────────┴───────────┐
    ↓                       ↓
  已安装                   未安装
    ↓                       ↓
显示确认对话框             显示安装确认对话框
    ↓                       ↓
打开 Onboard 页面          显示安装进度弹窗
                            自动执行安装流程
                            完成后打开 Onboard
```

**安装流程**：
| 阶段 | 进度 | 说明 |
|------|:----:|------|
| preparing | 10% | 创建安装目录 (~/.openclaw) |
| installing | 30% | 安装 OpenClaw CLI |
| initializing | 60% | 初始化配置 |
| starting | 80% | 启动 Gateway 后台服务 |
| completed | 100% | 安装完成，自动打开 Onboard |

**涉及文件**：
- `src/main/index.ts` - 添加 `install-openclaw` IPC handler
- `src/preload/index.ts` - 暴露 `installOpenClaw` 和 `onOpenClawInstallProgress` API
- `src/renderer/src/components/HomePage.vue` - 安装向导逻辑和 UI

---

### 1.2 Skills 配置删除功能修复 🐛 Bug修复

**问题描述**：
用户无法删除不需要的 Skills 配置，点击删除按钮后显示"删除失败"。

**根本原因**：
`saveConfigWithResult` 函数在保存配置时，没有对响应式代理对象进行 JSON 序列化。Electron 的 IPC 通信无法正确传输 Vue 响应式代理对象。

**修复方案**：
在保存配置前，使用 `JSON.parse(JSON.stringify())` 将响应式对象转换为纯 JavaScript 对象：

```typescript
async function saveConfigWithResult(): Promise<boolean> {
  try {
    // 使用 JSON 序列化确保数据是纯对象（移除响应式代理）
    const configToSave = JSON.parse(JSON.stringify(skillsConfig.value))
    const result = await window.api.saveSkillsConfig(configToSave)
    return result && result.success
  } catch (e) {
    console.error('保存配置失败:', e)
    return false
  }
}
```

**涉及文件**：
- `src/renderer/src/components/SkillsPage.vue` - `saveConfig` 和 `saveConfigWithResult` 函数

---

### 1.3 通用确认对话框组件 ✨ 增强

**新增功能**：
为了支持安装向导的交互逻辑，新增了通用的确认对话框组件。

**组件结构**：
```vue
<!-- 确认对话框 -->
<div v-if="confirmDialog.show" class="modal-overlay" @click="closeConfirmDialog">
  <div class="modal confirm-modal" @click.stop>
    <div class="modal-header">
      <h3>{{ confirmDialog.title }}</h3>
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
```

**使用方式**：
```typescript
confirmDialog.value = {
  show: true,
  title: '操作标题',
  message: '操作说明文本',
  onConfirm: () => {
    // 确认后的回调逻辑
    confirmDialog.value.show = false
  }
}
```

---

### 1.4 安装进度弹窗 ✨ 增强

**功能说明**：
在安装 OpenClaw 时显示实时进度，让用户了解安装状态。

**UI 效果**：
```
┌────────────────────────────────┐
│   🚀 安装 OpenClaw             │
├────────────────────────────────┤
│                                │
│    正在安装 OpenClaw CLI...    │
│    ████████████░░░░░  60%      │
│                                │
└────────────────────────────────┘
```

**进度条样式**：
- 背景：深色半透明
- 前景：渐变色 (#00D4FF → #10b981)
- 动画：平滑过渡 (transition: width 0.3s ease)

---

## 二、技术实现细节

### 2.1 IPC 通信架构

```
┌─────────────────────────────────────────────────────────┐
│                   Renderer Process                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │  HomePage.vue                                    │   │
│  │  - handleOnboard()     // 检测逻辑              │   │
│  │  - startOpenClawInstall() // 安装逻辑            │   │
│  └──────────────────────┬──────────────────────────┘   │
│                         │ IPC Invoke                    │
└─────────────────────────┼───────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Preload Bridge                        │
│  - installOpenClaw()                                    │
│  - onOpenClawInstallProgress(callback)                  │
└─────────────────────────┬───────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Main Process                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  index.ts                                       │   │
│  │  - 'install-openclaw' handler                   │   │
│  │  - 发送 'openclaw-install-progress' 事件        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 2.2 关键代码片段

**Main Process - 安装 handler**：
```typescript
ipcMain.handle('install-openclaw', async (event) => {
  const installDir = join(os.homedir(), '.openclaw')
  
  // 发送进度更新
  const sendProgress = (stage: string, progress: number, message: string) => {
    event.sender.send('openclaw-install-progress', { stage, progress, message })
  }
  
  // 1. 创建目录
  sendProgress('preparing', 10, '正在创建安装目录...')
  fs.mkdirSync(installDir, { recursive: true })
  
  // 2. 安装 CLI
  sendProgress('installing', 30, '正在安装 OpenClaw CLI...')
  await execPromise('npm install -g openclaw')
  
  // 3. 初始化
  sendProgress('initializing', 60, '正在初始化...')
  
  // 4. 启动 Gateway
  sendProgress('starting', 80, '正在启动 Gateway...')
  // ...
  
  sendProgress('completed', 100, '安装完成！')
  return { success: true, path: installDir }
})
```

**Renderer - 监听进度**：
```typescript
const removeListener = window.api.onOpenClawInstallProgress((data) => {
  openclawInstallModal.value.progress = data.progress
  openclawInstallModal.value.stage = data.stage
  openclawInstallModal.value.message = data.message
})
```

---

## 三、用户体验优化

### 3.1 交互流程优化

| 场景 | 之前 | 现在 |
|------|------|------|
| 点击安装向导（已安装） | 直接跳转 | 显示确认对话框，确认后跳转 |
| 点击安装向导（未安装） | 页面无法访问 | 显示安装确认，确认后自动安装并跳转 |
| 删除 Skills 配置 | 失败 | 成功删除 |

### 3.2 视觉反馈

- **确认对话框**：清晰的标题和操作说明
- **进度条**：实时百分比 + 渐变动画
- **按钮状态**：hover 缩放效果

---

## 四、待优化项

### 4.1 后续计划

- [ ] 安装命令的详细错误处理和重试机制
- [ ] 支持安装失败后的手动修复选项
- [ ] 检测 OpenClaw CLI 是否真正可用（而不只是目录存在）
- [ ] Gateway 端口占用时的自动处理
- [ ] 安装过程中的取消选项

### 4.2 可能的改进

- [ ] 使用更可靠的安装源（如 npx openclaw@latest）
- [ ] 添加安装日志查看功能
- [ ] 支持自定义安装路径
- [ ] 检测并提示安装 Node.js 环境

---

## 五、测试清单

### 5.1 安装向导测试

- [ ] **场景1**：删除 ~/.openclaw 目录后，点击安装向导
  - [ ] 显示"检测到本地未安装 OpenClaw"对话框
  - [ ] 点击"确定"后显示安装进度弹窗
  - [ ] 安装完成后自动打开 Onboard 页面

- [ ] **场景2**：~/.openclaw 目录存在时，点击安装向导
  - [ ] 显示"是否打开安装向导？"对话框
  - [ ] 点击"确定"后直接打开 Onboard 页面

- [ ] **场景3**：取消安装
  - [ ] 点击"取消"按钮，弹窗关闭，无任何操作

### 5.2 Skills 配置测试

- [ ] **场景1**：新建配置后删除
  - [ ] 删除按钮正常显示
  - [ ] 点击删除后配置被移除
  - [ ] 配置正确保存到文件

- [ ] **场景2**：只剩一个配置时
  - [ ] 删除按钮隐藏（防止误删最后一个配置）

---

## 六、版本历史

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v1.4 | 2026-04-10 | 安装向导智能检测、Skills删除修复、确认对话框组件 |
| v1.3 | 2026-04-09 | Skills 黑白名单管理、模型管理、终端集成 |
| v1.2 | 2026-04-09 | 服务管理、本地APP启动控制 |
| v1.1 | 2026-04-08 | 首页布局、凭证信息、文件快速访问 |
| v1.0 | 2026-04-07 | 项目初始化、基础架构搭建 |

---

*文档版本：v1.4 | 更新于 2026-04-10*
