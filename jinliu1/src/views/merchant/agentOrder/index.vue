<template>
  <div class="payout-order-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">代付订单</h2>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline label-width="100px">
        <el-form-item label="商户账号">
          <el-input
            v-model="searchForm.merchantAccount"
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
        <el-form-item label="代付状态">
          <el-select
            v-model="searchForm.payStatus"
            placeholder="请选择代付状态"
            clearable
            style="width: 200px"
          >
            <el-option label="待处理" :value="1" />
            <el-option label="代付中" :value="2" />
            <el-option label="建单失败" :value="3" />
            <el-option label="建单超时" :value="4" />
            <el-option label="用户取消" :value="5" />
            <el-option label="系统取消" :value="6" />
            <el-option label="商户取消" :value="7" />
            <el-option label="超时未回" :value="8" />
            <el-option label="代付成功" :value="9" />
            <el-option label="代付失败" :value="10" />
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
        <el-form-item label="完成时间">
          <el-date-picker
            v-model="searchForm.completeTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 360px"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="操作者">
          <el-input
            v-model="searchForm.updatedBy"
            placeholder="请输入操作者"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
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
        <el-table-column prop="outTradeNo" label="商户单号" width="180" />
        <el-table-column prop="thirdTradeNo" label="三方单号" width="180" />
        <el-table-column prop="money" label="代付金额" width="120">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: 600;">{{ row.money }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="actualMoney" label="已付金额" width="120">
          <template #default="{ row }">
            <span style="color: #67c23a; font-weight: 600;">{{ row.actualMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fee" label="商户手续费" width="100" />
        <el-table-column prop="thirdFee" label="三方手续费" width="100" />
        <el-table-column prop="realName" label="开户姓名" width="120" />
        <el-table-column prop="bankName" label="银行名称" width="150" />
        <el-table-column prop="bankNumber" label="银行卡号" width="180" />
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
        <el-table-column prop="createdTime" label="创建时间" width="160" />
        <el-table-column prop="completeTime" label="完成时间" width="160" />
        <el-table-column label="操作" fixed="right" width="500">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleViewDetail(row)">
              详情
            </el-button>
            <el-button
              v-if="row.payStatus === 1"
              type="warning"
              link
              size="small"
              @click="handleReroute(row)"
            >
              转上游
            </el-button>
            <el-button
              v-if="row.payStatus === 1"
              type="success"
              link
              size="small"
              @click="handleReceive(row)"
            >
              领取
            </el-button>
            <el-button
              v-if="row.payStatus === 1"
              type="primary"
              link
              size="small"
              @click="handleManualDisburse(row)"
            >
              手动出款
            </el-button>
            <el-button
              v-if="row.payStatus === 1 || row.payStatus === 2"
              type="danger"
              link
              size="small"
              @click="handleManualReject(row)"
            >
              手动驳回
            </el-button>
            <el-button
              v-if="row.payStatus === 9"
              type="warning"
              link
              size="small"
              @click="handleManualReversal(row)"
            >
              手动冲正
            </el-button>
            <el-button
              v-if="row.notificationStatus === 0 && (row.payStatus === 9 || row.payStatus === 10)"
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

    <!-- 转上游订单对话框 -->
    <el-dialog
      v-model="rerouteDialogVisible"
      title="转上游订单"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="rerouteFormRef"
        :model="rerouteForm"
        :rules="rerouteFormRules"
        label-width="120px"
      >
        <el-form-item label="支付平台ID" prop="platformId">
          <el-input-number
            v-model="rerouteForm.platformId"
            placeholder="请输入支付平台ID"
            :min="1"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rerouteDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="rerouteLoading" @click="handleRerouteSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="代付订单详情"
      width="1000px"
      :close-on-click-modal="false"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单ID">{{ orderDetail.id }}</el-descriptions-item>
        <el-descriptions-item label="商户ID">{{ orderDetail.merchantId }}</el-descriptions-item>
        <el-descriptions-item label="商户编号">{{ orderDetail.merchantCode }}</el-descriptions-item>
        <el-descriptions-item label="商户账号">{{ orderDetail.merchantAccount }}</el-descriptions-item>
        <el-descriptions-item label="系统订单号">{{ orderDetail.tradeNo }}</el-descriptions-item>
        <el-descriptions-item label="商户单号">{{ orderDetail.outTradeNo }}</el-descriptions-item>
        <el-descriptions-item label="三方单号">{{ orderDetail.thirdTradeNo }}</el-descriptions-item>
        <el-descriptions-item label="代付金额">
          <span style="color: #f56c6c; font-weight: 600;">{{ orderDetail.money }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="已付金额">
          <span style="color: #67c23a; font-weight: 600;">{{ orderDetail.actualMoney }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="商户手续费">{{ orderDetail.fee }}</el-descriptions-item>
        <el-descriptions-item label="三方手续费">{{ orderDetail.thirdFee }}</el-descriptions-item>
        <el-descriptions-item label="实际三方手续费">{{ orderDetail.actualThirdFee }}</el-descriptions-item>
        <el-descriptions-item label="开户姓名">{{ orderDetail.realName }}</el-descriptions-item>
        <el-descriptions-item label="银行名称">{{ orderDetail.bankName }}</el-descriptions-item>
        <el-descriptions-item label="银行卡号" :span="2">{{ orderDetail.bankNumber }}</el-descriptions-item>
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
        <el-descriptions-item label="创建时间">{{ orderDetail.createdTime }}</el-descriptions-item>
        <el-descriptions-item label="完成时间">{{ orderDetail.completeTime }}</el-descriptions-item>
      </el-descriptions>

      <!-- 三方代付订单列表 -->
      <el-divider content-position="left">三方代付订单</el-divider>
      <div style="margin-bottom: 10px;">
        <el-button type="primary" size="small" @click="handleRefreshUpstream">
          <el-icon><Refresh /></el-icon>
          刷新三方订单
        </el-button>
      </div>
      <el-table
        v-loading="upstreamOrderLoading"
        :data="upstreamOrderList"
        stripe
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="tradeNo" label="系统订单号" width="180" />
        <el-table-column prop="externalNo" label="三方订单号" width="180" />
        <el-table-column prop="platformName" label="支付平台" width="120" />
        <el-table-column prop="money" label="代付金额" width="100" />
        <el-table-column prop="thirdFee" label="三方手续费" width="100" />
        <el-table-column prop="thirdStatus" label="三方状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getThirdStatusType(row.thirdStatus)">
              {{ getThirdStatusText(row.thirdStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdBy" label="创建人" width="100" />
        <el-table-column prop="createdTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button
              v-if="row.thirdStatus === 2"
              type="success"
              link
              size="small"
              @click="handleManualSuccess(row)"
            >
              手动成功
            </el-button>
            <el-button
              v-if="row.thirdStatus === 2"
              type="danger"
              link
              size="small"
              @click="handleManualFailed(row)"
            >
              手动失败
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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
import type { FormInstance, FormRules } from 'element-plus'
import {
  getMerchantPayoutOrderList,
  getMerchantPayoutOrderDetail,
  getMerchantPayoutOrderExport,
  rerouteMerchantPayoutOrder,
  receiveMerchantPayoutOrder,
  manualDisburseMerchantPayoutOrder,
  manualRejectMerchantPayoutOrder,
  manualReversalMerchantPayoutOrder,
  notifyMerchantPayoutOrder,
  getMerchantPayoutUpstreamOrderList,
  refreshMerchantPayoutUpstreamOrder,
  manualSuccessMerchantPayoutUpstreamOrder,
  manualFailedMerchantPayoutUpstreamOrder,
  type MerchantPayoutOrderParams,
  type MerchantPayoutOrderRerouteParams,
} from '@/api/merchant/agentOrder'

// 搜索表单
const searchForm = reactive<Partial<MerchantPayoutOrderParams>>({
  pageNo: 1,
  pageSize: 10,
  merchantAccount: '',
  tradeNo: '',
  payStatus: undefined,
  createdTime: [],
  completeTime: [],
  updatedBy: '',
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

// 转上游订单对话框
const rerouteDialogVisible = ref(false)
const rerouteFormRef = ref<FormInstance>()
const rerouteLoading = ref(false)
const rerouteForm = reactive<MerchantPayoutOrderRerouteParams>({
  platformId: 0,
  orderId: 0,
})

const rerouteFormRules: FormRules = {
  platformId: [
    { required: true, message: '请输入支付平台ID', trigger: 'blur' },
  ],
}

// 订单详情对话框
const detailDialogVisible = ref(false)
const orderDetail = ref<any>({})

// 三方代付订单列表
const upstreamOrderList = ref<any[]>([])
const upstreamOrderLoading = ref(false)

// 获取代付状态类型
const getPayStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    1: 'info',
    2: 'warning',
    3: 'danger',
    4: 'danger',
    5: 'info',
    6: 'info',
    7: 'info',
    8: 'warning',
    9: 'success',
    10: 'danger',
  }
  return typeMap[status] || 'info'
}

// 获取代付状态文本
const getPayStatusText = (status: number) => {
  const textMap: Record<number, string> = {
    1: '待处理',
    2: '代付中',
    3: '建单失败',
    4: '建单超时',
    5: '用户取消',
    6: '系统取消',
    7: '商户取消',
    8: '超时未回',
    9: '代付成功',
    10: '代付失败',
  }
  return textMap[status] || '未知'
}

// 获取三方状态类型
const getThirdStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    1: 'success',
    2: 'warning',
    3: 'danger',
  }
  return typeMap[status] || 'info'
}

// 获取三方状态文本
const getThirdStatusText = (status: number) => {
  const textMap: Record<number, string> = {
    1: '成功',
    2: '处理中',
    3: '失败',
  }
  return textMap[status] || '未知'
}

// 获取订单列表
const fetchOrderList = async () => {
  try {
    loading.value = true

    const params: MerchantPayoutOrderParams = {
      pageNo: pagination.current,
      pageSize: pagination.size,
      merchantAccount: searchForm.merchantAccount,
      tradeNo: searchForm.tradeNo,
      payStatus: searchForm.payStatus,
      createdTime: searchForm.createdTime || [],
      completeTime: searchForm.completeTime || [],
      updatedBy: searchForm.updatedBy,
    }

    const res = await getMerchantPayoutOrderList(params)

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
    merchantAccount: '',
    tradeNo: '',
    payStatus: undefined,
    createdTime: [],
    completeTime: [],
    updatedBy: '',
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
    const params: MerchantPayoutOrderParams = {
      pageNo: pagination.current,
      pageSize: pagination.size,
      merchantAccount: searchForm.merchantAccount,
      tradeNo: searchForm.tradeNo,
      payStatus: searchForm.payStatus,
      createdTime: searchForm.createdTime || [],
      completeTime: searchForm.completeTime || [],
      updatedBy: searchForm.updatedBy,
    }

    await getMerchantPayoutOrderExport(params)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请重试')
  }
}

// 查看详情
const handleViewDetail = async (row: any) => {
  try {
    const res = await getMerchantPayoutOrderDetail({ id: row.id })

    if (res.code === 0 && res.data) {
      orderDetail.value = res.data
      detailDialogVisible.value = true
      // 加载三方代付订单列表
      fetchUpstreamOrderList(row.id)
    } else {
      ElMessage.error(res.msg || '获取详情失败')
    }
  } catch (error) {
    console.error('获取详情失败:', error)
    ElMessage.error('获取详情失败，请重试')
  }
}

// 获取三方代付订单列表
const fetchUpstreamOrderList = async (orderId: number) => {
  try {
    upstreamOrderLoading.value = true

    const res = await getMerchantPayoutUpstreamOrderList({ orderId })

    if (res.code === 0 && res.data) {
      upstreamOrderList.value = res.data
    } else {
      upstreamOrderList.value = []
      ElMessage.error(res.msg || '获取三方订单列表失败')
    }
  } catch (error) {
    console.error('获取三方订单列表失败:', error)
    ElMessage.error('获取三方订单列表失败，请重试')
    upstreamOrderList.value = []
  } finally {
    upstreamOrderLoading.value = false
  }
}

// 转上游订单
const handleReroute = (row: any) => {
  rerouteForm.orderId = row.id
  rerouteForm.platformId = 0
  rerouteDialogVisible.value = true
}

// 提交转上游订单
const handleRerouteSubmit = async () => {
  if (!rerouteFormRef.value) return

  await rerouteFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        rerouteLoading.value = true

        const res = await rerouteMerchantPayoutOrder({
          platformId: rerouteForm.platformId,
          orderId: rerouteForm.orderId,
        })

        if (res.code === 0) {
          ElMessage.success('转上游成功')
          rerouteDialogVisible.value = false
          fetchOrderList()
        } else {
          ElMessage.error(res.msg || '转上游失败')
        }
      } catch (error) {
        console.error('转上游失败:', error)
        ElMessage.error('转上游失败，请重试')
      } finally {
        rerouteLoading.value = false
      }
    }
  })
}

// 领取订单
const handleReceive = async (row: any) => {
  ElMessageBox.confirm(
    '确定要领取此订单吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const res = await receiveMerchantPayoutOrder({ orderId: row.id })

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
const handleManualDisburse = async (row: any) => {
  ElMessageBox.confirm(
    '确定要手动出款吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const res = await manualDisburseMerchantPayoutOrder({ orderId: row.id })

      if (res.code === 0) {
        ElMessage.success('出款成功')
        fetchOrderList()
      } else {
        ElMessage.error(res.msg || '出款失败')
      }
    } catch (error) {
      console.error('出款失败:', error)
      ElMessage.error('出款失败，请重试')
    }
  }).catch(() => {
    // 用户取消
  })
}

// 手动驳回
const handleManualReject = async (row: any) => {
  ElMessageBox.confirm(
    '确定要手动驳回此订单吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const res = await manualRejectMerchantPayoutOrder({ orderId: row.id })

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

// 手动冲正
const handleManualReversal = async (row: any) => {
  ElMessageBox.confirm(
    '确定要手动冲正此订单吗？此操作将撤销代付成功状态。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error',
    }
  ).then(async () => {
    try {
      const res = await manualReversalMerchantPayoutOrder({ orderId: row.id })

      if (res.code === 0) {
        ElMessage.success('冲正成功')
        fetchOrderList()
      } else {
        ElMessage.error(res.msg || '冲正失败')
      }
    } catch (error) {
      console.error('冲正失败:', error)
      ElMessage.error('冲正失败，请重试')
    }
  }).catch(() => {
    // 用户取消
  })
}

// 回调商户
const handleNotify = async (row: any) => {
  try {
    const res = await notifyMerchantPayoutOrder({ orderId: row.id })

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

// 刷新三方订单
const handleRefreshUpstream = async () => {
  if (!orderDetail.value.id) return

  try {
    const res = await refreshMerchantPayoutUpstreamOrder({ orderId: orderDetail.value.id })

    if (res.code === 0 && res.data) {
      ElMessage.success('刷新成功')
      // 显示刷新后的信息
      ElMessageBox.alert(
        `
        <div>
          <p><strong>订单ID:</strong> ${res.data.orderId}</p>
          <p><strong>三方单号:</strong> ${res.data.thirdTradeNo}</p>
          <p><strong>订单金额:</strong> ${res.data.money}</p>
          <p><strong>三方手续费:</strong> ${res.data.actualThirdFee}</p>
          <p><strong>代付状态:</strong> ${res.data.thirdStatus}</p>
          <p><strong>三方响应代码:</strong> ${res.data.thirdCode}</p>
          <p><strong>三方响应信息:</strong> ${res.data.thirdMsg}</p>
        </div>
        `,
        '三方订单刷新结果',
        {
          dangerouslyUseHTMLString: true,
        }
      )
      // 重新加载三方订单列表
      fetchUpstreamOrderList(orderDetail.value.id)
      // 重新加载订单详情
      const detailRes = await getMerchantPayoutOrderDetail({ id: orderDetail.value.id })
      if (detailRes.code === 0 && detailRes.data) {
        orderDetail.value = detailRes.data
      }
    } else {
      ElMessage.error(res.msg || '刷新失败')
    }
  } catch (error) {
    console.error('刷新失败:', error)
    ElMessage.error('刷新失败，请重试')
  }
}

// 手动修改成功
const handleManualSuccess = async (row: any) => {
  ElMessageBox.confirm(
    '确定要手动标记此三方订单为成功吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const res = await manualSuccessMerchantPayoutUpstreamOrder({ orderId: orderDetail.value.id })

      if (res.code === 0) {
        ElMessage.success('操作成功')
        fetchUpstreamOrderList(orderDetail.value.id)
        // 重新加载订单详情
        const detailRes = await getMerchantPayoutOrderDetail({ id: orderDetail.value.id })
        if (detailRes.code === 0 && detailRes.data) {
          orderDetail.value = detailRes.data
        }
        fetchOrderList()
      } else {
        ElMessage.error(res.msg || '操作失败')
      }
    } catch (error) {
      console.error('操作失败:', error)
      ElMessage.error('操作失败，请重试')
    }
  }).catch(() => {
    // 用户取消
  })
}

// 手动修改失败
const handleManualFailed = async (row: any) => {
  ElMessageBox.confirm(
    '确定要手动标记此三方订单为失败吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error',
    }
  ).then(async () => {
    try {
      const res = await manualFailedMerchantPayoutUpstreamOrder({ orderId: orderDetail.value.id })

      if (res.code === 0) {
        ElMessage.success('操作成功')
        fetchUpstreamOrderList(orderDetail.value.id)
        // 重新加载订单详情
        const detailRes = await getMerchantPayoutOrderDetail({ id: orderDetail.value.id })
        if (detailRes.code === 0 && detailRes.data) {
          orderDetail.value = detailRes.data
        }
        fetchOrderList()
      } else {
        ElMessage.error(res.msg || '操作失败')
      }
    } catch (error) {
      console.error('操作失败:', error)
      ElMessage.error('操作失败，请重试')
    }
  }).catch(() => {
    // 用户取消
  })
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
.payout-order-page {
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
