<template>
  <div class="branch-report-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">支线报表</h2>
    </div>

    <!-- Tab切换 -->
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="日报表" name="daily"></el-tab-pane>
      <el-tab-pane label="月报表" name="monthly"></el-tab-pane>
    </el-tabs>

    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="平台ID">
          <el-input
            v-model="searchForm.platformId"
            placeholder="请输入平台ID"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="支付通道ID">
          <el-input
            v-model="searchForm.channelId"
            placeholder="请输入支付通道ID"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="统计时间">
          <el-date-picker
            v-model="searchForm.statsDate"
            :type="activeTab === 'monthly' ? 'month' : 'date'"
            :placeholder="activeTab === 'monthly' ? '请选择月份' : '请选择日期'"
            clearable
            style="width: 200px"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="排序方式">
          <el-select
            v-model="searchForm.sortType"
            placeholder="请选择排序方式"
            clearable
            style="width: 200px"
          >
            <el-option label="帐户馀额降序" :value="1" />
            <el-option label="预付押金降序" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>

      <div style="margin-top: 12px;">
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-button @click="handleReset">
          <el-icon><RefreshLeft /></el-icon>
          重置
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
        <el-button type="success" @click="handleExport" :loading="exportLoading">
          <el-icon><Download /></el-icon>
          导出
        </el-button>
      </div>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        show-summary
        :summary-method="getSummaries"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column prop="platformId" label="平台ID" width="100" />
        <el-table-column prop="platformName" label="平台名称" width="150" />
        <el-table-column prop="channelId" label="通道ID" width="100" />
        <el-table-column prop="channelName" label="通道名称" width="150" />
        <el-table-column prop="statsDate" label="统计日期" width="120" />

        <el-table-column label="提交总额" width="150" align="right">
          <template #default="{ row }">
            <span style="color: #67C23A; font-weight: 600;">
              {{ row.money?.toFixed(2) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="手续费总额" width="150" align="right">
          <template #default="{ row }">
            <span style="color: #E6A23C;">
              {{ row.fee?.toFixed(2) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="三方手续费" width="150" align="right">
          <template #default="{ row }">
            <span style="color: #F56C6C;">
              {{ row.thirdFee?.toFixed(2) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="通道利润" width="150" align="right">
          <template #default="{ row }">
            <span style="color: #409EFF; font-weight: 600;">
              {{ row.channelProfit?.toFixed(2) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="successCount" label="成功笔数" width="120" align="right" />
        <el-table-column prop="submitCount" label="提交笔数" width="120" align="right" />

        <el-table-column label="成功率" width="120" align="right">
          <template #default="{ row }">
            <el-tag :type="getSuccessRateType(row.successRate)">
              {{ row.successRate?.toFixed(2) }}%
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.pageNo"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Search,
  RefreshLeft,
  Refresh,
  Download,
} from '@element-plus/icons-vue'
import {
  getList,
  getMonthList,
} from '@/api/reports/branch'
import { request } from '@/utils/request'

// 当前激活的Tab
const activeTab = ref('daily')

// 搜索表单
const searchForm = reactive({
  platformId: '',
  channelId: '',
  statsDate: '',
  sortType: undefined as number | undefined,
})

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)
const exportLoading = ref(false)

// 分页
const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
})

// 统计数据（用于合计行）
const summaryData = reactive({
  totalMoney: 0,
  totalFee: 0,
  totalThirdFee: 0,
  totalChannelProfit: 0,
  totalSuccessCount: 0,
  totalSubmitCount: 0,
})

// 获取列表
const fetchList = async () => {
  try {
    loading.value = true

    const params: any = {
      pageNo: pagination.pageNo,
      pageSize: pagination.pageSize,
    }

    // 添加搜索条件
    if (searchForm.platformId) {
      params.platformId = Number(searchForm.platformId)
    }
    if (searchForm.channelId) {
      params.channelId = Number(searchForm.channelId)
    }
    if (searchForm.statsDate) {
      params.statsDate = [searchForm.statsDate]
    }
    if (searchForm.sortType !== undefined) {
      params.sortType = searchForm.sortType
    }

    let res: any

    // 根据不同Tab调用不同接口
    if (activeTab.value === 'daily') {
      res = await getList(params)
    } else if (activeTab.value === 'monthly') {
      res = await getMonthList(params)
    }

    if (res.code === 0 && res.data) {
      tableData.value = res.data.records || []
      pagination.total = res.data.total || 0

      // 计算合计
      calculateSummary()
    } else {
      ElMessage.error(res.msg || '获取列表失败')
    }
  } catch (error) {
    console.error('获取列表失败:', error)
    ElMessage.error('获取列表失败，请重试')
  } finally {
    loading.value = false
  }
}

// 计算合计
const calculateSummary = () => {
  summaryData.totalMoney = tableData.value.reduce((sum, item) => sum + (item.money || 0), 0)
  summaryData.totalFee = tableData.value.reduce((sum, item) => sum + (item.fee || 0), 0)
  summaryData.totalThirdFee = tableData.value.reduce((sum, item) => sum + (item.thirdFee || 0), 0)
  summaryData.totalChannelProfit = tableData.value.reduce((sum, item) => sum + (item.channelProfit || 0), 0)
  summaryData.totalSuccessCount = tableData.value.reduce((sum, item) => sum + (item.successCount || 0), 0)
  summaryData.totalSubmitCount = tableData.value.reduce((sum, item) => sum + (item.submitCount || 0), 0)
}

// 自定义合计行
const getSummaries = (param: any) => {
  const { columns } = param
  const sums: any[] = []

  columns.forEach((column: any, index: number) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }

    switch (column.property) {
      case 'money':
        sums[index] = summaryData.totalMoney.toFixed(2)
        break
      case 'fee':
        sums[index] = summaryData.totalFee.toFixed(2)
        break
      case 'thirdFee':
        sums[index] = summaryData.totalThirdFee.toFixed(2)
        break
      case 'channelProfit':
        sums[index] = summaryData.totalChannelProfit.toFixed(2)
        break
      case 'successCount':
        sums[index] = summaryData.totalSuccessCount.toString()
        break
      case 'submitCount':
        sums[index] = summaryData.totalSubmitCount.toString()
        break
      default:
        sums[index] = ''
    }
  })

  return sums
}

// 获取成功率标签类型
const getSuccessRateType = (rate: number) => {
  if (rate >= 90) return 'success'
  if (rate >= 70) return 'warning'
  return 'danger'
}

// 搜索
const handleSearch = () => {
  pagination.pageNo = 1
  fetchList()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    platformId: '',
    channelId: '',
    statsDate: '',
    sortType: undefined,
  })
  pagination.pageNo = 1
  fetchList()
}

