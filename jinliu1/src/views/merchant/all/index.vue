<template>
  <div class="merchant-list-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">所有商户</h2>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="商户ID">
          <el-input
            v-model="searchForm.channelId"
            placeholder="请输入商户ID"
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
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加商户
      </el-button>
      <el-button type="warning" @click="handleAdjustRate">
        <el-icon><Setting /></el-icon>
        微调商户费率
      </el-button>

      <!-- 支付通道下拉按钮 -->
      <el-dropdown @command="handlePaymentChannelCommand">
        <el-button type="success">
          支付通道管理
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="view">
              <el-icon><View /></el-icon>
              已绑支付通道
            </el-dropdown-item>
            <el-dropdown-item command="bind">
              <el-icon><Link /></el-icon>
              绑定支付通道
            </el-dropdown-item>
            <el-dropdown-item command="unbind">
              <el-icon><Remove /></el-icon>
              解绑支付通道
            </el-dropdown-item>
            <el-dropdown-item command="switch">
              <el-icon><Sort /></el-icon>
              切换支付通道
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 代付通道下拉按钮 -->
      <el-dropdown @command="handlePayoutChannelCommand">
        <el-button type="info">
          代付通道管理
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="view">
              <el-icon><View /></el-icon>
              已绑代付通道
            </el-dropdown-item>
            <el-dropdown-item command="bind">
              <el-icon><Link /></el-icon>
              绑定代付通道
            </el-dropdown-item>
            <el-dropdown-item command="unbind">
              <el-icon><Remove /></el-icon>
              解绑代付通道
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

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
        <el-table-column prop="merchantId" label="商户ID" />
        <el-table-column prop="username" label="商户用户账号" />
        <el-table-column prop="currency" label="货币种类">
          <template #default="{ row }">
            <el-tag :type="getCurrencyType(row.currency)">
              {{ row.currency }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="绑定状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '已绑定' : '未绑定' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="warning" link size="small" @click="handleRate(row)">
              费率
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑商户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="商户ID" prop="merchantId">
          <el-input
            v-model="form.merchantId"
            placeholder="请输入商户ID"
            :disabled="isEdit"
          />
        </el-form-item>
        <el-form-item label="商户用户账号" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入商户用户账号"
          />
        </el-form-item>
        <el-form-item label="货币种类" prop="currency">
          <el-select v-model="form.currency" placeholder="请选择货币种类" style="width: 100%">
            <el-option label="USD" value="USD" />
            <el-option label="CNY" value="CNY" />
            <el-option label="EUR" value="EUR" />
            <el-option label="JPY" value="JPY" />
            <el-option label="GBP" value="GBP" />
          </el-select>
        </el-form-item>
        <el-form-item label="绑定状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">已绑定</el-radio>
            <el-radio :label="0">未绑定</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 微调费率对话框 -->
    <el-dialog
      v-model="rateDialogVisible"
      title="微调商户费率"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="rateFormRef"
        :model="rateForm"
        :rules="rateFormRules"
        label-width="100px"
      >
        <el-form-item label="商户ID" prop="channelId">
          <el-input v-model="rateForm.channelId" placeholder="请输入商户ID" />
        </el-form-item>
        <el-form-item label="费率调整" prop="rateAdjust">
          <el-input-number
            v-model="rateForm.rateAdjust"
            :min="0"
            :max="100"
            :precision="2"
            :step="0.01"
            style="width: 100%"
          />
          <span style="margin-left: 8px; color: #909399;">%</span>
        </el-form-item>
        <el-form-item label="调整原因" prop="reason">
          <el-input
            v-model="rateForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入调整原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rateDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="rateSubmitLoading" @click="handleRateSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 支付通道对话框 -->
    <el-dialog
      v-model="paymentChannelDialogVisible"
      :title="paymentChannelDialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="paymentChannelFormRef"
        :model="paymentChannelForm"
        :rules="paymentChannelFormRules"
        label-width="120px"
      >
        <el-form-item label="商户ID" prop="channelId">
          <el-input
            v-model="paymentChannelForm.channelId"
            placeholder="请输入商户ID"
          />
        </el-form-item>
        <el-form-item
          v-if="paymentChannelAction !== 'view'"
          label="支付通道"
          prop="channelId"
        >
          <el-select
            v-model="paymentChannelForm.channelId"
            placeholder="请选择支付通道"
            style="width: 100%"
          >
            <el-option label="支付宝" value="alipay" />
            <el-option label="微信支付" value="wechat" />
            <el-option label="银联" value="unionpay" />
            <el-option label="PayPal" value="paypal" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="paymentChannelAction === 'switch'"
          label="目标通道"
          prop="targetChannelId"
        >
          <el-select
            v-model="paymentChannelForm.targetChannelId"
            placeholder="请选择目标支付通道"
            style="width: 100%"
          >
            <el-option label="支付宝" value="alipay" />
            <el-option label="微信支付" value="wechat" />
            <el-option label="银联" value="unionpay" />
            <el-option label="PayPal" value="paypal" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="paymentChannelAction === 'view'" label="已绑通道">
          <el-tag
            v-for="channel in boundPaymentChannels"
            :key="channel"
            style="margin-right: 8px;"
            type="success"
          >
            {{ getChannelName(channel) }}
          </el-tag>
          <span v-if="boundPaymentChannels.length === 0" style="color: #909399;">
            暂无绑定通道
          </span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="paymentChannelDialogVisible = false">
          {{ paymentChannelAction === 'view' ? '关闭' : '取消' }}
        </el-button>
        <el-button
          v-if="paymentChannelAction !== 'view'"
          type="primary"
          :loading="paymentChannelSubmitLoading"
          @click="handlePaymentChannelSubmit"
        >
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 代付通道对话框 -->
    <el-dialog
      v-model="payoutChannelDialogVisible"
      :title="payoutChannelDialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="payoutChannelFormRef"
        :model="payoutChannelForm"
        :rules="payoutChannelFormRules"
        label-width="120px"
      >
        <el-form-item label="商户ID" prop="channelId">
          <el-input
            v-model="payoutChannelForm.channelId"
            placeholder="请输入商户ID"
          />
        </el-form-item>
        <el-form-item
          v-if="payoutChannelAction !== 'view'"
          label="代付通道"
          prop="channelId"
        >
          <el-select
            v-model="payoutChannelForm.channelId"
            placeholder="请选择代付通道"
            style="width: 100%"
          >
            <el-option label="银行转账" value="bank_transfer" />
            <el-option label="支付宝转账" value="alipay_transfer" />
            <el-option label="微信转账" value="wechat_transfer" />
            <el-option label="PayPal转账" value="paypal_transfer" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="payoutChannelAction === 'view'" label="已绑通道">
          <el-tag
            v-for="channel in boundPayoutChannels"
            :key="channel"
            style="margin-right: 8px;"
            type="info"
          >
            {{ getPayoutChannelName(channel) }}
          </el-tag>
          <span v-if="boundPayoutChannels.length === 0" style="color: #909399;">
            暂无绑定通道
          </span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="payoutChannelDialogVisible = false">
          {{ payoutChannelAction === 'view' ? '关闭' : '取消' }}
        </el-button>
        <el-button
          v-if="payoutChannelAction !== 'view'"
          type="primary"
          :loading="payoutChannelSubmitLoading"
          @click="handlePayoutChannelSubmit"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  RefreshLeft,
  Plus,
  Setting,
  Refresh,
  ArrowDown,
  View,
  Link,
  Remove,
  Sort,
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { getMerchantList } from '@/api/merchant'
import type { MerchantInfo } from '@/api/merchant'

// 搜索表单
const searchForm = reactive({
  channelId: '',
})

// 表格数据
const tableData = ref<MerchantInfo[]>([])
const allData = ref<MerchantInfo[]>([]) // 存储所有数据用于前端分页
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
})

