<template>
  <div class="ecommerce-container">
    <div class="page-header">
      <h4 class="page-title">电商数据</h4>
    </div>

    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <el-statistic title="总销售额" :value="268500">
            <template #prefix>¥</template>
          </el-statistic>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <el-statistic title="订单数" :value="1589" />
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <el-statistic title="客户数" :value="8426" />
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <el-statistic title="产品数" :value="365" />
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 16px;">
      <template #header>
        <span>近期订单</span>
      </template>
      <el-table :data="orderData" style="width: 100%">
        <el-table-column prop="id" label="订单号" width="120" />
        <el-table-column prop="customer" label="客户" />
        <el-table-column prop="product" label="产品" />
        <el-table-column prop="amount" label="金额" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const orderData = ref([
  { id: 'ORD-2024-001', customer: '张三', product: '笔记本电脑', amount: '¥5,999', status: '已完成' },
  { id: 'ORD-2024-002', customer: '李四', product: '手机', amount: '¥3,299', status: '处理中' },
  { id: 'ORD-2024-003', customer: '王五', product: '平板电脑', amount: '¥2,599', status: '已发货' },
  { id: 'ORD-2024-004', customer: '赵六', product: '耳机', amount: '¥599', status: '已完成' },
  { id: 'ORD-2024-005', customer: '孙七', product: '键盘', amount: '¥299', status: '处理中' },
])

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    '已完成': 'success',
    '处理中': 'warning',
    '已发货': 'primary',
  }
  return map[status] || 'info'
}
</script>

<style scoped>
.ecommerce-container {
  width: 100%;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
}

.stat-card {
  margin-bottom: 16px;
}
</style>
