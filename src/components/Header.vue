<template>
  <div class="header-container">
    <div class="header-left">
      <el-button
        :icon="Fold"
        circle
        @click="toggleSidebar"
        class="menu-btn"
      />
      <div class="search-box">
        <el-input
          v-model="searchText"
          placeholder="Search..."
          :prefix-icon="Search"
          clearable
        />
      </div>
    </div>

    <div class="header-right">
      <!-- 全屏按钮 -->
      <el-button
        :icon="FullScreen"
        circle
        @click="toggleFullscreen"
        class="header-icon-btn"
      />

      <!-- 通知 -->
      <el-dropdown trigger="click" class="notification-dropdown">
        <el-badge :value="9" class="notification-badge">
          <el-button :icon="Bell" circle class="header-icon-btn" />
        </el-badge>
        <template #dropdown>
          <el-dropdown-menu class="notification-menu">
            <div class="notification-header">
              <h5>通知</h5>
              <el-link type="primary" :underline="false">清除全部</el-link>
            </div>
            <el-scrollbar height="300px">
              <el-dropdown-item
                v-for="item in notifications"
                :key="item.id"
                class="notification-item"
              >
                <div class="notification-content">
                  <el-avatar :src="item.avatar" :size="40" />
                  <div class="notification-info">
                    <div class="notification-user">
                      <span>{{ item.name }}</span>
                      <span class="notification-time">{{ item.time }}</span>
                    </div>
                    <div class="notification-msg">{{ item.message }}</div>
                  </div>
                </div>
              </el-dropdown-item>
            </el-scrollbar>
            <div class="notification-footer">
              <el-link type="primary" :underline="false">查看全部</el-link>
            </div>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 用户菜单 -->
      <el-dropdown trigger="click" class="user-dropdown">
        <div class="user-info">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            :size="36"
          />
          <span class="user-name">{{ userStore.userInfo?.username || 'Admin' }}</span>
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-icon><User /></el-icon>
              我的账户
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon><Lock /></el-icon>
              锁屏
            </el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Fold,
  Search,
  FullScreen,
  Bell,
  ArrowDown,
  User,
  Lock,
  SwitchButton,
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const emit = defineEmits<{
  toggleSidebar: []
}>()

const userStore = useUserStore()
const searchText = ref('')

const notifications = ref([
  {
    id: 1,
    name: 'Carl Steadham',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    message: 'Completed Improve workflow in Figma',
    time: '5 min ago',
  },
  {
    id: 2,
    name: 'Olivia McGuire',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    message: 'dark-themes.zip 2.4 MB',
    time: '1 min ago',
  },
  {
    id: 3,
    name: 'Travis Williams',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    message: '@Patryk Please make sure that you\'re....',
    time: '7 min ago',
  },
])

const toggleSidebar = () => {
  emit('toggleSidebar')
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const handleLogout = () => {
  userStore.logout()
}
</script>

<style scoped>
.header-container {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-btn {
  font-size: 18px;
}

.search-box {
  width: 240px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon-btn {
  font-size: 18px;
}

.notification-badge {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f3f4f6;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
}

.notification-menu {
  width: 320px;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.notification-header h5 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.notification-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.notification-content {
  display: flex;
  gap: 12px;
}

.notification-info {
  flex: 1;
}

.notification-user {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-weight: 500;
}

.notification-time {
  font-size: 12px;
  color: #9ca3af;
  font-weight: normal;
}

.notification-msg {
  font-size: 13px;
  color: #6b7280;
}

.notification-footer {
  padding: 12px 16px;
  text-align: center;
  border-top: 1px solid #e5e7eb;
}
</style>
