<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import HomePage from './components/HomePage.vue'
import UsagePage from './components/UsagePage.vue'
import SettingsPage from './components/SettingsPage.vue'
import SkillsPage from './components/SkillsPage.vue'
import ModelsPage from './components/ModelsPage.vue'
import TerminalPage from './components/TerminalPage.vue'
import ToolsPage from './components/ToolsPage.vue'

// 当前页面
const currentPage = ref('home')

// 页面列表
const pages = [
  { id: 'home', icon: '🏠', label: '首页' },
  { id: 'usage', icon: '📊', label: '使用情况' },
  { id: 'models', icon: '🤖', label: '模型管理' },
  { id: 'skills', icon: '🎯', label: 'Skills设置' },
  { id: 'tools', icon: '🔧', label: '小工具' },
  { id: 'terminal', icon: '💻', label: '终端' },
  { id: 'settings', icon: '⚙️', label: '设置' }
]

// 页面切换
function switchPage(pageId: string) {
  currentPage.value = pageId
}

// 监听托盘事件
onMounted(() => {
  const unsubStart = window.api.onTriggerStartAll(() => {
    // 触发启动所有服务
    window.dispatchEvent(new CustomEvent('start-all-services'))
  })
  
  const unsubStop = window.api.onTriggerStopAll(() => {
    // 触发停止所有服务
    window.dispatchEvent(new CustomEvent('stop-all-services'))
  })
  
  onUnmounted(() => {
    unsubStart()
    unsubStop()
  })
})
</script>

<template>
  <div class="app-container">
    <!-- 动态背景 -->
    <div class="bg-effects">
      <div class="bg-gradient bg-gradient-1"></div>
      <div class="bg-gradient bg-gradient-2"></div>
      <div class="bg-grid"></div>
    </div>
    
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">🦞</span>
          <span class="logo-text">龙虾启动器</span>
        </div>
      </div>
      
      <nav class="nav-menu">
        <div
          v-for="page in pages"
          :key="page.id"
          class="nav-item"
          :class="{ active: currentPage === page.id }"
          @click="switchPage(page.id)"
        >
          <span class="nav-icon">{{ page.icon }}</span>
          <span class="nav-label">{{ page.label }}</span>
        </div>
      </nav>
    </aside>
    
    <!-- 主内容区 -->
    <main class="main-content">
      <div class="content-area">
        <HomePage v-if="currentPage === 'home'" />
        <UsagePage v-else-if="currentPage === 'usage'" />
        <SettingsPage v-else-if="currentPage === 'settings'" />
        <SkillsPage v-else-if="currentPage === 'skills'" />
        <ModelsPage v-else-if="currentPage === 'models'" />
        <TerminalPage v-else-if="currentPage === 'terminal'" />
        <ToolsPage v-else-if="currentPage === 'tools'" />
        <div v-else class="coming-soon">
          <span class="coming-icon">🚧</span>
          <span class="coming-text">{{ pages.find(p => p.id === currentPage)?.label }} - 敬请期待</span>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: var(--spacing-md);
}

.coming-icon {
  font-size: 64px;
  opacity: 0.5;
}

.coming-text {
  font-size: 18px;
  color: var(--color-text-secondary);
}
</style>
