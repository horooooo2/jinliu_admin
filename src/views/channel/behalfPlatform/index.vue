<template>
  <div class="behalf-platform-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">代付平台管理</h2>
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
        <el-table-column prop="code" label="平台代码" width="120" />

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

        <el-table-column label="单笔费率数量" width="130" align="right">
          <template #default="{ row }">
            {{ row.feeMoney?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="单笔费率%" width="110" align="right">
          <template #default="{ row }">
            {{ (row.feeRate * 100).toFixed(2) }}%
          </template>
        </el-table-column>
        <el-table-column label="单笔固费" width="110" align="right">
          <template #default="{ row }">
            {{ row.fixedFee?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="三方余额" width="130" align="right">
          <template #default="{ row }">
            {{ row.thirdBalance?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="代付限额起" width="120" align="right">
          <template #default="{ row }">
            {{ row.payoutSingleMin?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="代付限额迄" width="120" align="right">
          <template #default="{ row }">
            {{ row.payoutSingleMax?.toFixed(2) }}
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

        <el-table-column prop="createdTime" label="创建时间" width="180" />
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleDetail(row)">
              查看
            </el-button>
            <el-button type="warning" link size="small" @click="handleEdit(row)">
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

    <!-- 添加/编辑平台对话框 -->
    <el-dialog
      v-model="platformDialogVisible"
      :title="isEdit ? '编辑代付平台' : '添加代付平台'"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="platformFormRef"
        :model="platformForm"
        :rules="platformFormRules"
        label-width="120px"
      >
        <el-form-item label="平台代码" prop="code">
          <el-input v-model="platformForm.code" placeholder="请输入平台代码" />
        </el-form-item>
        <el-form-item label="平台名称" prop="name">
          <el-input v-model="platformForm.name" placeholder="请输入平台名称" />
        </el-form-item>
        <el-form-item label="货币种类" prop="currency">
          <el-select v-model="platformForm.currency" placeholder="请选择货币种类" style="width: 100%">
            <el-option label="人民币" value="CNY" />
            <el-option label="泰铢" value="THB" />
            <el-option label="印度卢比" value="INR" />
            <el-option label="披索" value="PHP" />
            <el-option label="印尼盾" value="IDR" />
          </el-select>
        </el-form-item>
        <el-form-item label="单笔费率数量" prop="feeMoney">
          <el-input-number
            v-model="platformForm.feeMoney"
            :min="0"
            :precision="2"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="单笔费率%" prop="feeRate">
          <el-input-number
            v-model="platformForm.feeRate"
            :min="0"
            :max="1"
            :precision="4"
            :step="0.0001"
            style="width: 100%"
          />
          <span style="margin-left: 8px; color: #909399;">（0-1之间，如：0.05 表示 5%）</span>
        </el-form-item>
        <el-form-item label="单笔固费" prop="fixedFee">
          <el-input-number
            v-model="platformForm.fixedFee"
            :min="0"
            :precision="2"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="代付限额起" prop="payoutSingleMin">
          <el-input-number
            v-model="platformForm.payoutSingleMin"
            :min="0"
            :precision="2"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="代付限额迄" prop="payoutSingleMax">
          <el-input-number
            v-model="platformForm.payoutSingleMax"
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
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="platformForm.sort"
            :min="0"
            style="width: 100%"
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
      title="代付平台详情"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-descriptions :column="2" border v-if="detailData">
        <el-descriptions-item label="ID">{{ detailData.id }}</el-descriptions-item>
        <el-descriptions-item label="平台代码">{{ detailData.code }}</el-descriptions-item>
        <el-descriptions-item label="平台名称">{{ detailData.name }}</el-descriptions-item>
        <el-descriptions-item label="货币种类">{{ getCurrencyName(detailData.currency) }}</el-descriptions-item>
        <el-descriptions-item label="单笔费率数量">{{ detailData.feeMoney?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="单笔费率%">{{ (detailData.feeRate * 100).toFixed(2) }}%</el-descriptions-item>
        <el-descriptions-item label="单笔固费">{{ detailData.fixedFee?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="三方余额">{{ detailData.thirdBalance?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="代付限额起">{{ detailData.payoutSingleMin?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="代付限额迄">{{ detailData.payoutSingleMax?.toFixed(2) }}</el-descriptions-item>
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
        <el-descriptions-item label="银行列表" :span="2">
          <el-tag
            v-for="(bank, index) in detailData.banks"
            :key="index"
            style="margin-right: 8px; margin-bottom: 8px;"
          >
            <!-- 银行ID: {{ bank.bankId }}, 代码: {{ bank.thirdBankCode }} -->
             {{ bank.bankName }}
          </el-tag>
          <span v-if="!detailData.banks || detailData.banks.length === 0">暂无银行</span>
        </el-descriptions-item>
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
  getBehalfPlatformList,
  getBehalfPlatformDetail,
  addBehalfPlatform,
  editBehalfPlatform,
  deleteBehalfPlatform,
  editBehalfPlatformName,
  editBehalfPlatformSort,
  editBehalfPlatformStatus,
} from '@/api/channel/behalfPlatform'
import type {
  behalfPlatformListParams,
  behalfPlatformAddParams,
} from '@/api/channel/behalfPlatform'

// 搜索表单
const searchForm = reactive<Partial<behalfPlatformListParams>>({
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
const sortInputRef = ref<any>()

// 平台对话框
const platformDialogVisible = ref(false)
const isEdit = ref(false)
const platformFormRef = ref<FormInstance>()
const submitLoading = ref(false)

const platformForm = reactive<behalfPlatformAddParams>({
  id: undefined,
  code: '',
  name: '',
  currency: '',
  feeMoney: 0,
  feeRate: 0,
  fixedFee: 0,
  payoutSingleMin: 0,
  payoutSingleMax: 0,
  merchantAccount: '',
  merchantKey: '',
  extendedKey1: '',
  extendedKey2: '',
  extendedKey3: '',
  createOrderUrl: '',
  queryOrderUrl: '',
  queryBalanceUrl: '',
  whitelistedIp: '',
  sort: 0,
  banks: [],
})

const platformFormRules: FormRules = {
  code: [{ required: true, message: '请输入平台代码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入平台名称', trigger: 'blur' }],
  currency: [{ required: true, message: '请选择货币种类', trigger: 'change' }],
  feeMoney: [{ required: true, message: '请输入单笔费率数量', trigger: 'blur' }],
  feeRate: [{ required: true, message: '请输入单笔费率%', trigger: 'blur' }],
  fixedFee: [{ required: true, message: '请输入单笔固费', trigger: 'blur' }],
  payoutSingleMin: [{ required: true, message: '请输入代付限额起', trigger: 'blur' }],
  payoutSingleMax: [{ required: true, message: '请输入代付限额迄', trigger: 'blur' }],
  merchantAccount: [{ required: true, message: '请输入商户账号', trigger: 'blur' }],
  merchantKey: [{ required: true, message: '请输入商户密钥', trigger: 'blur' }],
  createOrderUrl: [{ required: true, message: '请输入网关接口URL', trigger: 'blur' }],
  queryOrderUrl: [{ required: true, message: '请输入查询接口URL', trigger: 'blur' }],
  queryBalanceUrl: [{ required: true, message: '请输入余额接口URL', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
}

// 详情对话框
const detailDialogVisible = ref(false)
const detailData = ref<any>(null)

// 货币名称映射
const getCurrencyName = (code: string) => {
  const map: Record<string, string> = {
    CNY: '人民币',
    THB: '泰铢',
    INR: '印度卢比',
    PHP: '披索',
    IDR: '印尼盾',
  }
  return map[code] || code
}

// 获取列表
const fetchList = async () => {
  try {
    loading.value = true

    const params: behalfPlatformListParams = {
      pageNo: pagination.pageNo,
      pageSize: pagination.pageSize,
      sortType: searchForm.sortType || 1,
      name: searchForm.name || '',
    }

    const res = await getBehalfPlatformList(params)

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
    code: '',
    name: '',
    currency: '',
    feeMoney: 0,
    feeRate: 0,
    fixedFee: 0,
    payoutSingleMin: 0,
    payoutSingleMax: 0,
    merchantAccount: '',
    merchantKey: '',
    extendedKey1: '',
    extendedKey2: '',
    extendedKey3: '',
    createOrderUrl: '',
    queryOrderUrl: '',
    queryBalanceUrl: '',
    whitelistedIp: '',
    sort: 0,
    banks: [],
  })
  platformDialogVisible.value = true
}

// 编辑平台
const handleEdit = async (row: any) => {
  try {
    // 先获取详情
    const res = await getBehalfPlatformDetail({ id: row.id })
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

        const apiFunc = isEdit.value ? editBehalfPlatform : addBehalfPlatform
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
      res = await editBehalfPlatformName({
        id: row.id,
        name: editingCell.value,
      })
    } else if (field === 'sort') {
      res = await editBehalfPlatformSort({
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

// 状态切换
const handleStatusChange = async (row: any) => {
  try {
    const res = await editBehalfPlatformStatus({
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
      const res = await deleteBehalfPlatform({ id: row.id })

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
    const res = await getBehalfPlatformDetail({ id: row.id })
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
.behalf-platform-page {
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