// 添加/编辑对话框
const dialogVisible = ref(false)
const dialogTitle = ref('添加商户')
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const submitLoading = ref(false)

const form = reactive({
  merchantId: '',
  merchantAccount: '',
  currency: '',
  status: 0,
})

const formRules: FormRules = {
  merchantId: [
    { required: true, message: '请输入商户ID', trigger: 'blur' },
  ],
  username: [
    { required: true, message: '请输入商户用户账号', trigger: 'blur' },
  ],
  currency: [
    { required: true, message: '请选择货币种类', trigger: 'change' },
  ],
  status: [
    { required: true, message: '请选择绑定状态', trigger: 'change' },
  ],
}

// 费率调整对话框
const rateDialogVisible = ref(false)
const rateFormRef = ref<FormInstance>()
const rateSubmitLoading = ref(false)

const rateForm = reactive({
  channelId: '',
  rateAdjust: 0,
  reason: '',
})

const rateFormRules: FormRules = {
  channelId: [
    { required: true, message: '请输入商户ID', trigger: 'blur' },
  ],
  rateAdjust: [
    { required: true, message: '请输入费率调整值', trigger: 'blur' },
  ],
  reason: [
    { required: true, message: '请输入调整原因', trigger: 'blur' },
  ],
}

// 支付通道对话框
const paymentChannelDialogVisible = ref(false)
const paymentChannelDialogTitle = ref('支付通道管理')
const paymentChannelAction = ref('')
const paymentChannelFormRef = ref<FormInstance>()
const paymentChannelSubmitLoading = ref(false)
const boundPaymentChannels = ref<string[]>([])

