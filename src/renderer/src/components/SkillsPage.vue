<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// Skills列表
const allSkills = ref<Array<{
  name: string
  path: string
  category: string
  description: string
  enabled: boolean
}>>([])

// 分类统计
const categories = ref<Record<string, number>>({})

// Skills配置 - 改版：只有黑名单和模型选择
const skillsConfig = ref<{
  profiles: Array<{
    name: string
    blacklist: string[]
    modelSource: 'local' | 'codingplan'
    codingplanModel?: string
  }>
  activeProfile: string
}>({
  profiles: [],
  activeProfile: 'default'
})

// 当前编辑状态
const currentProfile = ref({
  name: '默认配置',
  blacklist: [] as string[],
  modelSource: 'local' as 'local' | 'codingplan',
  codingplanModel: ''
})

// 选中的分类
const selectedCategory = ref<string | null>(null)

// 选中的Skill
const selectedSkills = ref<string[]>([])

// 列表类型 - 改为只有黑名单和模型
const listType = ref<'blacklist' | 'codingplan'>('blacklist')

// 自定义 Skills 文件夹列表
const customSkillsFolders = ref<string[]>([])

// 导入弹窗
const importModal = ref({
  show: false,
  sourceFolder: ''
})

// 加载状态
const loading = ref(false)

// 提示消息
const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' })

// 显示提示
function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// 分类列表
const categoryList = computed(() => {
  return Object.entries(categories.value).map(([name, count]) => ({
    name,
    count
  }))
})

// 过滤后的Skills
const filteredSkills = computed(() => {
  if (!selectedCategory.value) {
    return allSkills.value
  }
  return allSkills.value.filter(s => s.category === selectedCategory.value)
})

// 当前列表项
const currentList = computed(() => {
  if (listType.value === 'blacklist') {
    return currentProfile.value.blacklist
  } else {
    return currentProfile.value.codingplanModel ? [currentProfile.value.codingplanModel] : []
  }
})

// 加载数据
async function loadData() {
  loading.value = true
  try {
    // 加载所有Skills
    const skillsResult = await window.api.getAllSkills()
    if (skillsResult.success) {
      allSkills.value = skillsResult.skills
      categories.value = skillsResult.categories || {}
    }
    
    // 加载配置
    const configResult = await window.api.getSkillsConfig()
    if (configResult.success && configResult.config) {
      skillsConfig.value = configResult.config
      
      // 设置当前编辑的配置
      const active = skillsConfig.value.profiles.find(p => p.name === skillsConfig.value.activeProfile)
      if (active) {
        currentProfile.value = { 
          name: active.name,
          blacklist: active.blacklist || [],
          modelSource: active.modelSource || 'local',
          codingplanModel: active.codingplanModel || ''
        }
      }
    } else {
      // 初始化默认配置
      skillsConfig.value = {
        profiles: [{
          name: '默认配置',
          blacklist: [],
          modelSource: 'local',
          codingplanModel: ''
        }],
        activeProfile: '默认配置'
      }
      currentProfile.value = {
        name: '默认配置',
        blacklist: [],
        modelSource: 'local',
        codingplanModel: ''
      }
      await saveConfig()
    }
  } catch (e) {
    console.error('加载Skills数据失败:', e)
    showToast('加载数据失败', 'error')
  } finally {
    loading.value = false
  }
}

// 选择分类
function selectCategory(category: string | null) {
  selectedCategory.value = category
  selectedSkills.value = []
}

// 添加到黑名单
function addToBlacklist() {
  if (selectedSkills.value.length === 0) return
  
  for (const skillName of selectedSkills.value) {
    if (!currentProfile.value.blacklist.includes(skillName)) {
      currentProfile.value.blacklist.push(skillName)
    }
  }
  
  selectedSkills.value = []
  showToast(`已添加 ${selectedSkills.value.length || 0} 个 Skills 到黑名单`)
}

