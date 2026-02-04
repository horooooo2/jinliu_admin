<template>
  <div class="layout-container">
    <!-- Sidebar -->
    <aside class="layout-sidebar">
      <Sidebar :is-collapse="isCollapse" />
    </aside>

    <!-- Main Content -->
    <div class="layout-main">
      <!-- Header -->
      <header class="layout-header">
        <Header @toggle-sidebar="toggleSidebar" />
      </header>

      <!-- Content -->
      <main class="layout-content">
        <div class="content-wrapper">
          <router-view />
        </div>

        <!-- Footer -->
        <!-- <footer class="layout-footer">
          <div class="footer-content">
            &copy; {{ currentYear }} - Made with ❤️ by
            <a href="#" class="footer-link">匠胜科技</a>
          </div>
        </footer> -->
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'

const isCollapse = ref(false)

const currentYear = computed(() => new Date().getFullYear())

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style scoped>
.layout-container {
  display: flex;
  width: 100%;
  height: 100%;
}

.layout-sidebar {
  height: 100%;
  transition: all 0.3s;
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.layout-header {
  flex-shrink: 0;
}

.layout-content {
  flex: 1;
  overflow: auto;
  background: #f3f4f6;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  padding: 20px;
}

.layout-footer {
  flex-shrink: 0;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  padding: 16px 20px;
}

.footer-content {
  text-align: center;
  font-size: 13px;
  color: #6b7280;
}

.footer-link {
  color: #409eff;
  text-decoration: none;
  font-weight: 600;
}

.footer-link:hover {
  text-decoration: underline;
}
</style>