const paymentChannelForm = reactive({
  channelId: '',
  channelId: '',
  targetChannelId: '',
})

const paymentChannelFormRules: FormRules = {
  channelId: [
    { required: true, message: '请输入商户ID', trigger: 'blur' },
  ],
  channelId: [
    { required: true, message: '请选择支付通道', trigger: 'change' },
  ],
  targetChannelId: [
    { required: true, message: '请选择目标支付通道', trigger: 'change' },
  ],
}

// 代付通道对话框
const payoutChannelDialogVisible = ref(false)
const payoutChannelDialogTitle = ref('代付通道管理')
const payoutChannelAction = ref('')
const payoutChannelFormRef = ref<FormInstance>()
const payoutChannelSubmitLoading = ref(false)
const boundPayoutChannels = ref<string[]>([])

const payoutChannelForm = reactive({
  channelId: '',
  channelId: '',
})

const payoutChannelFormRules: FormRules = {
  channelId: [
    { required: true, message: '请输入商户ID', trigger: 'blur' },
  ],
  channelId: [
    { required: true, message: '请选择代付通道', trigger: 'change' },
  ],
}

// 获取通道名称
const getChannelName = (channel: string) => {
  const nameMap: Record<string, string> = {
    alipay: '支付宝',
    wechat: '微信支付',
    unionpay: '银联',
    paypal: 'PayPal',
  }
  return nameMap[channel] || channel
}

const getPayoutChannelName = (channel: string) => {
  const nameMap: Record<string, string> = {
    bank_transfer: '银行转账',
    alipay_transfer: '支付宝转账',
    wechat_transfer: '微信转账',
    paypal_transfer: 'PayPal转账',
  }
  return nameMap[channel] || channel
}

// 获取货币标签类型
const getCurrencyType = (currency: string) => {
  const typeMap: Record<string, string> = {
    USD: 'success',
    CNY: 'danger',
    EUR: 'warning',
    JPY: 'info',
    GBP: 'primary',
  }
  return typeMap[currency] || ''
}

