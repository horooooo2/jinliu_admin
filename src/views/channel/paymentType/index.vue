<template>
  <div class="payment-type-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">支付类型管理</h2>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="支付类型名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入支付类型名称"
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
          添加类型
        </el-button>
        <el-button
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          <el-icon><Delete /></el-icon>
          批量删除
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />

        <!-- 支付类型代码 - 可编辑 -->
        <el-table-column label="支付类型代码">
          <template #default="{ row }">
            <div
              v-if="editingCell.id === row.id && editingCell.field === 'code'"
              class="editable-cell-input"
            >
              <el-input
                ref="codeInputRef"
                v-model="editingCell.value"
                size="small"
                @blur="handleSaveEdit(row, 'code')"
                @keyup.enter="handleSaveEdit(row, 'code')"
                @keyup.esc="handleCancelEdit"
              />
            </div>
            <div
              v-else
              class="editable-cell"
              @dblclick="handleStartEdit(row, 'code', row.code)"
            >
              {{ row.code }}
              <el-icon class="edit-icon"><Edit /></el-icon>
            </div>
          </template>
        </el-table-column>

        <!-- 支付类型名称 - 可编辑 -->
        <el-table-column label="支付类型名称">
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

        <!-- <el-table-column label="费率" width="120" align="right">
          <template #default="{ row }">
            {{ (row.rate * 100).toFixed(2) }}%
          </template>
        </el-table-column>

        <el-table-column label="固费" width="120" align="right">
          <template #default="{ row }">
            {{ row.fixedFee?.toFixed(2) }}
          </template>
        </el-table-column> -->

        <!-- 状态 - 可编辑 -->
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="禁用"
              inline-prompt
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="150">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">
              编辑
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

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑支付类型' : '添加支付类型'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="支付类型代码" prop="code">
          <el-input
            v-model="form.code"
            placeholder="请输入支付类型代码"
          />
        </el-form-item>
        <el-form-item label="支付类型名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入支付类型名称"
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
  Delete,
  Edit,
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import {
  getPaymentTypeList,
  addPaymentType,
  editPaymentType,
  deletePaymentType,
  editPaymentTypeName,
  editPaymentTypeCode,
  editPaymentTypeStatus,
} from '@/api/channel/paymentType'
import type {
  PaymentTypelListParams,
  AddPaymentTypeParams,
} from '@/api/channel/paymentType'

// 搜索表单
const searchForm = reactive<Partial<PaymentTypelListParams>>({
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

// 选中的行
const selectedIds = ref<number[]>([])

// 编辑单元格
const editingCell = reactive({
  id: null as number | null,
  field: '',
  value: '',
})

// 输入框引用
const codeInputRef = ref<any>()
const nameInputRef = ref<any>()

// 对话框
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const submitLoading = ref(false)

const form = reactive<AddPaymentTypeParams>({
  id: undefined,
  code: '',
  name: '',
})

const formRules: FormRules = {
  code: [{ required: true, message: '请输入支付类型代码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入支付类型名称', trigger: 'blur' }],
}

// 获取列表
const fetchList = async () => {
  try {
    loading.value = true

    const params: PaymentTypelListParams = {
      pageNo: pagination.pageNo,
      pageSize: pagination.pageSize,
      ...searchForm,
    }

    const res = await getPaymentTypeList(params)

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

// 添加
const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, {
    id: undefined,
    code: '',
    name: '',
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  isEdit.value = true
  Object.assign(form, {
    id: row.id,
    code: row.code,
    name: row.name,
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

        const apiFunc = isEdit.value ? editPaymentType : addPaymentType
        const res = await apiFunc(form)

        if (res.code === 0) {
          ElMessage.success(isEdit.value ? '编辑成功' : '添加成功')
          dialogVisible.value = false
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

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除支付类型 "${row.name}" 吗？此操作不可恢复！`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const res = await deletePaymentType([row.id])

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

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedIds.value.length} 条数据吗？此操作不可恢复！`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const res = await deletePaymentType(selectedIds.value)

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

// 开始编辑单元格
const handleStartEdit = (row: any, field: string, value: string) => {
  editingCell.id = row.id
  editingCell.field = field
  editingCell.value = value

  // 自动聚焦输入框
  nextTick(() => {
    if (field === 'code' && codeInputRef.value) {
      codeInputRef.value.focus()
    } else if (field === 'name' && nameInputRef.value) {
      nameInputRef.value.focus()
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

  // 验证不能为空
  if (!editingCell.value.trim()) {
    ElMessage.warning('内容不能为空')
    return
  }

  try {
    let res: any

    if (field === 'code') {
      res = await editPaymentTypeCode({
        id: row.id,
        code: editingCell.value,
      })
    } else if (field === 'name') {
      res = await editPaymentTypeName({
        id: row.id,
        name: editingCell.value,
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

// 状态切换
const handleStatusChange = async (row: any) => {
  try {
    const res = await editPaymentTypeStatus({
      id: row.id,
      status: row.status,
    })

    if (res.code === 0) {
      ElMessage.success('状态修改成功')
    } else {
      ElMessage.error(res.msg || '状态修改失败')
      // 恢复原状态
      row.status = row.status === 1 ? 0 : 1
    }
  } catch (error) {
    console.error('状态修改失败:', error)
    ElMessage.error('状态修改失败，请重试')
    // 恢复原状态
    row.status = row.status === 1 ? 0 : 1
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
.payment-type-page {
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
</style>
