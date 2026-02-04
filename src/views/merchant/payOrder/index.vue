<template>
  <div class="pay-order-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">商户支付订单</h2>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline label-width="100px">
        <el-form-item label="商户帐号">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入商户帐号"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="交易单号">
          <el-input
            v-model="searchForm.orderNo"
            placeholder="请输入交易单号"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="付款人名">
          <el-input
            v-model="searchForm.payerName"
            placeholder="请输入付款人名"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="提交人IP">
          <el-input
            v-model="searchForm.createdIp"
            placeholder="请输入提交人IP"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select
            v-model="searchForm.payStatus"
            placeholder="请选择支付状态"
            clearable
            style="width: 200px"
          >
            <el-option label="待支付" :value="0" />
            <el-option label="支付成功" :value="1" />
            <el-option label="支付失败" :value="2" />
            <el-option label="已关闭" :value="3" />
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
      <el-button type="primary" @click="handleCreateOrder">
        <el-icon><Plus /></el-icon>
        创建支付补单
      </el-button>
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
        <el-table-column prop="thirdTradeNo" label="三方单号" width="180" />
        <el-table-column prop="money" label="支付金额" width="120">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: 600;">{{ row.money }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="actualMoney" label="实际支付金额" width="120">
          <template #default="{ row }">
            <span style="color: #67c23a; font-weight: 600;">{{ row.actualMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fee" label="手续费" width="100" />
        <el-table-column prop="payerName" label="付款人名" width="120" />
        <el-table-column prop="typeName" label="支付类型" width="120" />
        <el-table-column prop="payStatus" label="支付状态" width="100">
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
        <el-table-column label="操作" fixed="right" width="400">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleViewDetail(row)">
              详情
            </el-button>
            <el-button
              v-if="row.payStatus === 0"
              type="success"
              link
              size="small"
              @click="handleCompletion(row)"
            >
              支付补单
            </el-button>
            <el-button
              v-if="row.payStatus === 0"
              type="danger"
              link
              size="small"
              @click="handleCloseOrder(row)"
            >
              关闭订单
            </el-button>
            <el-button
              v-if="row.payStatus === 1 && row.notificationStatus === 0"
              type="warning"
              link
              size="small"
              @click="handleNotify(row)"
            >
              回调商户
            </el-button>
            <el-button type="info" link size="small" @click="handleRefreshOrder(row)">
              刷新订单
            </el-button>
            <el-dropdown @command="(cmd) => handleMoreAction(cmd, row)">
              <el-button type="primary" link size="small">
                更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="disablePayerName">
                    禁用付款人
                  </el-dropdown-item>
                  <el-dropdown-item command="disableIp">
                    禁用请求IP
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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

    <!-- 创建支付补单对话框 -->
    <el-dialog
      v-model="createOrderDialogVisible"
      title="创建支付补单"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="createOrderFormRef"
        :model="createOrderForm"
        :rules="createOrderFormRules"
        label-width="120px"
      >
        <el-form-item label="商户ID" prop="merchantId">
          <el-input-number
            v-model="createOrderForm.merchantId"
            placeholder="请输入商户ID"
            :min="1"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="支付类型" prop="channelId">
          <el-select
            v-model="createOrderForm.channelId"
            placeholder="请选择支付类型"
            :loading="paymentTypeLoading"
            style="width: 100%"
          >
            <el-option
              v-for="item in paymentTypeList"
              :key="item.id"
              :label="`${item.name} (费率: ${item.rate}%)`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="充值金额" prop="money">
          <el-input-number
            v-model="createOrderForm.money"
            placeholder="请输入充值金额"
            :min="0"
            :precision="2"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="createOrderForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createOrderDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="createOrderLoading" @click="handleCreateOrderSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 支付补单对话框 -->
    <el-dialog
      v-model="completionDialogVisible"
      title="支付补单"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="completionFormRef"
        :model="completionForm"
        :rules="completionFormRules"
        label-width="120px"
      >
        <el-form-item label="订单ID">
          <el-input v-model="completionForm.orderId" disabled />
        </el-form-item>
        <el-form-item label="实际支付金额" prop="actualMoney">
          <el-input-number
            v-model="completionForm.actualMoney"
            placeholder="请输入实际支付金额"
            :min="0"
            :precision="2"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="completionForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="completionDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="completionLoading" @click="handleCompletionSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="订单详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单ID">{{ orderDetail.id }}</el-descriptions-item>
        <el-descriptions-item label="商户ID">{{ orderDetail.merchantId }}</el-descriptions-item>
        <el-descriptions-item label="商户编号">{{ orderDetail.merchantCode }}</el-descriptions-item>
        <el-descriptions-item label="商户账号">{{ orderDetail.merchantAccount }}</el-descriptions-item>
        <el-descriptions-item label="系统订单号">{{ orderDetail.tradeNo }}</el-descriptions-item>
        <el-descriptions-item label="商户订单号">{{ orderDetail.outTradeNo }}</el-descriptions-item>
        <el-descriptions-item label="三方单号">{{ orderDetail.thirdTradeNo }}</el-descriptions-item>
        <el-descriptions-item label="支付类型">{{ orderDetail.typeName }}</el-descriptions-item>
        <el-descriptions-item label="支付金额">
          <span style="color: #f56c6c; font-weight: 600;">{{ orderDetail.money }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="实际支付金额">
          <span style="color: #67c23a; font-weight: 600;">{{ orderDetail.actualMoney }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="手续费">{{ orderDetail.fee }}</el-descriptions-item>
        <el-descriptions-item label="付款人名">{{ orderDetail.payerName }}</el-descriptions-item>
        <el-descriptions-item label="支付状态">
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
  Plus,
  Download,
  Refresh,
  ArrowDown,
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import {
  getMerchantPaymentOrderList,
  exportMerchantPaymentOrderList,
  getMerchantPaymentOrderDetail,
  createMerchantPaymentOrder,
  completionMerchantPaymentOrder,
  closeMerchantPaymentOrder,
  notifyMerchantPaymentOrder,
  disableMerchantPaymentOrderPayerName,
  disableMerchantPaymentOrderRequestIp,
  refreshMerchantPaymentOrder,
  getMerchantPaymentTypes,
  type MerchantPaymentOrderParams,
  type CreateMerchantPaymentOrderParams,
  type CompletionMerchantPaymentOrderParams,
} from '@/api/merchant/payOrder'

// 搜索表单
const searchForm = reactive<Partial<MerchantPaymentOrderParams>>({
  pageNo: 1,
  pageSize: 10,
  username: '',
  orderNo: '',
  createdIp: '',
  payerName: '',
  typeId: '',
  channelId: '',
  createdTime: [],
  updatedTime: [],
  payStatus: undefined,
})

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)

// 支付类型列表
const paymentTypeList = ref<any[]>([])
const paymentTypeLoading = ref(false)

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
})

// 创建订单对话框
const createOrderDialogVisible = ref(false)
const createOrderFormRef = ref<FormInstance>()
const createOrderLoading = ref(false)
const createOrderForm = reactive<CreateMerchantPaymentOrderParams>({
  merchantId: 0,
  channelId: 0,
  money: 0,
  remark: '',
})

const createOrderFormRules: FormRules = {
  merchantId: [
    { required: true, message: '请输入商户ID', trigger: 'blur' },
  ],
  channelId: [
    { required: true, message: '请选择支付类型', trigger: 'change' },
  ],
  money: [
    { required: true, message: '请输入充值金额', trigger: 'blur' },
  ],
}

// 支付补单对话框
const completionDialogVisible = ref(false)
const completionFormRef = ref<FormInstance>()
const completionLoading = ref(false)
const completionForm = reactive<CompletionMerchantPaymentOrderParams & { orderId: number }>({
  orderId: 0,
  actualMoney: 0,
  remark: '',
})

const completionFormRules: FormRules = {
  actualMoney: [
    { required: true, message: '请输入实际支付金额', trigger: 'blur' },
  ],
}

// 订单详情对话框
const detailDialogVisible = ref(false)
const orderDetail = ref<any>({})

// 获取支付状态类型
const getPayStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    0: 'info',
    1: 'success',
    2: 'danger',
    3: 'warning',
  }
  return typeMap[status] || 'info'
}

