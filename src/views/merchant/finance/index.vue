<template>
  <div class="finance-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">商户财务记录</h2>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="商户ID">
          <el-input
            v-model="searchForm.merchantId"
            placeholder="请输入商户ID"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="商户账号">
          <el-input
            v-model="searchForm.merchantAccount"
            placeholder="请输入商户账号"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="财务类型">
          <el-select
            v-model="searchForm.financialType"
            placeholder="请选择财务类型"
            clearable
            style="width: 200px"
          >
            <el-option label="支付" :value="1" />
            <el-option label="提现" :value="2" />
            <el-option label="冻结" :value="3" />
            <el-option label="解冻" :value="4" />
            <el-option label="佣金" :value="5" />
            <el-option label="代充" :value="6" />
            <el-option label="代付" :value="7" />
            <el-option label="微调" :value="8" />
          </el-select>
        </el-form-item>
      </el-form>

      <el-form :model="searchForm" inline style="margin-top: 12px;">
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="searchForm.createdTimeStart"
            type="datetime"
            placeholder="请选择开始时间"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="财务备注">
          <el-input
            v-model="searchForm.remark"
            placeholder="请输入财务备注"
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
            <el-option label="帐户余额降序" :value="1" />
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
        <el-button type="success" @click="handleExport" :loading="exportLoading">
          <el-icon><Download /></el-icon>
          导出
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
        <el-table-column prop="merchantId" label="商户ID" width="120" />
        <el-table-column prop="merchantAccount" label="商户账号" width="140" />
        <el-table-column label="财务类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getFinancialTypeTagType(row.financialType)">
              {{ getFinancialTypeName(row.financialType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="金额" width="120" align="right">
          <template #default="{ row }">
            {{ row.money?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="fee" label="手续费" width="120" align="right">
          <template #default="{ row }">
            {{ row.fee?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="assocOrderNo" label="关连单号" width="150" show-overflow-tooltip />
        <el-table-column prop="remark" label="财务备注" width="150" show-overflow-tooltip />
        <el-table-column label="余额" width="120" align="right">
          <template #default="{ row }">
            {{ row.afterChangeBalance?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="冻结金额" width="120" align="right">
          <template #default="{ row }">
            {{ row.afterChangeFrozenAmount?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="预付押金" width="120" align="right">
          <template #default="{ row }">
            {{ row.afterChangePrepaidDeposit?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="createdTime" label="创建时间" width="180" />
        <el-table-column label="操作" fixed="right" width="100">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleDetail(row)">
              查看
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

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="财务记录详情"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-descriptions :column="1" border v-if="detailData">
        <el-descriptions-item label="商户ID">{{ detailData.merchantId }}</el-descriptions-item>
        <el-descriptions-item label="商户账号">{{ detailData.merchantAccount }}</el-descriptions-item>
        <el-descriptions-item label="财务类型">
          <el-tag :type="getFinancialTypeTagType(detailData.financialType)">
            {{ getFinancialTypeName(detailData.financialType) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="金额">{{ detailData.money?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="手续费">{{ detailData.fee?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="关连单号">{{ detailData.assocOrderNo }}</el-descriptions-item>
        <el-descriptions-item label="财务备注">{{ detailData.remark }}</el-descriptions-item>
        <el-descriptions-item label="变更后余额">{{ detailData.afterChangeBalance?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="变更后冻结金额">{{ detailData.afterChangeFrozenAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="变更后预付押金">{{ detailData.afterChangePrepaidDeposit?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ detailData.createdBy }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createdTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
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
  Refresh,
  Download,
} from '@element-plus/icons-vue'
import {
  getMerchantFinancialRecord,
  type MerchantFinancialRecordParams,
  type MerchantFinancialRecordResponse,
} from '@/api/merchant'
import { request } from '@/utils/request'

// 搜索表单
const searchForm = reactive({
  merchantId: '',
  merchantAccount: '',
  financialType: undefined as number | undefined,
  remark: '',
  createdTimeStart: null as string | null,
  sortType: undefined as number | undefined,
})

// 表格数据
const tableData = ref<MerchantFinancialRecordResponse['data']['records']>([])
const loading = ref(false)
const exportLoading = ref(false)

// 分页
const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
})

// 详情对话框
const detailDialogVisible = ref(false)
const detailData = ref<MerchantFinancialRecordResponse['data']['records'][0] | null>(null)

// 财务类型名称映射
const financialTypeMap: Record<number, string> = {
  1: '支付',
  2: '提现',
  3: '冻结',
  4: '解冻',
  5: '佣金',
  6: '代充',
  7: '代付',
  8: '微调',
}

// 财务类型标签类型映射
const financialTypeTagMap: Record<number, string> = {
  1: 'success',
  2: 'danger',
  3: 'warning',
  4: 'info',
  5: 'primary',
  6: 'success',
  7: 'danger',
  8: 'info',
}

// 获取财务类型名称
const getFinancialTypeName = (type: number) => {
  return financialTypeMap[type] || '未知'
}

// 获取财务类型标签类型
const getFinancialTypeTagType = (type: number) => {
  return financialTypeTagMap[type] || ''
}

// 获取财务记录
const fetchFinancialRecords = async () => {
  try {
    loading.value = true

    const params: MerchantFinancialRecordParams = {
      merchantId: searchForm.merchantId,
      pageNo: pagination.pageNo,
      pageSize: pagination.pageSize,
    }

    if (searchForm.merchantAccount) {
      params.merchantAccount = searchForm.merchantAccount
    }
    if (searchForm.financialType !== undefined) {
      params.financialType = searchForm.financialType
    }
    if (searchForm.remark) {
      params.remark = searchForm.remark
    }
    if (searchForm.createdTimeStart) {
      params.createdTimeStart = searchForm.createdTimeStart
    }
    if (searchForm.sortType !== undefined) {
      params.sortType = searchForm.sortType
    }

    const res = await getMerchantFinancialRecord(params)

    if (res.code === 0 && res.data) {
      tableData.value = res.data.records || []
      pagination.total = res.data.total || 0
    } else {
      tableData.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error('获取财务记录失败:', error)
    tableData.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  if (!searchForm.merchantId) {
    ElMessage.warning('请输入商户ID')
    return
  }
  pagination.pageNo = 1
  fetchFinancialRecords()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    merchantId: '',
    merchantAccount: '',
    financialType: undefined,
    remark: '',
    createdTimeStart: null,
    sortType: undefined,
  })
  tableData.value = []
  pagination.pageNo = 1
  pagination.total = 0
}

// 刷新
const handleRefresh = () => {
  fetchFinancialRecords()
  ElMessage.success('刷新成功')
}

// 导出
const handleExport = async () => {
  try {
    exportLoading.value = true

    const params: MerchantFinancialRecordParams = {
      merchantId: searchForm.merchantId,
      pageNo: 1,
      pageSize: 999999, // 导出所有数据
    }

    if (searchForm.merchantAccount) {
      params.merchantAccount = searchForm.merchantAccount
    }
    if (searchForm.financialType !== undefined) {
      params.financialType = searchForm.financialType
    }
    if (searchForm.remark) {
      params.remark = searchForm.remark
    }
    if (searchForm.createdTimeStart) {
      params.createdTimeStart = searchForm.createdTimeStart
    }
    if (searchForm.sortType !== undefined) {
      params.sortType = searchForm.sortType
    }

    // 使用统一的导出方法
    await request.downloadFile(
      '/pay-bank/merchant-financial-record/export',
      params,
      `merchant_financial_records_${new Date().getTime()}`
    )
  } catch (error) {
    console.error('导出失败:', error)
  } finally {
    exportLoading.value = false
  }
}

// 查看详情
const handleDetail = (row: MerchantFinancialRecordResponse['data']['records'][0]) => {
  detailData.value = row
  detailDialogVisible.value = true
}

// 初始化查询
onMounted(() => {
  fetchFinancialRecords()
})

// 分页变化
const handleSizeChange = () => {
  pagination.pageNo = 1
  fetchFinancialRecords()
}

const handleCurrentChange = () => {
  fetchFinancialRecords()
}
</script>

<style scoped>
.finance-page {
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

.search-card :deep(.el-button) {
  margin-right: 8px;
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
  margin-bottom: 8px;
}
</style>