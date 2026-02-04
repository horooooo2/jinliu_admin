<template>
  <div class="desktop-container">
    <!-- 时间筛选器 -->
    <!-- <el-card class="filter-card" shadow="never">
      <el-form :model="filterForm" inline>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            :shortcuts="dateShortcuts"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card> -->

    <!-- 加载状态 -->
    <div v-loading="loading">
      <!-- 账户余额 & 冻结金额 -->
      <el-row :gutter="16" class="stats-row">
        <!-- 商户累计账户余额 -->
        <el-col :xs="24" :lg="12">
          <el-card class="scroll-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span class="card-title">商户累计账户余额</span>
                <el-button
                  type="primary"
                  link
                  @click="fetchDashboardData(true)"
                >
                  <el-icon><Refresh /></el-icon>
                  刷新
                </el-button>
              </div>
            </template>
            <div class="scroll-wrapper">
              <el-button
                class="scroll-btn scroll-btn-left"
                circle
                size="small"
                @click="scrollLeft('balance')"
              >
                <el-icon><ArrowLeft /></el-icon>
              </el-button>
              <div ref="balanceScrollRef" class="scroll-content">
                <div
                  v-for="(value, merchantId) in dashboardData.merchantBalanceMap"
                  :key="`balance-${merchantId}`"
                  class="currency-item"
                >
                  <div class="currency-name">{{ formatMerchantId(merchantId) }}</div>
                  <div class="currency-value">{{ formatMoneyValue(value) }}</div>
                </div>
                <div v-if="Object.keys(dashboardData.merchantBalanceMap).length === 0" class="empty-hint">
                  暂无数据
                </div>
              </div>
              <el-button
                class="scroll-btn scroll-btn-right"
                circle
                size="small"
                @click="scrollRight('balance')"
              >
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </el-card>
        </el-col>

        <!-- 商户累计冻结金额 -->
        <el-col :xs="24" :lg="12">
          <el-card class="scroll-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span class="card-title">商户累计冻结金额</span>
                <el-button
                  type="primary"
                  link
                  @click="fetchDashboardData(true)"
                >
                  <el-icon><Refresh /></el-icon>
                  刷新
                </el-button>
              </div>
            </template>
            <div class="scroll-wrapper">
              <el-button
                class="scroll-btn scroll-btn-left"
                circle
                size="small"
                @click="scrollLeft('frozen')"
              >
                <el-icon><ArrowLeft /></el-icon>
              </el-button>
              <div ref="frozenScrollRef" class="scroll-content">
                <div
                  v-for="(value, merchantId) in dashboardData.merchantFrozenAmountMap"
                  :key="`frozen-${merchantId}`"
                  class="currency-item"
                >
                  <div class="currency-name">{{ formatMerchantId(merchantId) }}</div>
                  <div class="currency-value frozen">{{ formatMoneyValue(value) }}</div>
                </div>
                <div v-if="Object.keys(dashboardData.merchantFrozenAmountMap).length === 0" class="empty-hint">
                  暂无数据
                </div>
              </div>
              <el-button
                class="scroll-btn scroll-btn-right"
                circle
                size="small"
                @click="scrollRight('frozen')"
              >
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 支付总额 & 支付成功率 -->
      <el-row :gutter="16" class="stats-row">
        <!-- 商户支付总额(今日) -->
        <el-col :xs="24" :lg="12">
          <el-card class="scroll-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span class="card-title">商户支付总额(今日)</span>
                <el-button
                  type="primary"
                  link
                  @click="fetchDashboardData(true)"
                >
                  <el-icon><Refresh /></el-icon>
                  刷新
                </el-button>
              </div>
            </template>
            <div class="scroll-wrapper">
              <el-button
                class="scroll-btn scroll-btn-left"
                circle
                size="small"
                @click="scrollLeft('payment')"
              >
                <el-icon><ArrowLeft /></el-icon>
              </el-button>
              <div ref="paymentScrollRef" class="scroll-content">
                <div
                  v-for="(value, merchantId) in dashboardData.paymentActualMoneyMap"
                  :key="`payment-${merchantId}`"
                  class="currency-item"
                >
                  <div class="currency-name">{{ formatMerchantId(merchantId) }}</div>
                  <div class="currency-value payment">{{ formatMoneyValue(value) }}</div>
                </div>
                <div v-if="Object.keys(dashboardData.paymentActualMoneyMap).length === 0" class="empty-hint">
                  暂无数据
                </div>
              </div>
              <el-button
                class="scroll-btn scroll-btn-right"
                circle
                size="small"
                @click="scrollRight('payment')"
              >
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </el-card>
        </el-col>

        <!-- 商户支付成功率(今日) -->
        <el-col :xs="24" :lg="12">
          <el-card class="scroll-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span class="card-title">商户支付成功率(今日)</span>
                <el-button
                  type="primary"
                  link
                  @click="fetchDashboardData(true)"
                >
                  <el-icon><Refresh /></el-icon>
                  刷新
                </el-button>
              </div>
            </template>
            <div class="scroll-wrapper">
              <el-button
                class="scroll-btn scroll-btn-left"
                circle
                size="small"
                @click="scrollLeft('paymentRate')"
              >
                <el-icon><ArrowLeft /></el-icon>
              </el-button>
              <div ref="paymentRateScrollRef" class="scroll-content">
                <div
                  v-for="(value, merchantId) in dashboardData.paymentSuccessMap"
                  :key="`payment-rate-${merchantId}`"
                  class="currency-item"
                >
                  <div class="currency-name">{{ formatMerchantId(merchantId) }}</div>
                  <div class="currency-value rate">
                    {{ formatSuccessRate(value) }}
                  </div>
                </div>
                <div v-if="Object.keys(dashboardData.paymentSuccessMap).length === 0" class="empty-hint">
                  暂无数据
                </div>
              </div>
              <el-button
                class="scroll-btn scroll-btn-right"
                circle
                size="small"
                @click="scrollRight('paymentRate')"
              >
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 代付总额 & 代付成功率 -->
      <el-row :gutter="16" class="stats-row">
        <!-- 商户代付总额(今日) -->
        <el-col :xs="24" :lg="12">
          <el-card class="scroll-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span class="card-title">商户代付总额(今日)</span>
                <el-button
                  type="primary"
                  link
                  @click="fetchDashboardData(true)"
                >
                  <el-icon><Refresh /></el-icon>
                  刷新
                </el-button>
              </div>
            </template>
            <div class="scroll-wrapper">
              <el-button
                class="scroll-btn scroll-btn-left"
                circle
                size="small"
                @click="scrollLeft('payout')"
              >
                <el-icon><ArrowLeft /></el-icon>
              </el-button>
              <div ref="payoutScrollRef" class="scroll-content">
                <div
                  v-for="(value, merchantId) in dashboardData.payoutActualMoneyMap"
                  :key="`payout-${merchantId}`"
                  class="currency-item"
                >
                  <div class="currency-name">{{ formatMerchantId(merchantId) }}</div>
                  <div class="currency-value payout">{{ formatMoneyValue(value) }}</div>
                </div>
                <div v-if="Object.keys(dashboardData.payoutActualMoneyMap).length === 0" class="empty-hint">
                  暂无数据
                </div>
              </div>
              <el-button
                class="scroll-btn scroll-btn-right"
                circle
                size="small"
                @click="scrollRight('payout')"
              >
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </el-card>
        </el-col>

        <!-- 商户代付成功率(今日) -->
        <el-col :xs="24" :lg="12">
          <el-card class="scroll-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span class="card-title">商户代付成功率(今日)</span>
                <el-button
                  type="primary"
                  link
                  @click="fetchDashboardData(true)"
                >
                  <el-icon><Refresh /></el-icon>
                  刷新
                </el-button>
              </div>
            </template>
            <div class="scroll-wrapper">
              <el-button
                class="scroll-btn scroll-btn-left"
                circle
                size="small"
                @click="scrollLeft('payoutRate')"
              >
                <el-icon><ArrowLeft /></el-icon>
              </el-button>
              <div ref="payoutRateScrollRef" class="scroll-content">
                <div
                  v-for="(value, merchantId) in dashboardData.payoutSuccessMap"
                  :key="`payout-rate-${merchantId}`"
                  class="currency-item"
                >
                  <div class="currency-name">{{ formatMerchantId(merchantId) }}</div>
                  <div class="currency-value rate">
                    {{ formatSuccessRate(value) }}
                  </div>
                </div>
                <div v-if="Object.keys(dashboardData.payoutSuccessMap).length === 0" class="empty-hint">
                  暂无数据
                </div>
              </div>
              <el-button
                class="scroll-btn scroll-btn-right"
                circle
                size="small"
                @click="scrollRight('payoutRate')"
              >
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, RefreshLeft, Refresh, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { getDesktopDashboardInfo } from '@/api/desktop'
import type { DesktopDashboardInfoResponse } from '@/api/desktop'

