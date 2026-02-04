<template>
  <div class="withdraw-order-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">商户提现订单</h2>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline label-width="100px">
        <el-form-item label="商户账号">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入商户账号"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="系统订单号">
          <el-input
            v-model="searchForm.tradeNo"
            placeholder="请输入系统订单号"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="商户订单号">
          <el-input
            v-model="searchForm.outTradeNo"
            placeholder="请输入商户订单号"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="提现状态">
          <el-select
            v-model="searchForm.payStatus"
            placeholder="请选择提现状态"
            clearable
            style="width: 200px"
          >
            <el-option label="待打款" :value="1" />
            <el-option label="已打款" :value="2" />
            <el-option label="已驳回" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序方式">
          <el-select
            v-model="searchForm.sortType"
            placeholder="请选择排序方式"
            style="width: 200px"
          >
            <el-option label="帐户余额降序" :value="1" />
            <el-option label="预付押金降序" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchForm.createdTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 360px"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="更新时间">
          <el-date-picker
            v-model="searchForm.updatedTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 360px"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮区域 -->
    <el-card class="action-card" shadow="never">
      <el-button type="success" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
      <el-button @click="handleRefresh">
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column prop="id" label="订单ID" width="80" />
        <el-table-column prop="merchantAccount" label="商户账号" width="120" />
        <el-table-column prop="tradeNo" label="系统订单号" width="180" />
        <el-table-column prop="outTradeNo" label="商户订单号" width="180" />
        <el-table-column prop="money" label="提现金额" width="120">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: 600;">{{ row.money }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fee" label="手续费" width="100" />
        <el-table-column prop="actualMoney" label="打款金额" width="120">
          <template #default="{ row }">
            <span style="color: #67c23a; font-weight: 600;">{{ row.actualMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bankName" label="银行名称" width="150" />
        <el-table-column prop="realName" label="开户姓名" width="100" />
        <el-table-column prop="bankNumber" label="银行卡号" width="180" />
        <el-table-column prop="bankAddress" label="开户网点" width="200" show-overflow-tooltip />
        <el-table-column prop="payStatus" label="代付状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getPayStatusType(row.payStatus)">
              {{ getPayStatusText(row.payStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="notificationStatus" label="通知状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.notificationStatus === 1 ? 'success' : 'info'">
              {{ row.notificationStatus === 1 ? '已通知' : '未通知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="thirdStatus" label="三方状态" width="120" />
        <el-table-column prop="receivedBy" label="已领取者" width="120" />
        <el-table-column prop="createdTime" label="创建时间" width="160" />
        <el-table-column prop="completeTime" label="完成时间" width="160" />
        <el-table-column label="操作" fixed="right" width="350">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleViewDetail(row)">
              详情
            </el-button>
            <el-button
              v-if="row.payStatus === 1 && !row.receivedBy"
              type="success"
              link
              size="small"
              @click="handleReceive(row)"
            >
              领取
            </el-button>
            <el-button
              v-if="row.payStatus === 1"
              type="warning"
              link
              size="small"
              @click="handleManualWithdrawal(row)"
            >
              手动出款
            </el-button>
            <el-button
              v-if="row.payStatus === 1"
              type="danger"
              link
              size="small"
              @click="handleManualReject(row)"
            >
              手动驳回
            </el-button>
            <el-button
              v-if="row.payStatus === 2 && row.notificationStatus === 0"
              type="info"
              link
              size="small"
              @click="handleNotify(row)"
            >
              回调商户
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="提现订单详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单ID">{{ orderDetail.id }}</el-descriptions-item>
        <el-descriptions-item label="商户ID">{{ orderDetail.merchantId }}</el-descriptions-item>
        <el-descriptions-item label="商户代码">{{ orderDetail.merchantCode }}</el-descriptions-item>
        <el-descriptions-item label="商户账号">{{ orderDetail.merchantAccount }}</el-descriptions-item>
        <el-descriptions-item label="系统订单号">{{ orderDetail.tradeNo }}</el-descriptions-item>
        <el-descriptions-item label="商户订单号">{{ orderDetail.outTradeNo }}</el-descriptions-item>
        <el-descriptions-item label="提现金额">
          <span style="color: #f56c6c; font-weight: 600;">{{ orderDetail.money }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="手续费">{{ orderDetail.fee }}</el-descriptions-item>
        <el-descriptions-item label="打款金额">
          <span style="color: #67c23a; font-weight: 600;">{{ orderDetail.actualMoney }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="银行名称">{{ orderDetail.bankName }}</el-descriptions-item>
        <el-descriptions-item label="开户姓名">{{ orderDetail.realName }}</el-descriptions-item>
        <el-descriptions-item label="银行卡号">{{ orderDetail.bankNumber }}</el-descriptions-item>
        <el-descriptions-item label="开户网点" :span="2">{{ orderDetail.bankAddress }}</el-descriptions-item>
        <el-descriptions-item label="代付状态">
          <el-tag :type="getPayStatusType(orderDetail.payStatus)">
            {{ getPayStatusText(orderDetail.payStatus) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="通知状态">
          <el-tag :type="orderDetail.notificationStatus === 1 ? 'success' : 'info'">
            {{ orderDetail.notificationStatus === 1 ? '已通知' : '未通知' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="三方状态">{{ orderDetail.thirdStatus }}</el-descriptions-item>
        <el-descriptions-item label="已领取者">{{ orderDetail.receivedBy || '未领取' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ orderDetail.createdTime }}</el-descriptions-item>
        <el-descriptions-item label="完成时间">{{ orderDetail.completeTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button type="primary" @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  RefreshLeft,
  Download,
  Refresh,
} from '@element-plus/icons-vue'
import {
  getMerchantWithdrawalOrderList,
  getMerchantWithdrawalOrderDetail,
  exportMerchantWithdrawalOrderList,
  receiveMerchantWithdrawalOrder,
  manualWithdrawalMerchantWithdrawalOrder,
  manualRejectMerchantWithdrawalOrder,
  notifyMerchantWithdrawalOrder,
  type MerchantPayoutBankParams,
} from '@/api/merchant/withdrawOrder'

// 搜索表单
const searchForm = reactive<Partial<MerchantPayoutBankParams>>({
  sortType: 1,
  pageNo: 1,
  pageSize: 10,
  username: '',
  tradeNo: '',
  outTradeNo: '',
  createdTime: [],
  updatedTime: [],
  payStatus: undefined,
})

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
})

// 订单详情对话框
const detailDialogVisible = ref(false)
const orderDetail = ref<any>({})

// 获取代付状态类型
const getPayStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    1: 'warning',
    2: 'success',
    3: 'danger',
  }
  return typeMap[status] || 'info'
}

// 获取代付状态文本
const getPayStatusText = (status: number) => {
  const textMap: Record<number, string> = {
    1: '待打款',
    2: '已打款',
    3: '已驳回',
  }
  return textMap[status] || '未知'
}

// 获取提现订单列表
const fetchOrderList = async () => {
  try {
    loading.value = true

    const params: MerchantPayoutBankParams = {
      sortType: searchForm.sortType || 1,
      pageNo: pagination.current,
      pageSize: pagination.size,
      username: searchForm.username,
      tradeNo: searchForm.tradeNo,
      outTradeNo: searchForm.outTradeNo,
      createdTime: searchForm.createdTime || [],
      updatedTime: searchForm.updatedTime,
      payStatus: searchForm.payStatus,
    }

    const res = await getMerchantWithdrawalOrderList(params)

    if (res.code === 0 && res.data) {
      tableData.value = res.data.records || []
      pagination.total = res.data.total || 0
    } else {
      tableData.value = []
      pagination.total = 0
      ElMessage.error(res.msg || '获取订单列表失败')
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败，请重试')
    tableData.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchOrderList()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    sortType: 1,
    username: '',
    tradeNo: '',
    outTradeNo: '',
    createdTime: [],
    updatedTime: [],
    payStatus: undefined,
  })
  pagination.current = 1
  fetchOrderList()
}

// 刷新
const handleRefresh = () => {
  fetchOrderList()
  ElMessage.success('刷新成功')
}

// 导出
const handleExport = async () => {
  try {
    const params: MerchantPayoutBankParams = {
      sortType: searchForm.sortType || 1,
      pageNo: pagination.current,
      pageSize: pagination.size,
      username: searchForm.username,
      tradeNo: searchForm.tradeNo,
      outTradeNo: searchForm.outTradeNo,
      createdTime: searchForm.createdTime || [],
      updatedTime: searchForm.updatedTime,
      payStatus: searchForm.payStatus,
    }

    await exportMerchantWithdrawalOrderList(params)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请重试')
  }
}

// 查看详情
const handleViewDetail = async (row: any) => {
  try {
    const res = await getMerchantWithdrawalOrderDetail({ id: row.id })

    if (res.code === 0 && res.data) {
      orderDetail.value = res.data
      detailDialogVisible.value = true
    } else {
      ElMessage.error(res.msg || '获取详情失败')
    }
  } catch (error) {
    console.error('获取详情失败:', error)
    ElMessage.error('获取详情失败，请重试')
  }
}

// 领取订单
const handleReceive = async (row: any) => {
  ElMessageBox.confirm(
    `确定要领取订单 "${row.tradeNo}" 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    }
  ).then(async () => {
    try {
      const res = await receiveMerchantWithdrawalOrder({ orderId: row.id })

      if (res.code === 0) {
        ElMessage.success('领取成功')
        fetchOrderList()
      } else {
        ElMessage.error(res.msg || '领取失败')
      }
    } catch (error) {
      console.error('领取失败:', error)
      ElMessage.error('领取失败，请重试')
    }
  }).catch(() => {
    // 用户取消
  })
}

// 手动出款
const handleManualWithdrawal = (row: any) => {
  ElMessageBox.confirm(
    `确定要对订单 "${row.tradeNo}" 进行手动出款吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const res = await manualWithdrawalMerchantWithdrawalOrder({ orderId: row.id })

      if (res.code === 0) {
        ElMessage.success('手动出款成功')
        fetchOrderList()
      } else {
        ElMessage.error(res.msg || '手动出款失败')
      }
    } catch (error) {
      console.error('手动出款失败:', error)
      ElMessage.error('手动出款失败，请重试')
    }
  }).catch(() => {
    // 用户取消
  })
}

// 手动驳回
const handleManualReject = (row: any) => {
  ElMessageBox.confirm(
    `确定要驳回订单 "${row.tradeNo}" 吗？此操作不可恢复！`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const res = await manualRejectMerchantWithdrawalOrder({ orderId: row.id })

      if (res.code === 0) {
        ElMessage.success('驳回成功')
        fetchOrderList()
      } else {
        ElMessage.error(res.msg || '驳回失败')
      }
    } catch (error) {
      console.error('驳回失败:', error)
      ElMessage.error('驳回失败，请重试')
    }
  }).catch(() => {
    // 用户取消
  })
}

// 回调商户
const handleNotify = async (row: any) => {
  try {
    const res = await notifyMerchantWithdrawalOrder({ orderId: row.id })

    if (res.code === 0) {
      ElMessage.success('回调成功')
      fetchOrderList()
    } else {
      ElMessage.error(res.msg || '回调失败')
    }
  } catch (error) {
    console.error('回调失败:', error)
    ElMessage.error('回调失败，请重试')
  }
}

// 分页变化
const handleSizeChange = () => {
  pagination.current = 1
  fetchOrderList()
}

const handleCurrentChange = () => {
  fetchOrderList()
}

// 初始化
onMounted(() => {
  fetchOrderList()
})
</script>

<style scoped>
.withdraw-order-page {
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
}

.action-card {
  margin-bottom: 16px;
}

.action-card :deep(.el-button) {
  margin-right: 12px;
  margin-bottom: 8px;
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
  margin-bottom: 12px;
}
</style>