// 获取商户列表
const fetchMerchantList = async () => {
  // 验证必须输入商户ID
  if (!searchForm.channelId) {
    ElMessage.warning('请输入商户ID')
    return
  }

  try {
    loading.value = true

    const res = await getMerchantList({
      channelId: searchForm.channelId,
    })

    if (res.code === 0 && res.data) {
      // 假设后端返回的数据结构为 { code: 0, data: { list: [], total: 0 } }
      // 或者 { code: 0, data: [] }
      // 根据实际后端返回的数据结构调整
      if (Array.isArray(res.data)) {
        allData.value = res.data
      } else if (res.data.list) {
        allData.value = res.data.list
      } else {
        allData.value = []
      }

      // 重置到第一页
      pagination.page = 1
      pagination.total = allData.value.length

      // 更新当前页数据
      updatePageData()
    } else {
      allData.value = []
      tableData.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error('获取商户列表失败:', error)
    ElMessage.error('获取商户列表失败，请重试')
    allData.value = []
    tableData.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 更新当前页数据（前端分页）
const updatePageData = () => {
  const start = (pagination.page - 1) * pagination.size
  const end = start + pagination.size
  tableData.value = allData.value.slice(start, end)
}

// 搜索
const handleSearch = () => {
  fetchMerchantList()
}

// 重置
const handleReset = () => {
  searchForm.channelId = ''
  allData.value = []
  tableData.value = []
  pagination.total = 0
  pagination.page = 1
}

// 刷新
const handleRefresh = () => {
  if (!searchForm.channelId) {
    ElMessage.warning('请先输入商户ID进行搜索')
    return
  }
  fetchMerchantList()
  ElMessage.success('刷新成功')
}

// 条件刷新列表（在操作成功后调用，如果有搜索条件则刷新）
const refreshListIfNeeded = () => {
  if (searchForm.channelId) {
    fetchMerchantList()
  }
}

// 添加商户
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加商户'
  Object.assign(form, {
    channelId: '',
    merchantAccount: '',
    currency: '',
    status: 0,
  })
  dialogVisible.value = true
}

// 编辑商户
const handleEdit = (row: any) => {
  isEdit.value = true
  dialogTitle.value = '编辑商户'
  Object.assign(form, { ...row })
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        submitLoading.value = true

        // TODO: 调用实际的 API 接口
        // if (isEdit.value) {
        //   await updateMerchant(form)
        // } else {
        //   await createMerchant(form)
        // }

        setTimeout(() => {
          ElMessage.success(isEdit.value ? '编辑成功' : '添加成功')
          dialogVisible.value = false
          submitLoading.value = false
          refreshListIfNeeded()
        }, 500)
      } catch (error) {
        console.error('提交失败:', error)
        submitLoading.value = false
      }
    }
  })
}

// 微调商户费率
const handleAdjustRate = () => {
  Object.assign(rateForm, {
    channelId: '',
    rateAdjust: 0,
    reason: '',
  })
  rateDialogVisible.value = true
}

// 单个商户费率调整
const handleRate = (row: any) => {
  Object.assign(rateForm, {
    channelId: row.channelId,
    rateAdjust: 0,
    reason: '',
  })
  rateDialogVisible.value = true
}

// 提交费率调整
const handleRateSubmit = async () => {
  if (!rateFormRef.value) return

  await rateFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        rateSubmitLoading.value = true

        // TODO: 调用实际的 API 接口
        // await adjustMerchantRate(rateForm)

        setTimeout(() => {
          ElMessage.success('费率调整成功')
          rateDialogVisible.value = false
          rateSubmitLoading.value = false
          refreshListIfNeeded()
        }, 500)
      } catch (error) {
        console.error('费率调整失败:', error)
        rateSubmitLoading.value = false
      }
    }
  })
}