// 获取今日日期范围
const getTodayRange = (): [string, string] => {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date()
  end.setHours(23, 59, 59, 999)

  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  return [formatDate(start), formatDate(end)]
}

// 时间范围 - 默认设置为今日
const dateRange = ref<[string, string] | null>(getTodayRange())

// 筛选表单
const filterForm = reactive({
  startTime: '',
  endTime: '',
})

// 加载状态
const loading = ref(false)

// 仪表盘数据
const dashboardData = ref<DesktopDashboardInfoResponse['data']>({
  merchantBalanceMap: {},
  merchantFrozenAmountMap: {},
  paymentActualMoneyMap: {},
  paymentSuccessMap: {},
  payoutActualMoneyMap: {},
  payoutSuccessMap: {},
})

// 滚动容器refs
const balanceScrollRef = ref<HTMLDivElement>()
const frozenScrollRef = ref<HTMLDivElement>()
const paymentScrollRef = ref<HTMLDivElement>()
const paymentRateScrollRef = ref<HTMLDivElement>()
const payoutScrollRef = ref<HTMLDivElement>()
const payoutRateScrollRef = ref<HTMLDivElement>()

// 日期快捷选项
const dateShortcuts = [
  {
    text: '今天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      return [start, end]
    },
  },
  {
    text: '最近7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近30天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '本月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      return [start, end]
    },
  },
]

