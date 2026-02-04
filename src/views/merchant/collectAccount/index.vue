<template>
  <div class="collect-account-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">代付银行管理</h2>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline label-width="100px">
        <el-form-item label="银行名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入银行名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
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
        添加银行
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
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="type" label="银行类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getBankTypeTagType(row.type)">
              {{ getBankTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="银行代码" width="150" />
        <el-table-column prop="name" label="银行名称" width="200" />
        <el-table-column prop="currency" label="货币种类" width="120">
          <template #default="{ row }">
            <el-tag :type="getCurrencyTagType(row.currency)">
              {{ getCurrencyText(row.currency) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column prop="createdBy" label="创建人" width="120" />
        <el-table-column prop="createdTime" label="创建时间" width="160" />
        <el-table-column prop="updatedBy" label="更新人" width="120" />
        <el-table-column prop="updatedTime" label="更新时间" width="160" />
        <el-table-column label="操作" fixed="right" width="300">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="warning" link size="small" @click="handleEditName(row)">
              修改名称
            </el-button>
            <el-button type="info" link size="small" @click="handleEditSort(row)">
              修改排序
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

    <!-- 添加/编辑银行对话框 -->
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
        <el-form-item label="银行类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择银行类型" style="width: 100%">
            <el-option label="银行卡" :value="1" />
            <el-option label="USDT" :value="2" />
            <el-option label="支付宝" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="银行代码" prop="code">
          <el-input
            v-model="form.code"
            placeholder="请输入银行代码"
          />
        </el-form-item>
        <el-form-item label="银行名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入银行名称"
          />
        </el-form-item>
        <el-form-item label="货币种类" prop="currency">
          <el-select v-model="form.currency" placeholder="请选择货币种类" style="width: 100%">
            <el-option label="人民币 (CNY)" value="CNY" />
            <el-option label="泰铢 (THB)" value="THB" />
            <el-option label="印度卢比 (INR)" value="INR" />
            <el-option label="披索 (PHP)" value="PHP" />
            <el-option label="印尼盾 (IDR)" value="IDR" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="form.sort"
            :min="0"
            :max="9999"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="银行描述" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入银行描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 修改名称对话框 -->
    <el-dialog
      v-model="editNameDialogVisible"
      title="修改银行名称"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editNameFormRef"
        :model="editNameForm"
        :rules="editNameFormRules"
        label-width="100px"
      >
        <el-form-item label="银行ID">
          <el-input v-model="editNameForm.id" disabled />
        </el-form-item>
        <el-form-item label="银行名称" prop="name">
          <el-input
            v-model="editNameForm.name"
            placeholder="请输入银行名称"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editNameDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="editNameLoading" @click="handleEditNameSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 修改排序对话框 -->
    <el-dialog
      v-model="editSortDialogVisible"
      title="修改银行排序"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editSortFormRef"
        :model="editSortForm"
        :rules="editSortFormRules"
        label-width="100px"
      >
        <el-form-item label="银行ID">
          <el-input v-model="editSortForm.id" disabled />
        </el-form-item>
        <el-form-item label="排序值" prop="sort">
          <el-input-number
            v-model="editSortForm.sort"
            :min="0"
            :max="9999"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editSortDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="editSortLoading" @click="handleEditSortSubmit">
          确定
        </el-button>
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
  Refresh,
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import {
  getMerchantPayoutBankList,
  addMerchantPayoutBank,
  editMerchantPayoutBank,
  editMerchantPayoutBankName,
  editMerchantPayoutBankSort,
  deleteMerchantPayoutBank,
  type MerchantPayoutBankParams,
  type MerchantPayoutBankAddParams,
} from '@/api/merchant/collectAccount'

// 搜索表单
const searchForm = reactive<Partial<MerchantPayoutBankParams>>({
  sortType: 1,
  pageNo: 1,
  pageSize: 10,
  name: '',
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

// 添加/编辑对话框
const dialogVisible = ref(false)
const dialogTitle = ref('添加银行')
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const submitLoading = ref(false)

const form = reactive<MerchantPayoutBankAddParams>({
  id: undefined,
  type: 1,
  code: '',
  name: '',
  currency: 'CNY',
  remark: '',
  sort: 0,
})

const formRules: FormRules = {
  type: [
    { required: true, message: '请选择银行类型', trigger: 'change' },
  ],
  code: [
    { required: true, message: '请输入银行代码', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入银行名称', trigger: 'blur' },
  ],
  currency: [
    { required: true, message: '请选择货币种类', trigger: 'change' },
  ],
  sort: [
    { required: true, message: '请输入排序值', trigger: 'blur' },
  ],
}

// 修改名称对话框
const editNameDialogVisible = ref(false)
const editNameFormRef = ref<FormInstance>()
const editNameLoading = ref(false)
const editNameForm = reactive({
  id: 0,
  name: '',
})

const editNameFormRules: FormRules = {
  name: [
    { required: true, message: '请输入银行名称', trigger: 'blur' },
  ],
}

// 修改排序对话框
const editSortDialogVisible = ref(false)
const editSortFormRef = ref<FormInstance>()
const editSortLoading = ref(false)
const editSortForm = reactive({
  id: 0,
  sort: 0,
})

const editSortFormRules: FormRules = {
  sort: [
    { required: true, message: '请输入排序值', trigger: 'blur' },
  ],
}

// 获取银行类型文本
const getBankTypeText = (type: number) => {
  const typeMap: Record<number, string> = {
    1: '银行卡',
    2: 'USDT',
    3: '支付宝',
  }
  return typeMap[type] || '未知'
}

// 获取银行类型标签类型
const getBankTypeTagType = (type: number) => {
  const typeMap: Record<number, string> = {
    1: 'primary',
    2: 'success',
    3: 'warning',
  }
  return typeMap[type] || 'info'
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

// 获取银行列表
const fetchBankList = async () => {
  try {
    loading.value = true

    const params: MerchantPayoutBankParams = {
      sortType: searchForm.sortType || 1,
      pageNo: pagination.current,
      pageSize: pagination.size,
      name: searchForm.name,
    }

    const res = await getMerchantPayoutBankList(params)

    if (res.code === 0 && res.data) {
      tableData.value = res.data.records || []
      pagination.total = res.data.total || 0
    } else {
      tableData.value = []
      pagination.total = 0
      ElMessage.error(res.msg || '获取银行列表失败')
    }
  } catch (error) {
    console.error('获取银行列表失败:', error)
    ElMessage.error('获取银行列表失败，请重试')
    tableData.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchBankList()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    sortType: 1,
    name: '',
  })
  pagination.current = 1
  fetchBankList()
}

// 刷新
const handleRefresh = () => {
  fetchBankList()
  ElMessage.success('刷新成功')
}

// 添加银行
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加银行'
  Object.assign(form, {
    id: undefined,
    type: 1,
    code: '',
    name: '',
    currency: 'CNY',
    remark: '',
    sort: 0,
  })
  dialogVisible.value = true
}

// 编辑银行
const handleEdit = (row: any) => {
  isEdit.value = true
  dialogTitle.value = '编辑银行'
  Object.assign(form, {
    id: row.id,
    type: row.type,
    code: row.code,
    name: row.name,
    currency: row.currency,
    remark: row.remark,
    sort: row.sort,
  })
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        submitLoading.value = true

        const apiFunc = isEdit.value ? editMerchantPayoutBank : addMerchantPayoutBank
        const res = await apiFunc(form)

        if (res.code === 0) {
          ElMessage.success(isEdit.value ? '编辑成功' : '添加成功')
          dialogVisible.value = false
          fetchBankList()
        } else {
          ElMessage.error(res.msg || (isEdit.value ? '编辑失败' : '添加失败'))
        }
      } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error('提交失败，请重试')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 修改名称
const handleEditName = (row: any) => {
  Object.assign(editNameForm, {
    id: row.id,
    name: row.name,
  })
  editNameDialogVisible.value = true
}

// 提交修改名称
const handleEditNameSubmit = async () => {
  if (!editNameFormRef.value) return

  await editNameFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        editNameLoading.value = true

        const res = await editMerchantPayoutBankName({
          id: editNameForm.id,
          name: editNameForm.name,
        })

        if (res.code === 0) {
          ElMessage.success('修改成功')
          editNameDialogVisible.value = false
          fetchBankList()
        } else {
          ElMessage.error(res.msg || '修改失败')
        }
      } catch (error) {
        console.error('修改失败:', error)
        ElMessage.error('修改失败，请重试')
      } finally {
        editNameLoading.value = false
      }
    }
  })
}

// 修改排序
const handleEditSort = (row: any) => {
  Object.assign(editSortForm, {
    id: row.id,
    sort: row.sort,
  })
  editSortDialogVisible.value = true
}

// 提交修改排序
const handleEditSortSubmit = async () => {
  if (!editSortFormRef.value) return

  await editSortFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        editSortLoading.value = true

        const res = await editMerchantPayoutBankSort({
          id: editSortForm.id,
          sort: editSortForm.sort,
        })

        if (res.code === 0) {
          ElMessage.success('修改成功')
          editSortDialogVisible.value = false
          fetchBankList()
        } else {
          ElMessage.error(res.msg || '修改失败')
        }
      } catch (error) {
        console.error('修改失败:', error)
        ElMessage.error('修改失败，请重试')
      } finally {
        editSortLoading.value = false
      }
    }
  })
}

// 删除银行
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除银行 "${row.name}" 吗？此操作不可恢复！`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const res = await deleteMerchantPayoutBank({ id: row.id })

      if (res.code === 0) {
        ElMessage.success('删除成功')
        fetchBankList()
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

// 分页变化
const handleSizeChange = () => {
  pagination.current = 1
  fetchBankList()
}

const handleCurrentChange = () => {
  fetchBankList()
}

// 初始化
onMounted(() => {
  fetchBankList()
})
</script>

<style scoped>
.collect-account-page {
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
  margin-bottom: 0;
}
</style>