// 删除商户
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除商户 ${row.channelId} 吗？此操作不可�复！`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      // TODO: 调用实际的 API 接口
      // await deleteMerchant(row.channelId)

      ElMessage.success('删除成功')
      refreshListIfNeeded()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }).catch(() => {
    // 用户取消删除
  })
}

// 支付通道管理命令处理
const handlePaymentChannelCommand = (command: string) => {
  paymentChannelAction.value = command

  // 重置表单
  Object.assign(paymentChannelForm, {
    channelId: '',
    channelId: '',
    targetChannelId: '',
  })

  switch (command) {
    case 'view':
      paymentChannelDialogTitle.value = '已绑支付通道'
      // 模拟获取已绑定的通道
      boundPaymentChannels.value = ['alipay', 'wechat']
      break
    case 'bind':
      paymentChannelDialogTitle.value = '绑定支付通道'
      break
    case 'unbind':
      paymentChannelDialogTitle.value = '解绑支付通道'
      break
    case 'switch':
      paymentChannelDialogTitle.value = '切换支付通道'
      break
  }

  paymentChannelDialogVisible.value = true
}

// 提交支付通道操作
const handlePaymentChannelSubmit = async () => {
  if (!paymentChannelFormRef.value) return

  // 根据不同的操作类型验证不同的字段
  const fieldsToValidate: string[] = ['channelId']
  if (paymentChannelAction.value === 'switch') {
    fieldsToValidate.push('channelId', 'targetChannelId')
  } else {
    fieldsToValidate.push('channelId')
  }

  await paymentChannelFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        paymentChannelSubmitLoading.value = true

        // TODO: 调用实际的 API 接口
        // switch (paymentChannelAction.value) {
        //   case 'bind':
        //     await bindPaymentChannel(paymentChannelForm)
        //     break
        //   case 'unbind':
        //     await unbindPaymentChannel(paymentChannelForm)
        //     break
        //   case 'switch':
        //     await switchPaymentChannel(paymentChannelForm)
        //     break
        // }

        setTimeout(() => {
          const actionText = {
            bind: '绑定',
            unbind: '解绑',
            switch: '切换',
          }[paymentChannelAction.value] || '操作'

          ElMessage.success(`${actionText}支付通道成功`)
          paymentChannelDialogVisible.value = false
          paymentChannelSubmitLoading.value = false
          refreshListIfNeeded()
        }, 500)
      } catch (error) {
        console.error('支付通道操作失败:', error)
        paymentChannelSubmitLoading.value = false
      }
    }
  })
}

// 代付通道管理命令处理
const handlePayoutChannelCommand = (command: string) => {
  payoutChannelAction.value = command

  // 重置表单
  Object.assign(payoutChannelForm, {
    channelId: '',
    channelId: '',
  })

  switch (command) {
    case 'view':
      payoutChannelDialogTitle.value = '已绑代付通道'
      // 模拟获取已绑定的通道
      boundPayoutChannels.value = ['bank_transfer', 'alipay_transfer']
      break
    case 'bind':
      payoutChannelDialogTitle.value = '绑定代付通道'
      break
    case 'unbind':
      payoutChannelDialogTitle.value = '解绑代付通道'
      break
  }

  payoutChannelDialogVisible.value = true
}

// 提交代付通道操作
const handlePayoutChannelSubmit = async () => {
  if (!payoutChannelFormRef.value) return

  await payoutChannelFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        payoutChannelSubmitLoading.value = true

        // TODO: 调用实际的 API 接口
        // switch (payoutChannelAction.value) {
        //   case 'bind':
        //     await bindPayoutChannel(payoutChannelForm)
        //     break
        //   case 'unbind':
        //     await unbindPayoutChannel(payoutChannelForm)
        //     break
        // }

        setTimeout(() => {
          const actionText = {
            bind: '绑定',
            unbind: '解绑',
          }[payoutChannelAction.value] || '操作'

          ElMessage.success(`${actionText}代付通道成功`)
          payoutChannelDialogVisible.value = false
          payoutChannelSubmitLoading.value = false
          refreshListIfNeeded()
        }, 500)
      } catch (error) {
        console.error('代付通道操作失败:', error)
        payoutChannelSubmitLoading.value = false
      }
    }
  })
}

// 分页变化
const handleSizeChange = () => {
  pagination.page = 1
  updatePageData()
}

const handleCurrentChange = () => {
  updatePageData()
}
</script>

<style scoped>
.merchant-list-page {
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

.action-card :deep(.el-dropdown) {
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
  margin-bottom: 0;
}
</style>