// 货币代码映射
const currencyMap: Record<string, string> = {
  CNY: '人民币',
  THB: '泰铢',
  INR: '印度卢比',
  PHP: '披索',
  IDR: '印尼盾',
}

// 格式化商户ID（货币代码）
const formatMerchantId = (merchantId: string): string => {
  return currencyMap[merchantId] || merchantId
}

// 滚动函数
const scrollLeft = (type: string) => {
  const refMap: Record<string, any> = {
    balance: balanceScrollRef.value,
    frozen: frozenScrollRef.value,
    payment: paymentScrollRef.value,
    paymentRate: paymentRateScrollRef.value,
    payout: payoutScrollRef.value,
    payoutRate: payoutRateScrollRef.value,
  }
  const element = refMap[type]
  if (element) {
    element.scrollBy({ left: -200, behavior: 'smooth' })
  }
}

const scrollRight = (type: string) => {
  const refMap: Record<string, any> = {
    balance: balanceScrollRef.value,
    frozen: frozenScrollRef.value,
    payment: paymentScrollRef.value,
    paymentRate: paymentRateScrollRef.value,
    payout: payoutScrollRef.value,
    payoutRate: payoutRateScrollRef.value,
  }
  const element = refMap[type]
  if (element) {
    element.scrollBy({ left: 200, behavior: 'smooth' })
  }
}

// 获取仪表盘数据
const fetchDashboardData = async (showMessage = false) => {
  try {
    loading.value = true

    const params: { startTime?: string; endTime?: string } = {}
    if (dateRange.value && dateRange.value.length === 2) {
      params.startTime = dateRange.value[0]
      params.endTime = dateRange.value[1]
    }

    const res = await getDesktopDashboardInfo(params)

    if (res.code === 0 && res.data) {
      dashboardData.value = res.data
      if (showMessage) {
        ElMessage.success('数据加载成功')
      }
    } else {
      ElMessage.error(res.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('获取仪表盘数据失败:', error)
    ElMessage.error('获取数据失败，请重试')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  if (!dateRange.value) {
    ElMessage.warning('请选择时间范围')
    return
  }
  fetchDashboardData(true)
}

// 重置
const handleReset = () => {
  dateRange.value = getTodayRange()
  fetchDashboardData(true)
}

// 格式化金额（只显示数值）
const formatMoneyValue = (value: number) => {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// 格式化成功率（格式：成功数/总数=百分比）
const formatSuccessRate = (data: {
  successCount: number
  submitCount: number
  successRate: number
}) => {
  const percentage = (data.successRate * 100).toFixed(0)
  return `${data.successCount}/${data.submitCount}=${percentage}%`
}

// 页面加载时自动获取今日数据
onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.desktop-container {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.stats-row {
  margin-bottom: 16px;
}

.scroll-card {
  background: #fff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.scroll-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 40px;
}

.scroll-btn {
  position: absolute;
  z-index: 2;
  background: #fff;
  border: 1px solid #dcdfe6;
}

.scroll-btn-left {
  left: 0;
}

.scroll-btn-right {
  right: 0;
}

.scroll-content {
  display: flex;
  gap: 40px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 20px 0;
  flex: 1;
}

.scroll-content::-webkit-scrollbar {
  height: 6px;
}

.scroll-content::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 3px;
}

.scroll-content::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.scroll-content::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

.currency-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
  flex-shrink: 0;
}

.currency-name {
  font-size: 14px;
  color: #909399;
  margin-bottom: 12px;
  font-weight: 500;
}

.currency-value {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.currency-value.frozen {
  color: #f56c6c;
}

.currency-value.payment {
  color: #67c23a;
}

.currency-value.payout {
  color: #409eff;
}

.currency-value.rate {
  color: #409eff;
  font-size: 16px;
}

.empty-hint {
  color: #909399;
  font-size: 14px;
  padding: 20px;
  text-align: center;
  width: 100%;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 16px;
  margin-bottom: 0;
}
</style>