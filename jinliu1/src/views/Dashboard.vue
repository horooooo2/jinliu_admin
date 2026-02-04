<template>
  <div class="dashboard-container">
    <!-- Page Title -->
    <div class="page-header">
      <h4 class="page-title">Dashboard</h4>
    </div>

    <!-- Statistics Cards -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-header">网站流量</div>
          <div class="stat-content">
            <div class="stat-value">91.6K</div>
            <div class="stat-trend trend-up">
              <el-icon><CaretTop /></el-icon>
              15%
            </div>
          </div>
          <div class="stat-chart">
            <div class="mini-chart"></div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-header">转化率</div>
          <div class="stat-content">
            <div class="stat-value">15%</div>
            <div class="stat-trend trend-down">
              <el-icon><CaretBottom /></el-icon>
              10%
            </div>
          </div>
          <div class="stat-chart">
            <div class="mini-chart"></div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-header">会话时长</div>
          <div class="stat-content">
            <div class="stat-value">90 Sec</div>
            <div class="stat-trend trend-up">
              <el-icon><CaretTop /></el-icon>
              25%
            </div>
          </div>
          <div class="stat-chart">
            <div class="mini-chart"></div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-header">活跃用户</div>
          <div class="stat-content">
            <div class="stat-value">2,986</div>
            <div class="stat-trend trend-up">
              <el-icon><CaretTop /></el-icon>
              4%
            </div>
          </div>
          <div class="stat-chart">
            <div class="mini-chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Charts Row -->
    <el-row :gutter="16" class="charts-row">
      <el-col :xs="24" :md="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon"><TrendCharts /></el-icon>
              <span class="header-title">月度销售</span>
            </div>
          </template>
          <div class="chart-placeholder">
            <div class="chart-content">📊 销售趋势图表区域</div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon"><Monitor /></el-icon>
              <span class="header-title">最佳流量来源</span>
            </div>
          </template>
          <el-table :data="trafficData" style="width: 100%">
            <el-table-column prop="network" label="网络" width="100" />
            <el-table-column prop="visitors" label="访客" width="80" />
            <el-table-column label="进度">
              <template #default="{ row }">
                <el-progress
                  :percentage="row.percentage"
                  :color="row.color"
                  :show-text="false"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- Additional Charts Row -->
    <el-row :gutter="16" class="charts-row">
      <el-col :xs="24" :md="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon"><DataLine /></el-icon>
              <span class="header-title">每日访问时段</span>
            </div>
          </template>
          <div class="chart-placeholder">
            <div class="chart-content">📈 时段分布图表区域</div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon"><Document /></el-icon>
              <span class="header-title">访问量最高的页面</span>
            </div>
          </template>
          <el-table :data="pageData" style="width: 100%">
            <el-table-column prop="page" label="页面名称" />
            <el-table-column prop="visitors" label="访客" width="80" />
            <el-table-column prop="unique" label="唯一" width="80" />
            <el-table-column prop="bounce" label="跳出率" width="100" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  CaretTop,
  CaretBottom,
  TrendCharts,
  Monitor,
  DataLine,
  Document,
} from '@element-plus/icons-vue'

const trafficData = ref([
  { network: 'Instagram', visitors: 3550, percentage: 80, color: '#f56c6c' },
  { network: 'Facebook', visitors: 1245, percentage: 56, color: '#409eff' },
  { network: 'Twitter', visitors: 1798, percentage: 67, color: '#909399' },
  { network: 'YouTube', visitors: 986, percentage: 39, color: '#67c23a' },
  { network: 'Pinterest', visitors: 854, percentage: 45, color: '#f56c6c' },
  { network: 'Linkedin', visitors: 650, percentage: 68, color: '#e6a23c' },
])

const pageData = ref([
  { page: '/home', visitors: 5896, unique: 3654, bounce: '82.54%' },
  { page: '/about.html', visitors: 3898, unique: 3450, bounce: '76.29%' },
  { page: '/index.html', visitors: 3057, unique: 2589, bounce: '72.68%' },
  { page: '/invoice.html', visitors: 867, unique: 795, bounce: '44.78%' },
  { page: '/docs/', visitors: 958, unique: 801, bounce: '41.15%' },
])
</script>

<style scoped>
.dashboard-container {
  width: 100%;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
}

.stats-row,
.charts-row {
  margin-bottom: 16px;
}

.stat-card {
  height: 100%;
}

.stat-card :deep(.el-card__body) {
  padding: 20px;
}

.stat-header {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
}

.trend-up {
  color: #67c23a;
}

.trend-down {
  color: #f56c6c;
}

.stat-chart {
  height: 60px;
  background: linear-gradient(to right, #e0f2fe, #dbeafe);
  border-radius: 4px;
}

.mini-chart {
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  font-size: 18px;
  padding: 6px;
  border: 1px solid #1f2937;
  border-radius: 4px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
}

.chart-content {
  font-size: 20px;
  color: white;
  font-weight: 600;
}

:deep(.el-table) {
  font-size: 13px;
}

:deep(.el-table th) {
  background-color: #f9fafb;
  color: #374151;
  font-weight: 600;
}
</style>
