<template>
  <div class="agent-recharge-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">代付充值管理</h2>
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
        <el-form-item label="充值状态">
          <el-select
            v-model="searchForm.payStatus"
            placeholder="请选择充值状态"
            clearable
            style="width: 200px"
          >
            <el-option label="待充值" :value="1" />
            <el-option label="已充值" :value="2" />
            <el-option label="已驳回" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序方式">
          <el-select
            v-model="searchForm.sortType"
            placeholder="请选择排序方式"
            clearable
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
        <el-form-item label="处理时间">
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
        <el-table-column prop="tradeNo" label="平台订单号" width="180" />
        <el-table-column prop="currency" label="货币种类" width="100">
          <template #default="{ row }">
            <el-tag :type="getCurrencyTagType(row.currency)">
              {{ getCurrencyText(row.currency) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="actualMoney" label="实际打款金额" width="120">
          <template #default="{ row }">
            <span style="color: #67c23a; font-weight: 600;">{{ row.actualMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fee" label="手续费" width="100" />
        <el-table-column prop="bankName" label="银行名称" width="150" />
        <el-table-column prop="realName" label="开户姓名" width="100" />
        <el-table-column prop="bankNumber" label="银行卡号" width="180" />
        <el-table-column prop="bankAddress" label="开户网点" width="200" show-overflow-tooltip />
        <el-table-column prop="payStatus" label="代充状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getPayStatusType(row.payStatus)">
              {{ getPayStatusText(row.payStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdTime" label="创建时间" width="160" />
        <el-table-column prop="confirmTime" label="确认时间" width="160" />
        <el-table-column prop="completeTime" label="完成时间" width="160" />
        <el-table-column label="操作" fixed="right" width="350">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleViewDetail(row)">
              详情
            </el-button>
            <el-button
              v-if="row.payStatus === 1"
              type="success"
              link
              size="small"
              @click="handleAssignBankCard(row)"
            >
              分配银行卡
            </el-button>
            <el-button
              v-if="row.payStatus === 1"
              type="warning"
              link
              size="small"
              @click="handleManualSuccess(row)"
            >
              手动成功
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
      title="代付充值订单详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单ID">{{ orderDetail.id }}</el-descriptions-item>
        <el-descriptions-item label="商户ID">{{ orderDetail.merchantId }}</el-descriptions-item>
        <el-descriptions-item label="商户编号">{{ orderDetail.merchantCode }}</el-descriptions-item>
        <el-descriptions-item label="商户账号">{{ orderDetail.merchantAccount }}</el-descriptions-item>
        <el-descriptions-item label="平台订单号">{{ orderDetail.tradeNo }}</el-descriptions-item>
        <el-descriptions-item label="货币种类">
          <el-tag :type="getCurrencyTagType(orderDetail.currency)">
            {{ getCurrencyText(orderDetail.currency) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="实际打款金额">
          <span style="color: #67c23a; font-weight: 600;">{{ orderDetail.actualMoney }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="手续费">{{ orderDetail.fee }}</el-descriptions-item>
        <el-descriptions-item label="银行名称">{{ orderDetail.bankName }}</el-descriptions-item>
        <el-descriptions-item label="开户姓名">{{ orderDetail.realName }}</el-descriptions-item>
        <el-descriptions-item label="银行卡号">{{ orderDetail.bankNumber }}</el-descriptions-item>
        <el-descriptions-item label="开户网点" :span="2">{{ orderDetail.bankAddress }}</el-descriptions-item>
        <el-descriptions-item label="代充状态">
          <el-tag :type="getPayStatusType(orderDetail.payStatus)">
            {{ getPayStatusText(orderDetail.payStatus) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ orderDetail.createdTime }}</el-descriptions-item>
        <el-descriptions-item label="确认时间">{{ orderDetail.confirmTime }}</el-descriptions-item>
        <el-descriptions-item label="完成时间">{{ orderDetail.completeTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button type="primary" @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 分配银行卡对话框 -->
    <el-dialog
      v-model="assignBankCardDialogVisible"
      title="分配银行卡"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="assignBankCardFormRef"
        :model="assignBankCardForm"
        :rules="assignBankCardFormRules"
        label-width="140px"
      >
        <el-form-item label="订单ID">
          <el-input v-model="assignBankCardForm.orderId" disabled />
        </el-form-item>
        <el-form-item label="代充银行ID" prop="bankId">
          <el-input-number
            v-model="assignBankCardForm.bankId"
            placeholder="请输入代充银行ID"
            :min="1"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="代付开户姓名" prop="realName">
          <el-input
            v-model="assignBankCardForm.realName"
            placeholder="请输入代付开户姓名"
          />
        </el-form-item>
        <el-form-item label="银行卡号/钱包地址" prop="bankNumber">
          <el-input
            v-model="assignBankCardForm.bankNumber"
            placeholder="请输入银行卡号或数字钱包地址"
          />
        </el-form-item>
        <el-form-item label="银行开户网点" prop="bankAddress">
          <el-input
            v-model="assignBankCardForm.bankAddress"
            type="textarea"
            :rows="3"
            placeholder="请输入银行开户网点"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignBankCardDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="assignBankCardLoading" @click="handleAssignBankCardSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 手动成功对话框 -->
    <el-dialog
      v-model="manualSuccessDialogVisible"
      title="手动成功"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="manualSuccessFormRef"
        :model="manualSuccessForm"
        :rules="manualSuccessFormRules"
        label-width="140px"
      >
        <el-form-item label="订单ID">
          <el-input v-model="manualSuccessForm.orderId" disabled />
        </el-form-item>
        <el-form-item label="实际支付数量" prop="actualMoney">
          <el-input-number
            v-model="manualSuccessForm.actualMoney"
            placeholder="请输入实际支付数量"
            :min="0"
            :precision="2"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="差价利润" prop="priceDiffProfit">
          <el-input-number
            v-model="manualSuccessForm.priceDiffProfit"
            placeholder="请输入差价利润"
            :precision="2"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="财务备注" prop="remark">
          <el-input
            v-model="manualSuccessForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入财务备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="manualSuccessDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="manualSuccessLoading" @click="handleManualSuccessSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 手动驳回对话框 -->
    <el-dialog
      v-model="manualRejectDialogVisible"
      title="手动驳回"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="manualRejectFormRef"
        :model="manualRejectForm"
        :rules="manualRejectFormRules"
        label-width="140px"
      >
        <el-form-item label="订单ID">
          <el-input v-model="manualRejectForm.orderId" disabled />
        </el-form-item>
        <el-form-item label="备注类型" prop="remarkType">
          <el-select v-model="manualRejectForm.remarkType" placeholder="请选择备注类型" style="width: 100%">
            <el-option label="系统备注" :value="1" />
            <el-option label="在线客服" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="财务备注" prop="remark">
          <el-input
            v-model="manualRejectForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入财务备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="manualRejectDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="manualRejectLoading" @click="handleManualRejectSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Search,
  RefreshLeft,
  Download,
  Refresh,
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import {
  getMerchantAgentRechargeList,
  getMerchantAgentRechargeExport,
  getMerchantAgentRechargeDetail,
  getMerchantAgentRechargeManualSuccess,
  getMerchantAgentRechargeManualReject,
  getMerchantAgentRechargeAssignBankCard,
  type MerchantPayoutBankParams,
} from '@/api/merchant/agentRecharge'

// 搜索表单
const searchForm = reactive<Partial<MerchantPayoutBankParams>>({
  pageNo: 1,
  pageSize: 10,
  merchantAccount: '',
  payStatus: undefined,
  sortType: undefined,
  createdTime: [],
  updatedTime: [],
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

// 分配银行卡对话框
const assignBankCardDialogVisible = ref(false)
const assignBankCardFormRef = ref<FormInstance>()
const assignBankCardLoading = ref(false)
const assignBankCardForm = reactive({
  orderId: 0,
  bankId: 0,
  realName: '',
  bankNumber: '',
  bankAddress: '',
})

const assignBankCardFormRules: FormRules = {
  bankId: [
    { required: true, message: '请输入代充银行ID', trigger: 'blur' },
  ],
  realName: [
    { required: true, message: '请输入代付开户姓名', trigger: 'blur' },
  ],
  bankNumber: [
    { required: true, message: '请输入银行卡号或数字钱包地址', trigger: 'blur' },
  ],
  bankAddress: [
    { required: true, message: '请输入银行开户网点', trigger: 'blur' },
  ],
}

// 手动成功对话框
const manualSuccessDialogVisible = ref(false)
const manualSuccessFormRef = ref<FormInstance>()
const manualSuccessLoading = ref(false)
const manualSuccessForm = reactive({
  orderId: 0,
  actualMoney: 0,
  priceDiffProfit: 0,
  remark: '',
})

const manualSuccessFormRules: FormRules = {
  actualMoney: [
    { required: true, message: '请输入实际支付数量', trigger: 'blur' },
  ],
  priceDiffProfit: [
    { required: true, message: '请输入差价利润', trigger: 'blur' },
  ],
  remark: [
    { required: true, message: '请输入财务备注', trigger: 'blur' },
  ],
}

// 手动驳回对话框
const manualRejectDialogVisible = ref(false)
const manualRejectFormRef = ref<FormInstance>()
const manualRejectLoading = ref(false)
const manualRejectForm = reactive({
  orderId: 0,
  remarkType: 1,
  remark: '',
})

const manualRejectFormRules: FormRules = {
  remarkType: [
    { required: true, message: '请选择备注类型', trigger: 'change' },
  ],
  remark: [
    { required: true, message: '请输入财务备注', trigger: 'blur' },
  ],
}

// 获取货币文本
const getCurrencyText = (currency: string) => {
  const currencyMap: Record<string, string> = {
    CNY: '人民币',
    THB: '泰铢',
    INR: '印度卢比',
    PHP: '披索',
    IDR: '印尼盾',
  }
  return currencyMap[currency] || currency
}

// 获取货币标签类型
const getCurrencyTagType = (currency: string) => {
  const typeMap: Record<string, string> = {
    CNY: 'danger',
    THB: 'success',
    INR: 'warning',
    PHP: 'info',
    IDR: 'primary',
  }
  return typeMap[currency] || ''
}

// 获取代充状态类型
const getPayStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    1: 'warning',
    2: 'success',
    3: 'danger',
  }
  return typeMap[status] || 'info'
}

// 获取代充状态文本
const getPayStatusText = (status: number) => {
  const textMap: Record<number, string> = {
    1: '待充值',
    2: '已充值',
    3: '已驳回',
  }
  return textMap[status] || '未知'
}

// 获取订单列表
const fetchOrderList = async () => {
  try {
    loading.value = true

    const params: MerchantPayoutBankParams = {
      pageNo: pagination.current,
      pageSize: pagination.size,
      merchantAccount: searchForm.merchantAccount,
      payStatus: searchForm.payStatus,
      sortType: searchForm.sortType,
      createdTime: searchForm.createdTime || [],
      updatedTime: searchForm.updatedTime,
    }

    const res = await getMerchantAgentRechargeList(params)

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
    payStatus: undefined,
    sortType: undefined,
    createdTime: [],
    updatedTime: [],
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
      pageNo: pagination.current,
      pageSize: pagination.size,
      merchantAccount: searchForm.merchantAccount,
      payStatus: searchForm.payStatus,
      sortType: searchForm.sortType,
      createdTime: searchForm.createdTime || [],
      updatedTime: searchForm.updatedTime,
    }

    await getMerchantAgentRechargeExport(params)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请重试')
  }
}

// 查看详情
const handleViewDetail = async (row: any) => {
  try {
    const res = await getMerchantAgentRechargeDetail({ id: row.id })

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

// 分配银行卡
const handleAssignBankCard = (row: any) => {
  Object.assign(assignBankCardForm, {
    orderId: row.id,
    bankId: 0,
    realName: '',
    bankNumber: '',
    bankAddress: '',
  })
  assignBankCardDialogVisible.value = true
}

// 提交分配银行卡
const handleAssignBankCardSubmit = async () => {
  if (!assignBankCardFormRef.value) return

  await assignBankCardFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        assignBankCardLoading.value = true

        const res = await getMerchantAgentRechargeAssignBankCard(assignBankCardForm)

        if (res.code === 0) {
          ElMessage.success('分配成功')
          assignBankCardDialogVisible.value = false
          fetchOrderList()
        } else {
          ElMessage.error(res.msg || '分配失败')
        }
      } catch (error) {
        console.error('分配失败:', error)
        ElMessage.error('分配失败，请重试')
      } finally {
        assignBankCardLoading.value = false
      }
    }
  })
}

// 手动成功
const handleManualSuccess = (row: any) => {
  Object.assign(manualSuccessForm, {
    orderId: row.id,
    actualMoney: row.actualMoney || 0,
    priceDiffProfit: 0,
    remark: '',
  })
  manualSuccessDialogVisible.value = true
}

// 提交手动成功
const handleManualSuccessSubmit = async () => {
  if (!manualSuccessFormRef.value) return

  await manualSuccessFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        manualSuccessLoading.value = true

        const res = await getMerchantAgentRechargeManualSuccess(manualSuccessForm)

        if (res.code === 0) {
          ElMessage.success('操作成功')
          manualSuccessDialogVisible.value = false
          fetchOrderList()
        } else {
          ElMessage.error(res.msg || '操作失败')
        }
      } catch (error) {
        console.error('操作失败:', error)
        ElMessage.error('操作失败，请重试')
      } finally {
        manualSuccessLoading.value = false
      }
    }
  })
}

// 手动驳回
const handleManualReject = (row: any) => {
  Object.assign(manualRejectForm, {
    orderId: row.id,
    remarkType: 1,
    remark: '',
  })
  manualRejectDialogVisible.value = true
}

// 提交手动驳回
const handleManualRejectSubmit = async () => {
  if (!manualRejectFormRef.value) return

  await manualRejectFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        manualRejectLoading.value = true

        const res = await getMerchantAgentRechargeManualReject(manualRejectForm)

        if (res.code === 0) {
          ElMessage.success('驳回成功')
          manualRejectDialogVisible.value = false
          fetchOrderList()
        } else {
          ElMessage.error(res.msg || '驳回失败')
        }
      } catch (error) {
        console.error('驳回失败:', error)
        ElMessage.error('驳回失败，请重试')
      } finally {
        manualRejectLoading.value = false
      }
    }
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
.agent-recharge-page {
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