// 从列表移除
function removeFromBlacklist(index: number) {
  currentProfile.value.blacklist.splice(index, 1)
}

// 切换选中
function toggleSkill(name: string) {
  const index = selectedSkills.value.indexOf(name)
  if (index === -1) {
    selectedSkills.value.push(name)
  } else {
    selectedSkills.value.splice(index, 1)
  }
}

// 新建配置
function createNewProfile() {
  const newProfile = {
    name: `配置${skillsConfig.value.profiles.length + 1}`,
    blacklist: [],
    modelSource: 'local' as const,
    codingplanModel: ''
  }
  skillsConfig.value.profiles.push(newProfile)
  currentProfile.value = { ...newProfile }
  skillsConfig.value.activeProfile = newProfile.name
  saveConfig()
  showToast('已创建新配置')
}

// 切换配置
function switchProfile(name: string) {
  const profile = skillsConfig.value.profiles.find(p => p.name === name)
  if (profile) {
    currentProfile.value = { 
      name: profile.name,
      blacklist: profile.blacklist || [],
      modelSource: profile.modelSource || 'local',
      codingplanModel: profile.codingplanModel || ''
    }
    skillsConfig.value.activeProfile = name
    saveConfig()
  }
}

// 保存配置
async function saveConfig() {
  try {
    // 更新profiles中的当前配置
    const index = skillsConfig.value.profiles.findIndex(p => p.name === currentProfile.value.name)
    if (index !== -1) {
      skillsConfig.value.profiles[index] = { ...currentProfile.value }
    } else {
      skillsConfig.value.profiles.push({ ...currentProfile.value })
    }
    
    // 使用 JSON.parse/JSON.stringify 确保数据是纯对象（移除响应式代理）
    const configToSave = JSON.parse(JSON.stringify(skillsConfig.value))
    
    const result = await window.api.saveSkillsConfig(configToSave)
    if (result && result.success) {
      showToast('配置已保存')
    } else {
      showToast(result?.error || '保存失败', 'error')
    }
  } catch (e) {
    console.error('保存配置失败:', e)
    showToast('保存失败', 'error')
  }
}

// 删除配置
function deleteProfile(name: string) {
  if (skillsConfig.value.profiles.length <= 1) {
    showToast('至少保留一个配置', 'error')
    return
  }
  
  const index = skillsConfig.value.profiles.findIndex(p => p.name === name)
  if (index !== -1) {
    const deletedProfile = skillsConfig.value.profiles[index]
    skillsConfig.value.profiles.splice(index, 1)
    
    if (skillsConfig.value.activeProfile === name) {
      skillsConfig.value.activeProfile = skillsConfig.value.profiles[0].name
      currentProfile.value = { ...skillsConfig.value.profiles[0] }
    }
    
    // 保存并检查结果
    saveConfigWithResult().then(success => {
      if (success) {
        showToast(`「${deletedProfile.name}」已删除`)
      } else {
        // 恢复数据
        skillsConfig.value.profiles.splice(index, 0, deletedProfile)
        if (skillsConfig.value.activeProfile !== name) {
          skillsConfig.value.activeProfile = name
          currentProfile.value = { ...deletedProfile }
        }
        showToast('删除失败', 'error')
      }
    })
  }
}

// 保存配置并返回结果
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

// 设为当前配置
function setAsActive(name: string) {
  skillsConfig.value.activeProfile = name
  saveConfig()
  showToast(`已将「${name}」设为当前配置`)
}

// 编辑配置名称
const editingProfileName = ref<string | null>(null)
const newProfileName = ref('')

function startEditProfileName(name: string) {
  editingProfileName.value = name
  newProfileName.value = name
}