// 获取支付状态文本
const getPayStatusText = (status: number) => {
  const textMap: Record<number, string> = {
    0: '待支付',
    1: '支付成功',
    2: '支付失败',
    3: '已关闭',
  }
  return textMap[status] || '未知'
}

// 获取支付类型列表
const fetchPaymentTypeList = async () => {
  try {
    paymentTypeLoading.value = true
    const res = await getMerchantPaymentTypes({
      pageNo: 1,
      pageSize: 100,
    })

    if (res.code === 0 && res.data) {
      // 只显示启用的支付类型
      paymentTypeList.value = res.data.records.filter((item: any) => item.status === 1)
    } else {
      paymentTypeList.value = []
    }
  } catch (error) {
    console.error('获取支付类型列表失败:', error)
    paymentTypeList.value = []
  } finally {
    paymentTypeLoading.value = false
  }
}

// 获取订单列表
const fetchOrderList = async () => {
  try {
    loading.value = true

    const params: MerchantPaymentOrderParams = {
      pageNo: pagination.current,
      pageSize: pagination.size,
      username: searchForm.username,
      orderNo: searchForm.orderNo,
      createdIp: searchForm.createdIp,
      payerName: searchForm.payerName,
      typeId: searchForm.typeId,
      channelId: searchForm.channelId,
      createdTime: searchForm.createdTime || [],
      updatedTime: searchForm.updatedTime,
      payStatus: searchForm.payStatus,
    }

    const res = await getMerchantPaymentOrderList(params)

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
    username: '',
    orderNo: '',
    createdIp: '',
    payerName: '',
    typeId: '',
    channelId: '',
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
    const params: MerchantPaymentOrderParams = {
      pageNo: pagination.current,
      pageSize: pagination.size,
      username: searchForm.username,
      orderNo: searchForm.orderNo,
      createdIp: searchForm.createdIp,
      payerName: searchForm.payerName,
      typeId: searchForm.typeId,
      channelId: searchForm.channelId,
      createdTime: searchForm.createdTime || [],
      updatedTime: searchForm.updatedTime,
      payStatus: searchForm.payStatus,
    }

    await exportMerchantPaymentOrderList(params)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请重试')
  }
}