// 刷新
const handleRefresh = () => {
  fetchList()
  ElMessage.success('刷新成功')
}

// 导出
const handleExport = async () => {
  try {
    exportLoading.value = true

    const params: any = {}

    // 添加搜索条件
    if (searchForm.platformId) {
      params.platformId = Number(searchForm.platformId)
    }
    if (searchForm.channelId) {
      params.channelId = Number(searchForm.channelId)
    }
    if (searchForm.statsDate) {
      params.statsDate = [searchForm.statsDate]
    }
    if (searchForm.sortType !== undefined) {
      params.sortType = searchForm.sortType
    }

    // 根据不同Tab确定导出接口路径
    let exportUrl = ''
    let fileNamePrefix = ''

    if (activeTab.value === 'daily') {
      exportUrl = '/pay-report/payment-third-channel-daily/export'
      fileNamePrefix = 'branch_daily_report'
    } else if (activeTab.value === 'monthly') {
      exportUrl = '/pay-report/payment-third-channel-daily/export-month'
      fileNamePrefix = 'branch_monthly_report'
    }

    // 使用统一的导出方法
    await request.downloadFile(
      exportUrl,
      params,
      `${fileNamePrefix}_${new Date().getTime()}`
    )
  } catch (error) {
    console.error('导出失败:', error)
  } finally {
    exportLoading.value = false
  }
}

// Tab切换
const handleTabChange = () => {
  // 切换Tab时重置搜索条件和分页
  Object.assign(searchForm, {
    platformId: '',
    channelId: '',
    statsDate: '',
    sortType: undefined,
  })
  pagination.pageNo = 1
  fetchList()
}

// 分页变化
const handleSizeChange = () => {
  pagination.pageNo = 1
  fetchList()
}

const handleCurrentChange = () => {
  fetchList()
}

// 页面加载时获取数据
onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.branch-report-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.search-card {
  margin-bottom: 16px;
  margin-top: 16px;
}

.table-card {
  min-height: 400px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 16px;
  margin-bottom: 0;
}

:deep(.el-table__footer-wrapper) {
  font-weight: 600;
}
</style>
