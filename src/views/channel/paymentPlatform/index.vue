<template>
  <div class="payment-platform-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">支付平台管理</h2>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="平台名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入平台名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
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
        <el-button type="success" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          添加平台
        </el-button>
      </div>
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
        <el-table-column prop="id" label="ID" width="80" />

        <!-- 平台名称 - 可编辑 -->
        <el-table-column label="平台名称" width="180">
          <template #default="{ row }">
            <div
              v-if="editingCell.id === row.id && editingCell.field === 'name'"
              class="editable-cell-input"
            >
              <el-input
                ref="nameInputRef"
                v-model="editingCell.value"
                size="small"
                @blur="handleSaveEdit(row, 'name')"
                @keyup.enter="handleSaveEdit(row, 'name')"
                @keyup.esc="handleCancelEdit"
              />
            </div>
            <div
              v-else
              class="editable-cell"
              @dblclick="handleStartEdit(row, 'name', row.name)"
            >
              {{ row.name }}
              <el-icon class="edit-icon"><Edit /></el-icon>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="code" label="平台代码" width="120" />
        <el-table-column label="下发费率" width="120" align="right">
          <template #default="{ row }">
            {{ (row.distributeRate * 100).toFixed(2) }}%
          </template>
        </el-table-column>
        <el-table-column label="平台余额" width="140" align="right">
          <template #default="{ row }">
            {{ row.balance?.toFixed(2) }}
          </template>
        </el-table-column>

        <!-- 余额上限 - 可编辑 -->
        <el-table-column label="余额上限" width="160" align="right">
          <template #default="{ row }">
            <div
              v-if="editingCell.id === row.id && editingCell.field === 'balanceMax'"
              class="editable-cell-input"
            >
              <el-input-number
                ref="balanceMaxInputRef"
                v-model="editingCell.value"
                size="small"
                :min="0"
                :precision="2"
                :controls="false"
                style="width: 100%"
                @blur="handleSaveEdit(row, 'balanceMax')"
                @keyup.enter="handleSaveEdit(row, 'balanceMax')"
                @keyup.esc="handleCancelEdit"
              />
            </div>
            <div
              v-else
              class="editable-cell"
              @dblclick="handleStartEdit(row, 'balanceMax', row.balanceMax)"
            >
              {{ row.balanceMax?.toFixed(2) }}
              <el-icon class="edit-icon"><Edit /></el-icon>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="三方余额" width="140" align="right">
          <template #default="{ row }">
            {{ row.thirdBalance?.toFixed(2) }}
          </template>
        </el-table-column>

        <!-- 上游押金 - 可编辑 -->
        <el-table-column label="上游押金" width="160" align="right">
          <template #default="{ row }">
            <div
              v-if="editingCell.id === row.id && editingCell.field === 'upstreamDeposit'"
              class="editable-cell-input"
            >
              <el-input-number
                ref="depositInputRef"
                v-model="editingCell.value"
                size="small"
                :min="0"
                :precision="2"
                :controls="false"
                style="width: 100%"
                @blur="handleSaveEdit(row, 'upstreamDeposit')"
                @keyup.enter="handleSaveEdit(row, 'upstreamDeposit')"
                @keyup.esc="handleCancelEdit"
              />
            </div>
            <div
              v-else
              class="editable-cell"
              @dblclick="handleStartEdit(row, 'upstreamDeposit', row.upstreamDeposit)"
            >
              {{ row.upstreamDeposit?.toFixed(2) }}
              <el-icon class="edit-icon"><Edit /></el-icon>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 排序 - 可编辑 -->
        <el-table-column label="排序" width="120">
          <template #default="{ row }">
            <div
              v-if="editingCell.id === row.id && editingCell.field === 'sort'"
              class="editable-cell-input"
            >
              <el-input-number
                ref="sortInputRef"
                v-model="editingCell.value"
                size="small"
                :min="0"
                :controls="false"
                style="width: 100%"
                @blur="handleSaveEdit(row, 'sort')"
                @keyup.enter="handleSaveEdit(row, 'sort')"
                @keyup.esc="handleCancelEdit"
              />
            </div>
            <div
              v-else
              class="editable-cell"
              @dblclick="handleStartEdit(row, 'sort', row.sort)"
            >
              {{ row.sort }}
              <el-icon class="edit-icon"><Edit /></el-icon>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleDetail(row)">
              查看
            </el-button>
            <el-button type="warning" link size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="info" link size="small" @click="handleQueryBalance(row)">
              查余额
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

    <!-- 添加/编辑平台对话框 -->
    <el-dialog
      v-model="platformDialogVisible"
      :title="isEdit ? '编辑支付平台' : '添加支付平台'"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="platformFormRef"
        :model="platformForm"
        :rules="platformFormRules"
        label-width="120px"
      >
        <el-form-item label="平台名称" prop="name">
          <el-input v-model="platformForm.name" placeholder="请输入平台名称" />
        </el-form-item>
        <el-form-item label="平台代码" prop="code">
          <el-input v-model="platformForm.code" placeholder="请输入平台代码" />
        </el-form-item>
        <el-form-item label="下发费率" prop="distributeRate">
          <el-input-number
            v-model="platformForm.distributeRate"
            :min="0"
            :max="1"
            :precision="4"
            :step="0.0001"
            style="width: 100%"
          />
          <span style="margin-left: 8px; color: #909399;">（0-1之间，如：0.05 表示 5%）</span>
        </el-form-item>
        <el-form-item label="余额上限" prop="balanceMax">
          <el-input-number
            v-model="platformForm.balanceMax"
            :min="0"
            :precision="2"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="上游押金" prop="upstreamDeposit">
          <el-input-number
            v-model="platformForm.upstreamDeposit"
            :min="0"
            :precision="2"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="商户账号" prop="merchantAccount">
          <el-input v-model="platformForm.merchantAccount" placeholder="请输入商户账号" />
        </el-form-item>
        <el-form-item label="商户密钥" prop="merchantKey">
          <el-input
            v-model="platformForm.merchantKey"
            type="textarea"
            :rows="2"
            placeholder="请输入商户密钥"
          />
        </el-form-item>
        <el-form-item label="扩展密钥1" prop="extendedKey1">
          <el-input v-model="platformForm.extendedKey1" placeholder="请输入扩展密钥1（选填）" />
        </el-form-item>
        <el-form-item label="扩展密钥2" prop="extendedKey2">
          <el-input v-model="platformForm.extendedKey2" placeholder="请输入扩展密钥2（选填）" />
        </el-form-item>
        <el-form-item label="扩展密钥3" prop="extendedKey3">
          <el-input v-model="platformForm.extendedKey3" placeholder="请输入扩展密钥3（选填）" />
        </el-form-item>
        <el-form-item label="网关接口" prop="createOrderUrl">
          <el-input v-model="platformForm.createOrderUrl" placeholder="请输入网关接口URL" />
        </el-form-item>
        <el-form-item label="查询接口" prop="queryOrderUrl">
          <el-input v-model="platformForm.queryOrderUrl" placeholder="请输入查询接口URL" />
        </el-form-item>
        <el-form-item label="余额接口" prop="queryBalanceUrl">
          <el-input v-model="platformForm.queryBalanceUrl" placeholder="请输入余额接口URL" />
        </el-form-item>
        <el-form-item label="白名单IP" prop="whitelistedIp">
          <el-input
            v-model="platformForm.whitelistedIp"
            type="textarea"
            :rows="2"
            placeholder="请输入白名单IP，多个用逗号分隔"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="platformDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handlePlatformSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="支付平台详情"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-descriptions :column="2" border v-if="detailData">
        <el-descriptions-item label="ID">{{ detailData.id }}</el-descriptions-item>
        <el-descriptions-item label="平台名称">{{ detailData.name }}</el-descriptions-item>
        <el-descriptions-item label="平台代码">{{ detailData.code }}</el-descriptions-item>
        <el-descriptions-item label="下发费率">{{ (detailData.distributeRate * 100).toFixed(2) }}%</el-descriptions-item>
        <el-descriptions-item label="平台余额">{{ detailData.balance?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="余额上限">{{ detailData.balanceMax?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="三方余额">{{ detailData.thirdBalance?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="上游押金">{{ detailData.upstreamDeposit?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="商户账号" :span="2">{{ detailData.merchantAccount }}</el-descriptions-item>
        <el-descriptions-item label="商户密钥" :span="2">
          <div style="word-break: break-all;">{{ detailData.merchantKey }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="扩展密钥1" :span="2">{{ detailData.extendedKey1 }}</el-descriptions-item>
        <el-descriptions-item label="扩展密钥2" :span="2">{{ detailData.extendedKey2 }}</el-descriptions-item>
        <el-descriptions-item label="扩展密钥3" :span="2">{{ detailData.extendedKey3 }}</el-descriptions-item>
        <el-descriptions-item label="网关接口" :span="2">
          <div style="word-break: break-all;">{{ detailData.createOrderUrl }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="查询接口" :span="2">
          <div style="word-break: break-all;">{{ detailData.queryOrderUrl }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="余额接口" :span="2">
          <div style="word-break: break-all;">{{ detailData.queryBalanceUrl }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="白名单IP" :span="2">
          <div style="word-break: break-all;">{{ detailData.whitelistedIp }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="detailData.status === 1 ? 'success' : 'danger'">
            {{ detailData.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="排序">{{ detailData.sort }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  RefreshLeft,
  Refresh,
  Plus,
  Edit,
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import {
  getPaymentPlatformList,
  getPaymentPlatformDetail,
  addPaymentPlatform,
  editPaymentPlatform,
  deletePaymentPlatform,
  editPaymentPlatformName,
  editPaymentPlatformBalanceMax,
  editPaymentPlatformUpstreamDeposit,
  editPaymentPlatformSort,
  queryThirdBalance,
} from '@/api/channel/paymentPlatform'
import type {
  paymentPlatformListParams,
  paymentPlatformAddParams,
} from '@/api/channel/paymentPlatform'

// 搜索表单
const searchForm = reactive<Partial<paymentPlatformListParams>>({
  name: '',
  sortType: undefined,
})

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
})

// 编辑单元格
const editingCell = reactive({
  id: null as number | null,
  field: '',
  value: '' as any,
})

// 输入框引用
const nameInputRef = ref<any>()
const balanceMaxInputRef = ref<any>()
const depositInputRef = ref<any>()
const sortInputRef = ref<any>()

// 平台对话框
const platformDialogVisible = ref(false)
const isEdit = ref(false)
const platformFormRef = ref<FormInstance>()
const submitLoading = ref(false)

const platformForm = reactive<paymentPlatformAddParams>({
  id: undefined,
  name: '',
  code: '',
  distributeRate: 0,
  balanceMax: 0,
  upstreamDeposit: 0,
  merchantAccount: '',
  merchantKey: '',
  extendedKey1: '',
  extendedKey2: '',
  extendedKey3: '',
  createOrderUrl: '',
  queryOrderUrl: '',
  queryBalanceUrl: '',
  whitelistedIp: '',
})

const platformFormRules: FormRules = {
  name: [{ required: true, message: '请输入平台名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入平台代码', trigger: 'blur' }],
  distributeRate: [{ required: true, message: '请输入下发费率', trigger: 'blur' }],
  balanceMax: [{ required: true, message: '请输入余额上限', trigger: 'blur' }],
  upstreamDeposit: [{ required: true, message: '请输入上游押金', trigger: 'blur' }],
  merchantAccount: [{ required: true, message: '请输入商户账号', trigger: 'blur' }],
  merchantKey: [{ required: true, message: '请输入商户密钥', trigger: 'blur' }],
  createOrderUrl: [{ required: true, message: '请输入网关接口URL', trigger: 'blur' }],
  queryOrderUrl: [{ required: true, message: '请输入查询接口URL', trigger: 'blur' }],
  queryBalanceUrl: [{ required: true, message: '请输入余额接口URL', trigger: 'blur' }],
}

// 详情对话框
const detailDialogVisible = ref(false)
const detailData = ref<any>(null)

// 获取列表
const fetchList = async () => {
  try {
    loading.value = true

    const params: paymentPlatformListParams = {
      pageNo: pagination.pageNo,
      pageSize: pagination.pageSize,
      ...searchForm,
    }

    const res = await getPaymentPlatformList(params)

    if (res.code === 0 && res.data) {
      tableData.value = res.data.records || []
      pagination.total = res.data.total || 0
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

// 搜索
const handleSearch = () => {
  pagination.pageNo = 1
  fetchList()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    name: '',
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

// 添加平台
const handleAdd = () => {
  isEdit.value = false
  Object.assign(platformForm, {
    id: undefined,
    name: '',
    code: '',
    distributeRate: 0,
    balanceMax: 0,
    upstreamDeposit: 0,
    merchantAccount: '',
    merchantKey: '',
    extendedKey1: '',
    extendedKey2: '',
    extendedKey3: '',
    createOrderUrl: '',
    queryOrderUrl: '',
    queryBalanceUrl: '',
    whitelistedIp: '',
  })
  platformDialogVisible.value = true
}

// 编辑平台
const handleEdit = async (row: any) => {
  try {
    // 先获取详情
    const res = await getPaymentPlatformDetail({ id: row.id })
    if (res.code === 0 && res.data) {
      isEdit.value = true
      Object.assign(platformForm, res.data)
      platformDialogVisible.value = true
    } else {
      ElMessage.error(res.msg || '获取详情失败')
    }
  } catch (error) {
    console.error('获取详情失败:', error)
    ElMessage.error('获取详情失败，请重试')
  }
}

// 提交平台表单
const handlePlatformSubmit = async () => {
  if (!platformFormRef.value) return

  await platformFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        submitLoading.value = true

        const apiFunc = isEdit.value ? editPaymentPlatform : addPaymentPlatform
        const res = await apiFunc(platformForm)

        if (res.code === 0) {
          ElMessage.success(isEdit.value ? '编辑成功' : '添加成功')
          platformDialogVisible.value = false
          fetchList()
        } else {
          ElMessage.error(res.msg || '操作失败')
        }
      } catch (error) {
        console.error('操作失败:', error)
        ElMessage.error('操作失败，请重试')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 开始编辑单元格
const handleStartEdit = (row: any, field: string, value: any) => {
  editingCell.id = row.id
  editingCell.field = field
  editingCell.value = value

  // 自动聚焦输入框
  nextTick(() => {
    if (field === 'name' && nameInputRef.value) {
      nameInputRef.value.focus()
    } else if (field === 'balanceMax' && balanceMaxInputRef.value) {
      balanceMaxInputRef.value.focus()
    } else if (field === 'upstreamDeposit' && depositInputRef.value) {
      depositInputRef.value.focus()
    } else if (field === 'sort' && sortInputRef.value) {
      sortInputRef.value.focus()
    }
  })
}

// 取消编辑
const handleCancelEdit = () => {
  editingCell.id = null
  editingCell.field = ''
  editingCell.value = ''
}

// 保存编辑
const handleSaveEdit = async (row: any, field: string) => {
  // 如果值没有变化，直接取消编辑
  if (editingCell.value === row[field]) {
    handleCancelEdit()
    return
  }

  // 验证不能为空（数字字段可以为0）
  if (field === 'name' && !editingCell.value.trim()) {
    ElMessage.warning('内容不能为空')
    return
  }

  try {
    let res: any

    if (field === 'name') {
      res = await editPaymentPlatformName({
        id: row.id,
        name: editingCell.value,
      })
    } else if (field === 'balanceMax') {
      res = await editPaymentPlatformBalanceMax({
        id: row.id,
        balanceMax: editingCell.value,
      })
    } else if (field === 'upstreamDeposit') {
      res = await editPaymentPlatformUpstreamDeposit({
        id: row.id,
        upstreamDeposit: editingCell.value,
      })
    } else if (field === 'sort') {
      res = await editPaymentPlatformSort({
        id: row.id,
        sort: editingCell.value,
      })
    }

    if (res.code === 0) {
      ElMessage.success('修改成功')
      row[field] = editingCell.value
      handleCancelEdit()
    } else {
      ElMessage.error(res.msg || '修改失败')
    }
  } catch (error) {
    console.error('修改失败:', error)
    ElMessage.error('修改失败，请重试')
  }
}

// 查询三方余额
const handleQueryBalance = async (row: any) => {
  try {
    const loadingInstance = ElMessage({
      message: '正在查询三方余额...',
      type: 'info',
      duration: 0,
    })

    const res = await queryThirdBalance({ id: row.id })

    loadingInstance.close()

    if (res.code === 0) {
      ElMessage.success('查询成功，已刷新列表')
      fetchList()
    } else {
      ElMessage.error(res.msg || '查询失败')
    }
  } catch (error) {
    console.error('查询失败:', error)
    ElMessage.error('查询失败，请重试')
  }
}

// 删除平台
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除平台 "${row.name}" 吗？此操作不可恢复！`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const res = await deletePaymentPlatform({ id: row.id })

      if (res.code === 0) {
        ElMessage.success('删除成功')
        fetchList()
      } else {
        ElMessage.error(res.msg || '删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

// 查看详情
const handleDetail = async (row: any) => {
  try {
    const res = await getPaymentPlatformDetail({ id: row.id })
    if (res.code === 0 && res.data) {
      detailData.value = res.data
      detailDialogVisible.value = true
    } else {
      ElMessage.error(res.msg || '获取详情失败')
    }
  } catch (error) {
    console.error('获取详情失败:', error)
    ElMessage.error('获取详情失败，请重试')
  }
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
.payment-platform-page {
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

.table-card {
  min-height: 400px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

/* 可编辑单元格样式 */
.editable-cell {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.editable-cell:hover {
  background-color: #f5f7fa;
}

.edit-icon {
  opacity: 0;
  transition: opacity 0.3s;
  color: #409eff;
  font-size: 14px;
}

.editable-cell:hover .edit-icon {
  opacity: 1;
}

.editable-cell-input {
  padding: 4px 0;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 16px;
  margin-bottom: 0;
}

:deep(.el-descriptions__label) {
  font-weight: 600;
}
</style>