// 创建支付补单
const handleCreateOrder = () => {
  Object.assign(createOrderForm, {
    merchantId: 0,
    channelId: 0,
    money: 0,
    remark: '',
  })
  createOrderDialogVisible.value = true
}

// 提交创建订单
const handleCreateOrderSubmit = async () => {
  if (!createOrderFormRef.value) return

  await createOrderFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        createOrderLoading.value = true

        const res = await createMerchantPaymentOrder(createOrderForm)

        if (res.code === 0) {
          ElMessage.success('创建成功')
          createOrderDialogVisible.value = false
          fetchOrderList()
        } else {
          ElMessage.error(res.msg || '创建失败')
        }
      } catch (error) {
        console.error('创建失败:', error)
        ElMessage.error('创建失败，请重试')
      } finally {
        createOrderLoading.value = false
      }
    }
  })
}

// 查看详情
const handleViewDetail = async (row: any) => {
  try {
    const res = await getMerchantPaymentOrderDetail({ id: row.id })

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

// 支付补单
const handleCompletion = (row: any) => {
  Object.assign(completionForm, {
    orderId: row.id,
    actualMoney: row.money,
    remark: '',
  })
  completionDialogVisible.value = true
}

// 提交支付补单
const handleCompletionSubmit = async () => {
  if (!completionFormRef.value) return

  await completionFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        completionLoading.value = true

        const res = await completionMerchantPaymentOrder({
          orderId: completionForm.orderId,
          actualMoney: completionForm.actualMoney,
          remark: completionForm.remark,
        })

        if (res.code === 0) {
          ElMessage.success('补单成功')
          completionDialogVisible.value = false
          fetchOrderList()
        } else {
          ElMessage.error(res.msg || '补单失败')
        }
      } catch (error) {
        console.error('补单失败:', error)
        ElMessage.error('补单失败，请重试')
      } finally {
        completionLoading.value = false
      }
    }
  })
}