function finishEditProfileName() {
  if (editingProfileName.value && newProfileName.value.trim()) {
    const profile = skillsConfig.value.profiles.find(p => p.name === editingProfileName.value)
    if (profile) {
      const oldName = profile.name
      profile.name = newProfileName.value.trim()
      
      // 如果是当前激活的配置，也更新activeProfile
      if (skillsConfig.value.activeProfile === oldName) {
        skillsConfig.value.activeProfile = profile.name
      }
      
      // 更新currentProfile
      if (currentProfile.value.name === oldName) {
        currentProfile.value.name = profile.name
      }
      
      saveConfig()
      showToast('配置名称已修改')
    }
  }
  editingProfileName.value = null
}

// 打开导入文件夹弹窗
function showImportModal() {
  importModal.value.show = true
  importModal.value.sourceFolder = ''
}

// 选择要导入的文件夹
async function selectImportFolder() {
  const path = await window.api.selectFolder()
  if (path) {
    importModal.value.sourceFolder = path
  }
}

// 导入 Skills 从选择的文件夹
async function importSkillsFromFolder() {
  if (!importModal.value.sourceFolder) {
    showToast('请选择要导入的文件夹', 'error')
    return
  }
  
  try {
    const result = await window.api.importSkillsFromFolder(importModal.value.sourceFolder)
    if (result.success) {
      showToast(`成功导入 ${result.count || 0} 个 Skills`)
      importModal.value.show = false
      await loadData()
    } else {
      showToast(result.error || '导入失败', 'error')
    }
  } catch (e) {
    console.error('导入 Skills 失败:', e)
    showToast('导入失败，请重试', 'error')
  }
}

