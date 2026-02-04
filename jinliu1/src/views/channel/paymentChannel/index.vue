<template>
  <div class="payment-channel-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">支付通道管理</h2>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="通道名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入通道名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="通道类型">
          <el-select
            v-model="searchForm.typeId"
            placeholder="请选择通道类型"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in paymentTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="支付平台">
          <el-select
            v-model="searchForm.platformId"
            placeholder="请选择支付平台"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in paymentPlatformList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 200px"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
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
          添加通道
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

        <!-- 通道名称 - 可编辑 -->
        <el-table-column label="通道名称" width="180">
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

        <el-table-column prop="platformName" label="支付平台" width="150" />
        <el-table-column prop="typeName" label="通道类型" width="120" />
        <el-table-column prop="channelCode" label="通道代码" width="150" />

        <el-table-column label="上游费率" width="120" align="right">
          <template #default="{ row }">
            {{ (row.upstreamChannelRate * 100).toFixed(2) }}%
          </template>
        </el-table-column>

        <el-table-column label="上游固费" width="120" align="right">
          <template #default="{ row }">
            {{ row.upstreamChannelFixedFee?.toFixed(2) }}
          </template>
        </el-table-column>

        <el-table-column label="单笔限额" width="200" align="right">
          <template #default="{ row }">
            {{ row.singleAmountMin?.toFixed(2) }} ~ {{ row.singleAmountMax?.toFixed(2) }}
          </template>
        </el-table-column>

        <!-- 排序 - 可编辑 -->
        <el-table-column label="排序" width="120">
          <template #default="{ row }">
            <div
              v-if="editingCell.id === row.id && editingCell.field === 'sort'"
              class="editable-cell-input"
            >
              <el-input
                ref="sortInputRef"
                v-model.number="editingCell.value"
                type="number"
                size="small"
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

        <!-- 状态 - 可编辑 -->
        <el-table-column label="状态" width="120">
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
      :title="isEdit ? '编辑支付通道' : '添加支付通道'"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="140px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="通道名称" prop="name">
              <el-input
                v-model="form.name"
                placeholder="请输入通道名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通道类型" prop="typeId">
              <el-select
                v-model="form.typeId"
                placeholder="请选择通道类型"
                style="width: 100%"
              >
                <el-option
                  v-for="item in paymentTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="支付平台" prop="platformId">
              <el-select
                v-model="form.platformId"
                placeholder="请选择支付平台"
                style="width: 100%"
              >
                <el-option
                  v-for="item in paymentPlatformList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付方法ID" prop="methodId">
              <el-input-number
                v-model="form.methodId"
                :min="1"
                placeholder="请输入支付方法ID"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="通道代码" prop="channelCode">
              <el-input
                v-model="form.channelCode"
                placeholder="请输入通道代码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="唯一小数金额" prop="uniqueDecimalAmount">
              <el-input-number
                v-model="form.uniqueDecimalAmount"
                :min="0"
                :precision="2"
                placeholder="请输入唯一小数金额"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="上游通道费率(%)" prop="upstreamChannelRate">
              <el-input-number
                v-model="form.upstreamChannelRate"
                :min="0"
                :max="100"
                :precision="4"
                placeholder="请输入上游通道费率"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上游通道固费" prop="upstreamChannelFixedFee">
              <el-input-number
                v-model="form.upstreamChannelFixedFee"
                :min="0"
                :precision="2"
                placeholder="请输入上游通道固费"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单笔下限" prop="singleAmountMin">
              <el-input-number
                v-model="form.singleAmountMin"
                :min="0"
                :precision="2"
                placeholder="请输入单笔下限"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单笔上限" prop="singleAmountMax">
              <el-input-number
                v-model="form.singleAmountMax"
                :min="0"
                :precision="2"
                placeholder="请输入单笔上限"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="强制提交姓名" prop="forceSubmitName">
              <el-select
                v-model="form.forceSubmitName"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option label="否" :value="0" />
                <el-option label="是" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开启姓名风控" prop="enableNameRiskControl">
              <el-select
                v-model="form.enableNameRiskControl"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option label="否" :value="0" />
                <el-option label="是" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="固定金额列表" prop="fixedAmountList">
          <el-input
            v-model="form.fixedAmountList"
            type="textarea"
            :rows="3"
            placeholder="请输入固定金额列表，多个金额用逗号分隔"
          />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="form.sort"
            :min="0"
            placeholder="请输入排序值"
            style="width: 100%"
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
  getPaymentChannelList,
  addPaymentChannel,
  editPaymentChannel,
  deletePaymentChannel,
} from '@/api/channel/paymentChannel'
import type {
  paymentChannelListParams,
  addPaymentChannelParams,
} from '@/api/channel/paymentChannel'
import { getPaymentTypeList } from '@/api/channel/paymentType'
import { getPaymentPlatformList } from '@/api/channel/paymentPlatform'