// 关闭订单
const handleCloseOrder = (row: any) => {
  ElMessageBox.prompt('请输入关闭原因', '关闭订单', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'textarea',
    inputPlaceholder: '请输入关闭原因',
  }).then(async ({ value }) => {
    try {
      const res = await closeMerchantPaymentOrder({
        orderId: row.id,
        remark: value,
      })

      if (res.code === 0) {
        ElMessage.success('关闭成功')
        fetchOrderList()
      } else {
        ElMessage.error(res.msg || '关闭失败')
      }
    } catch (error) {
      console.error('关闭失败:', error)
      ElMessage.error('关闭失败，请重试')
    }
  }).catch(() => {
    // 用户取消
  })
}

// 回调商户
const handleNotify = async (row: any) => {
  try {
    const res = await notifyMerchantPaymentOrder({ orderId: row.id })

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

// 刷新订单
const handleRefreshOrder = async (row: any) => {
  try {
    const res = await refreshMerchantPaymentOrder({ tradeNo: row.tradeNo })

    if (res.code === 0 && res.data) {
      ElMessage.success('刷新成功')
      // 显示刷新后的信息
      ElMessageBox.alert(
        `
        <div>
          <p><strong>系统订单号:</strong> ${res.data.tradeNo}</p>
          <p><strong>三方单号:</strong> ${res.data.thirdTradeNo}</p>
          <p><strong>订单金额:</strong> ${res.data.money}</p>
          <p><strong>实际支付金额:</strong> ${res.data.actualMoney}</p>
          <p><strong>三方手续费:</strong> ${res.data.actualThirdFee}</p>
          <p><strong>支付状态:</strong> ${getPayStatusText(res.data.payStatus)}</p>
          <p><strong>三方返回信息:</strong> ${res.data.msg}</p>
        </div>
        `,
        '订单刷新结果',
        {
          dangerouslyUseHTMLString: true,
        }
      )
      fetchOrderList()
    } else {
      ElMessage.error(res.msg || '刷新失败')
    }
  } catch (error) {
    console.error('刷新失败:', error)
    ElMessage.error('刷新失败，请重试')
  }
}

// 更多操作
const handleMoreAction = async (command: string, row: any) => {
  if (command === 'disablePayerName') {
    ElMessageBox.confirm(
      `确定要禁用付款人 "${row.payerName}" 吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(async () => {
      try {
        const res = await disableMerchantPaymentOrderPayerName({
          payerName: row.payerName,
        })

        if (res.code === 0) {
          ElMessage.success('禁用成功')
        } else {
          ElMessage.error(res.msg || '禁用失败')
        }
      } catch (error) {
        console.error('禁用失败:', error)
        ElMessage.error('禁用失败，请重试')
      }
    }).catch(() => {
      // 用户取消
    })
  } else if (command === 'disableIp') {
    ElMessageBox.prompt('请输入要禁用的IP地址', '禁用请求IP', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入IP地址',
    }).then(async ({ value }) => {
      try {
        const res = await disableMerchantPaymentOrderRequestIp({
          ip: value,
        })

        if (res.code === 0) {
          ElMessage.success('禁用成功')
        } else {
          ElMessage.error(res.msg || '禁用失败')
        }
      } catch (error) {
        console.error('禁用失败:', error)
        ElMessage.error('禁用失败，请重试')
      }
    }).catch(() => {
      // 用户取消
    })
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
  fetchPaymentTypeList()
})
</script>

<style scoped>
.pay-order-page {
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