// 添加自定义 Skills 文件夹
async function addCustomSkillsFolder() {
  const path = await window.api.selectFolder()
  if (path) {
    try {
      const result = await window.api.addCustomSkillsFolder(path)
      if (result.success) {
        customSkillsFolders.value.push(path)
        showToast('已添加自定义文件夹')
      } else {
        showToast('添加失败', 'error')
      }
    } catch (e) {
      console.error('添加自定义文件夹失败:', e)
      showToast('添加失败', 'error')
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="skills-page">
    <!-- 顶部提示 -->
    <div v-if="toast.show" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>
    
    <div class="page-header">
      <div class="header-left">
        <h2>🎯 Skills 设置</h2>
        <p class="subtitle">管理 Skills 黑名单和模型来源配置</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" @click="showImportModal">
          📥 导入 Skills
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      <span>加载中...</span>
    </div>
    
    <div v-else class="skills-container">
      <!-- 左侧：所有Skills -->
      <div class="all-skills-panel">
        <div class="panel-header">
          <h3>📦 All Skills</h3>
          <span class="count">{{ allSkills.length }} 个</span>
        </div>
        
        <!-- 分类筛选 -->
        <div class="category-tabs">
          <button 
            class="tab-btn"
            :class="{ active: !selectedCategory }"
            @click="selectCategory(null)"
          >
            全部
          </button>
          <button 
            v-for="cat in categoryList" 
            :key="cat.name"
            class="tab-btn"
            :class="{ active: selectedCategory === cat.name }"
            @click="selectCategory(cat.name)"
          >
            {{ cat.name }} ({{ cat.count }})
          </button>
        </div>
        
        <!-- Skills列表 -->
        <div class="skills-list">
          <div 
            v-for="skill in filteredSkills" 
            :key="skill.name"
            class="skill-item"
            :class="{ 
              selected: selectedSkills.includes(skill.name),
              blacklisted: currentProfile.blacklist.includes(skill.name)
            }"
            @click="toggleSkill(skill.name)"
          >
            <div class="skill-icon">🔧</div>
            <div class="skill-info">
              <div class="skill-name">{{ skill.name }}</div>
              <div class="skill-category">{{ skill.category }}</div>
              <div v-if="skill.description" class="skill-desc">{{ skill.description }}</div>
            </div>
            <div class="skill-badges">
              <span v-if="selectedSkills.includes(skill.name)" class="check-mark">✓</span>
              <span v-if="currentProfile.blacklist.includes(skill.name)" class="badge-blacklist">🚫</span>
            </div>
          </div>
          
          <div v-if="filteredSkills.length === 0" class="empty-state">
            <span>😶 未找到 Skills</span>
            <p>请确保已安装 OpenClaw 并配置 Skills 目录</p>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="action-bar">
          <button class="btn btn-danger" @click="addToBlacklist" :disabled="selectedSkills.length === 0">
            🚫 添加到黑名单
          </button>
        </div>
      </div>
      
      <!-- 中间：配置面板 -->
      <div class="config-center-panel">
        <!-- 模型来源选择 -->
        <div class="model-source-section">
          <div class="section-title">
            <span>🤖 模型来源</span>
          </div>
          <div class="model-source-options">
            <label class="radio-option" :class="{ active: currentProfile.modelSource === 'local' }">
              <input 
                type="radio" 
                v-model="currentProfile.modelSource" 
                value="local"
                @change="saveConfig"
              />
              <span class="radio-label">
                <span class="radio-icon">💻</span>
                <span class="radio-text">本地模型</span>
              </span>
            </label>
            <label class="radio-option" :class="{ active: currentProfile.modelSource === 'codingplan' }">
              <input 
                type="radio" 
                v-model="currentProfile.modelSource" 
                value="codingplan"
                @change="saveConfig"
              />
              <span class="radio-label">
                <span class="radio-icon">☁️</span>
                <span class="radio-text">CodingPlan 模型</span>
              </span>
            </label>
          </div>
          
          <!-- CodingPlan 模型输入 -->
          <div v-if="currentProfile.modelSource === 'codingplan'" class="codingplan-input">
            <input 
              type="text"
              v-model="currentProfile.codingplanModel"
              placeholder="输入 CodingPlan 模型名称"
              class="input"
            />
          </div>
        </div>
        
        <!-- 黑名单列表 -->
        <div class="blacklist-section">
          <div class="section-title">
            <span>🚫 黑名单</span>
            <span class="count-badge">{{ currentProfile.blacklist.length }} 个</span>
          </div>
          
          <div class="blacklist-content">
            <div 
              v-for="(skillName, index) in currentProfile.blacklist" 
              :key="skillName"
              class="blacklist-item"
            >
              <span class="item-icon">🚫</span>
              <span class="item-name">{{ skillName }}</span>
              <button class="btn-icon" @click="removeFromBlacklist(index)" title="移除">✕</button>
            </div>
            
            <div v-if="currentProfile.blacklist.length === 0" class="empty-state small">
              <span>黑名单为空</span>
              <p>从左侧选择 Skills 添加到黑名单</p>
            </div>
          </div>
        </div>
        
        <!-- 保存按钮 -->
        <div class="action-bar">
          <button class="btn btn-success full-width" @click="saveConfig">
            💾 保存配置
          </button>
        </div>
      </div>
      
      <!-- 右侧：配置管理 -->
      <div class="config-panel">
        <div class="panel-header">
          <h3>⚙️ 配置管理</h3>
        </div>
        
        <div class="config-content">
          <!-- 当前配置名 -->
          <div class="config-item">
            <label>当前配置</label>
            <div v-if="editingProfileName === currentProfile.name" class="edit-name">
              <input 
                v-model="newProfileName" 
                type="text" 
                class="input"
                @keyup.enter="finishEditProfileName"
                @keyup.escape="editingProfileName = null"
              />
              <button class="btn-icon" @click="finishEditProfileName">✓</button>
            </div>
            <div v-else class="profile-name-display" @dblclick="startEditProfileName(currentProfile.name)">
              <span class="current-name">{{ currentProfile.name }}</span>
              <span v-if="skillsConfig.activeProfile === currentProfile.name" class="active-badge">当前</span>
              <button class="btn-icon" @click="startEditProfileName(currentProfile.name)">✏️</button>
            </div>
          </div>
          
          <!-- 配置列表 -->
          <div class="profile-list">
            <div 
              v-for="profile in skillsConfig.profiles" 
              :key="profile.name"
              class="profile-item"
              :class="{ active: skillsConfig.activeProfile === profile.name }"
            >
              <div class="profile-info" @click="switchProfile(profile.name)">
                <span class="profile-name">{{ profile.name }}</span>
                <span class="profile-source">{{ profile.modelSource === 'local' ? '💻 本地' : '☁️ CodingPlan' }}</span>
              </div>
              <div class="profile-actions">
                <button 
                  v-if="skillsConfig.activeProfile !== profile.name"
                  class="btn-icon small"
                  @click.stop="setAsActive(profile.name)"
                  title="设为当前配置"
                >
                  ⭐
                </button>
                <button 
                  v-if="skillsConfig.profiles.length > 1" 
                  class="btn-icon small danger"
                  @click.stop="deleteProfile(profile.name)"
                  title="删除"
                >
                  🗑
                </button>
              </div>
            </div>
          </div>
          
          <button class="btn btn-secondary full-width" @click="createNewProfile">
            ➕ 新建配置
          </button>
          
          <!-- 使用说明 -->
          <div class="help-section">
            <h4>💡 使用说明</h4>
            <ul>
              <li>黑名单中的 Skills 将不会被加载</li>
              <li>选择本地模型使用本地部署的模型</li>
              <li>选择 CodingPlan 使用云端模型 API</li>
              <li>双击配置名称可进行重命名</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 导入 Skills 弹窗 -->
    <div v-if="importModal.show" class="modal-overlay" @click="importModal.show = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>📥 导入 Skills</h3>
          <button class="close-btn" @click="importModal.show = false">✕</button>
        </div>
        <div class="modal-body">
          <p class="import-tip">选择包含 Skills 的文件夹（每个 Skill 需要是一个独立的子目录）</p>
          <div class="form-group">
            <label>文件夹路径</label>
            <div class="input-with-btn">
              <input 
                type="text" 
                v-model="importModal.sourceFolder" 
                placeholder="选择要导入的文件夹"
                class="form-input"
                readonly
              />
              <button class="btn btn-secondary" @click="selectImportFolder">📂 浏览</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="importModal.show = false">取消</button>
          <button class="btn btn-primary" @click="importSkillsFromFolder" :disabled="!importModal.sourceFolder">
            开始导入
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skills-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
  position: relative;
}

/* Toast 提示 */
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  z-index: 2000;
  animation: slideDown 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.toast.success {
  background: #10b981;
  color: white;
}

.toast.error {
  background: #ef4444;
  color: white;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.page-header {
  margin-bottom: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  font-size: 24px;
  margin-bottom: var(--spacing-xs);
}

.subtitle {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
}

.skills-container {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 320px 280px;
  gap: var(--spacing-md);
  min-height: 0;
}

.all-skills-panel,
.config-center-panel,
.config-panel {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-header h3 {
  font-size: 16px;
  margin: 0;
}

.count {
  font-size: 12px;
  color: var(--color-text-secondary);
  background: var(--color-bg-tertiary);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.tab-btn {
  padding: 4px 12px;
  font-size: 12px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: var(--color-bg-tertiary);
}

.tab-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.skills-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-sm);
}

.skill-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.skill-item:hover {
  background: var(--color-bg-tertiary);
}

.skill-item.selected {
  background: rgba(0, 212, 255, 0.1);
  border-color: var(--color-primary);
}

.skill-item.blacklisted {
  opacity: 0.5;
}

.skill-item.blacklisted:hover {
  opacity: 0.8;
}

.skill-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.skill-info {
  flex: 1;
  min-width: 0;
}

.skill-name {
  font-weight: 500;
  margin-bottom: 2px;
}

.skill-category {
  font-size: 11px;
  color: var(--color-primary);
  margin-bottom: 4px;
}

.skill-desc {
  font-size: 12px;
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.skill-badges {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.check-mark {
  color: var(--color-primary);
  font-size: 18px;
  font-weight: bold;
}

.badge-blacklist {
  font-size: 14px;
}

/* 中间配置面板 */
.config-center-panel {
  overflow-y: auto;
}

.section-title {
  font-size: 13px;
  color: var(--color-text-secondary);
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
}

.count-badge {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 11px;
}

/* 模型来源选择 */
.model-source-section {
  border-bottom: 1px solid var(--color-border);
}

.model-source-options {
  display: flex;
  gap: var(--spacing-sm);
  padding: 0 var(--spacing-md) var(--spacing-md);
}

.radio-option {
  flex: 1;
  cursor: pointer;
}

.radio-option input {
  display: none;
}

.radio-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.radio-option.active .radio-label {
  border-color: var(--color-primary);
  background: rgba(0, 212, 255, 0.1);
}

.radio-icon {
  font-size: 24px;
}

.radio-text {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.radio-option.active .radio-text {
  color: var(--color-primary);
}

.codingplan-input {
  padding: 0 var(--spacing-md) var(--spacing-md);
}

.codingplan-input .input {
  width: 100%;
  padding: var(--spacing-sm);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 13px;
}

.codingplan-input .input:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* 黑名单区域 */
.blacklist-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.blacklist-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-sm);
}

.blacklist-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  background: rgba(239, 68, 68, 0.1);
  margin-bottom: var(--spacing-xs);
}

.item-icon {
  font-size: 14px;
}

.item-name {
  flex: 1;
  font-size: 13px;
  color: #ef4444;
}

/* 右侧配置面板 */
.config-content {
  flex: 1;
  padding: var(--spacing-md);
  overflow-y: auto;
}

.config-item {
  margin-bottom: var(--spacing-md);
}

.config-item label {
  display: block;
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.profile-name-display {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.profile-name-display:hover {
  background: var(--color-bg-secondary);
}

.current-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.active-badge {
  font-size: 10px;
  background: var(--color-primary);
  color: white;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.edit-name {
  display: flex;
  gap: var(--spacing-xs);
}

.edit-name .input {
  flex: 1;
  padding: var(--spacing-sm);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-size: 13px;
}

.profile-list {
  margin-bottom: var(--spacing-md);
}

.profile-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: var(--spacing-xs);
  border: 1px solid transparent;
}

.profile-item:hover {
  background: var(--color-bg-tertiary);
}

.profile-item.active {
  background: rgba(0, 212, 255, 0.1);
  border-color: var(--color-primary);
}

.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.profile-name {
  font-size: 13px;
  font-weight: 500;
}

.profile-source {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.profile-actions {
  display: flex;
  gap: 4px;
}

/* 帮助说明 */
.help-section {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
}

.help-section h4 {
  font-size: 12px;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-secondary);
}

.help-section ul {
  margin: 0;
  padding-left: var(--spacing-md);
  font-size: 11px;
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.action-bar {
  padding: var(--spacing-sm);
  border-top: 1px solid var(--color-border);
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

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.full-width {
  width: 100%;
}

.btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.btn-icon:hover {
  opacity: 1;
}

.btn-icon.small {
  font-size: 12px;
  padding: 2px;
}

.btn-icon.danger:hover {
  color: #ef4444;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
  text-align: center;
}

.empty-state.small {
  padding: var(--spacing-md);
}

.empty-state span {
  font-size: 24px;
  margin-bottom: var(--spacing-sm);
}

.empty-state p {
  font-size: 12px;
  margin: 0;
}

/* 页面头部样式 */
.header-left {
  display: flex;
  flex-direction: column;
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* 导入弹窗样式 */
.import-tip {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
}

.form-group {
  margin-bottom: var(--spacing-md);
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
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 14px;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.input-with-btn {
  display: flex;
  gap: var(--spacing-sm);
}

.input-with-btn .form-input {
  flex: 1;
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
  max-width: 450px;
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
</style>