// 搜索表单
const searchForm = reactive<Partial<paymentChannelListParams>>({
  name: '',
  typeId: undefined,
  platformId: undefined,
  status: undefined,
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

// 支付类型列表
const paymentTypeList = ref<any[]>([])

// 支付平台列表
const paymentPlatformList = ref<any[]>([])

// 编辑单元格
const editingCell = reactive({
  id: null as number | null,
  field: '',
  value: '' as any,
})

// 输入框引用
const nameInputRef = ref<any>()
const sortInputRef = ref<any>()

// 对话框
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const submitLoading = ref(false)

const form = reactive<addPaymentChannelParams>({
  id: undefined,
  typeId: 0,
  name: '',
  platformId: 0,
  methodId: 0,
  channelCode: '',
  uniqueDecimalAmount: 0,
  forceSubmitName: 0,
  enableNameRiskControl: 0,
  fixedAmountList: '',
  upstreamChannelRate: 0,
  upstreamChannelFixedFee: 0,
  singleAmountMin: 0,
  singleAmountMax: 0,
  sort: 0,
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入通道名称', trigger: 'blur' }],
  typeId: [{ required: true, message: '请选择通道类型', trigger: 'change' }],
  platformId: [{ required: true, message: '请选择支付平台', trigger: 'change' }],
  methodId: [{ required: true, message: '请输入支付方法ID', trigger: 'blur' }],
  channelCode: [{ required: true, message: '请输入通道代码', trigger: 'blur' }],
  upstreamChannelRate: [{ required: true, message: '请输入上游通道费率', trigger: 'blur' }],
  upstreamChannelFixedFee: [{ required: true, message: '请输入上游通道固费', trigger: 'blur' }],
  singleAmountMin: [{ required: true, message: '请输入单笔下限', trigger: 'blur' }],
  singleAmountMax: [{ required: true, message: '请输入单笔上限', trigger: 'blur' }],
}

// 获取支付类型列表
const fetchPaymentTypeList = async () => {
  try {
    const res = await getPaymentTypeList({
      pageNo: 1,
      pageSize: 1000,
    })

    if (res.code === 0 && res.data) {
      paymentTypeList.value = res.data.records || []
    }
  } catch (error) {
    console.error('获取支付类型列表失败:', error)
  }
}

// 获取支付平台列表
const fetchPaymentPlatformList = async () => {
  try {
    const res = await getPaymentPlatformList({
      pageNo: 1,
      pageSize: 1000,
    })

    if (res.code === 0 && res.data) {
      paymentPlatformList.value = res.data.records || []
    }
  } catch (error) {
    console.error('获取支付平台列表失败:', error)
  }
}

// 获取列表
const fetchList = async () => {
  try {
    loading.value = true

    const params: paymentChannelListParams = {
      pageNo: pagination.pageNo,
      pageSize: pagination.pageSize,
      ...searchForm,
    }

    const res = await getPaymentChannelList(params)

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
    typeId: undefined,
    platformId: undefined,
    status: undefined,
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
    typeId: 0,
    name: '',
    platformId: 0,
    methodId: 0,
    channelCode: '',
    uniqueDecimalAmount: 0,
    forceSubmitName: 0,
    enableNameRiskControl: 0,
    fixedAmountList: '',
    upstreamChannelRate: 0,
    upstreamChannelFixedFee: 0,
    singleAmountMin: 0,
    singleAmountMax: 0,
    sort: 0,
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  isEdit.value = true
  Object.assign(form, {
    id: row.id,
    typeId: row.typeId || 0,
    name: row.name,
    platformId: row.platformId || 0,
    methodId: row.methodId || 0,
    channelCode: row.channelCode,
    uniqueDecimalAmount: row.uniqueDecimalAmount || 0,
    forceSubmitName: row.forceSubmitName || 0,
    enableNameRiskControl: row.enableNameRiskControl || 0,
    fixedAmountList: row.fixedAmountList || '',
    upstreamChannelRate: row.upstreamChannelRate || 0,
    upstreamChannelFixedFee: row.upstreamChannelFixedFee || 0,
    singleAmountMin: row.singleAmountMin || 0,
    singleAmountMax: row.singleAmountMax || 0,
    sort: row.sort || 0,
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

        // 转换费率：前端显示百分比，后端需要小数
        const submitData = {
          ...form,
          upstreamChannelRate: form.upstreamChannelRate / 100,
        }

        const apiFunc = isEdit.value ? editPaymentChannel : addPaymentChannel
        const res = await apiFunc(submitData)

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
    `确定要删除支付通道 "${row.name}" 吗？此操作不可恢复！`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const res = await deletePaymentChannel(row.id)

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
      // 批量删除需要逐个调用删除接口
      const promises = selectedIds.value.map(id => deletePaymentChannel(id))
      await Promise.all(promises)

      ElMessage.success('删除成功')
      fetchList()
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }).catch(() => {
    // 用户取消删除
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

  // 验证不能为空
  if (field === 'name' && !editingCell.value.trim()) {
    ElMessage.warning('通道名称不能为空')
    return
  }

  if (field === 'sort' && (editingCell.value === '' || editingCell.value < 0)) {
    ElMessage.warning('排序值必须大于等于0')
    return
  }

  try {
    // 构建完整的编辑数据
    const editData: addPaymentChannelParams = {
      id: row.id,
      typeId: row.typeId,
      name: field === 'name' ? editingCell.value : row.name,
      platformId: row.platformId,
      methodId: row.methodId,
      channelCode: row.channelCode,
      uniqueDecimalAmount: row.uniqueDecimalAmount,
      forceSubmitName: row.forceSubmitName,
      enableNameRiskControl: row.enableNameRiskControl,
      fixedAmountList: row.fixedAmountList,
      upstreamChannelRate: row.upstreamChannelRate,
      upstreamChannelFixedFee: row.upstreamChannelFixedFee,
      singleAmountMin: row.singleAmountMin,
      singleAmountMax: row.singleAmountMax,
      sort: field === 'sort' ? editingCell.value : row.sort,
    }

    const res = await editPaymentChannel(editData)

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
    // 构建完整的编辑数据
    const editData: addPaymentChannelParams = {
      id: row.id,
      typeId: row.typeId,
      name: row.name,
      platformId: row.platformId,
      methodId: row.methodId,
      channelCode: row.channelCode,
      uniqueDecimalAmount: row.uniqueDecimalAmount,
      forceSubmitName: row.forceSubmitName,
      enableNameRiskControl: row.enableNameRiskControl,
      fixedAmountList: row.fixedAmountList,
      upstreamChannelRate: row.upstreamChannelRate,
      upstreamChannelFixedFee: row.upstreamChannelFixedFee,
      singleAmountMin: row.singleAmountMin,
      singleAmountMax: row.singleAmountMax,
      sort: row.sort,
    }

    const res = await editPaymentChannel(editData)

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
  fetchPaymentTypeList()
  fetchPaymentPlatformList()
  fetchList()
})
</script>

<style scoped>
.payment-channel-page {
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
