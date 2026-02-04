<template>
  <div class="employee-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">员工管理</h2>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户账号">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户账号"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="部门">
          <el-tree-select
            v-model="searchForm.departmentId"
            :data="departmentTreeOptions"
            :props="{ label: 'name', value: 'id' }"
            placeholder="请选择部门"
            style="width: 200px"
            clearable
            check-strictly
          />
        </el-form-item>
        <el-form-item label="排序方式">
          <el-select
            v-model="searchForm.sortType"
            placeholder="请选择排序方式"
            style="width: 200px"
            clearable
          >
            <el-option label="账户余额降序" :value="1" />
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
        添加员工
      </el-button>
      <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
        <el-icon><Delete /></el-icon>
        批量删除
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="员工ID" width="100" />
        <el-table-column prop="username" label="用户账号" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" show-overflow-tooltip />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="departmentName" label="所属部门" min-width="120" />
        <el-table-column prop="lastLoginIp" label="最后登录IP" width="130" />
        <el-table-column prop="lastLoginCity" label="登录地点" min-width="150">
          <template #default="{ row }">
            <span v-if="row.lastLoginCountry || row.lastLoginProvince || row.lastLoginCity">
              {{ row.lastLoginCountry || '' }}
              {{ row.lastLoginProvince || '' }}
              {{ row.lastLoginCity || '' }}
            </span>
            <span v-else style="color: #909399;">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录时间" width="160" />
        <el-table-column prop="totalLoginCount" label="登录次数" width="100" align="center" />
        <el-table-column prop="googleBindStatus" label="谷歌验证" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.googleBindStatus === 1 ? 'success' : 'info'" size="small">
              {{ row.googleBindStatus === 1 ? '已绑定' : '未绑定' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="260">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="warning" link size="small" @click="handlePermission(row)">
              权限分配
            </el-button>
            <el-button type="success" link size="small" @click="handleResetPassword(row)">
              重置密码
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
          :page-sizes="[10, 15, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑员工对话框 -->
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
        label-width="100px"
      >
        <el-form-item label="用户账号" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户账号"
            :disabled="isEdit"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="登录密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入登录密码"
            maxlength="50"
            show-password
          />
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input
            v-model="form.email"
            placeholder="请输入用户邮箱"
            maxlength="100"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="请输入手机号"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="所属部门" prop="departmentId">
          <el-tree-select
            v-model="form.departmentId"
            :data="departmentTreeOptions"
            :props="{ label: 'name', value: 'id' }"
            placeholder="请选择所属部门"
            style="width: 100%"
            check-strictly
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

    <!-- 权限分配对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="员工权限分配"
      width="600px"
      :close-on-click-modal="false"
    >
      <div style="margin-bottom: 10px;">
        <el-button type="primary" size="small" @click="handleCheckAll">全选</el-button>
        <el-button size="small" @click="handleUncheckAll">取消全选</el-button>
        <el-button type="warning" size="small" @click="handleExpandTree">
          {{ expandPermissionTree ? '折叠' : '展开' }}
        </el-button>
      </div>
      <el-tree
        ref="permissionTreeRef"
        v-loading="permissionLoading"
        :data="permissionTreeData"
        :props="{ label: 'name', children: 'children' }"
        show-checkbox
        node-key="id"
        :default-expand-all="expandPermissionTree"
        :default-checked-keys="checkedPermissionKeys"
      />
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="permissionSubmitLoading" @click="handlePermissionSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 重置密码对话框 -->
    <el-dialog
      v-model="resetPasswordDialogVisible"
      title="重置密码"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="resetPasswordFormRef"
        :model="resetPasswordForm"
        :rules="resetPasswordFormRules"
        label-width="100px"
      >
        <el-form-item label="用户账号">
          <el-input v-model="currentEmployee.username" disabled />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="resetPasswordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            maxlength="50"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="resetPasswordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            maxlength="50"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resetPasswordDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="resetPasswordLoading" @click="handleResetPasswordSubmit">
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
  Delete,
  Refresh,
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import {
  getList,
  addMerchantUser,
  editMerchantUser,
  deleteMerchantUser,
  getAllTree,
  getMerchantUserTree,
} from '@/api/system/employee'
import { getTree } from '@/api/system/department'

// 搜索表单
const searchForm = reactive({
  username: '',
  departmentId: undefined as number | undefined,
  sortType: undefined as number | undefined,
})

// 部门树选项
const departmentTreeOptions = ref<any[]>([])

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)
const selectedIds = ref<number[]>([])

// 分页
const pagination = reactive({
  pageNo: 1,
  pageSize: 15,
  total: 0,
})

// 添加/编辑对话框
const dialogVisible = ref(false)
const dialogTitle = ref('添加员工')
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const submitLoading = ref(false)

const form = reactive({
  id: undefined as number | undefined,
  username: '',
  password: '',
  email: '',
  phone: '',
  departmentId: undefined as number | undefined,
})

// 表单验证规则
const validatePassword = (rule: any, value: any, callback: any) => {
  if (!isEdit.value && !value) {
    callback(new Error('请输入登录密码'))
  } else if (value && value.length < 6) {
    callback(new Error('密码长度不能少于6位'))
  } else {
    callback()
  }
}

const formRules: FormRules = {
  username: [
    { required: true, message: '请输入用户账号', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' },
  ],
  password: [
    { validator: validatePassword, trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
  ],
  departmentId: [
    { required: true, message: '请选择所属部门', trigger: 'change' },
  ],
}

// 权限分配对话框
const permissionDialogVisible = ref(false)
const permissionLoading = ref(false)
const permissionSubmitLoading = ref(false)
const permissionTreeRef = ref()
const permissionTreeData = ref<any[]>([])
const checkedPermissionKeys = ref<number[]>([])
const expandPermissionTree = ref(true)
const currentUserId = ref<number>()

// 重置密码对话框
const resetPasswordDialogVisible = ref(false)
const resetPasswordFormRef = ref<FormInstance>()
const resetPasswordLoading = ref(false)
const currentEmployee = reactive({
  id: undefined as number | undefined,
  username: '',
})

const resetPasswordForm = reactive({
  newPassword: '',
  confirmPassword: '',
})

// 重置密码表单验证
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value !== resetPasswordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const resetPasswordFormRules: FormRules = {
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
}

// 获取部门树
const fetchDepartmentTree = async () => {
  try {
    const res = await getTree({})
    if (res.code === 0 && res.data) {
      if (res.data.menu) {
        const treeData = Array.isArray(res.data.menu) ? res.data.menu : [res.data.menu]
        departmentTreeOptions.value = treeData
      } else if (Array.isArray(res.data)) {
        departmentTreeOptions.value = res.data
      }
    }
  } catch (error) {
    console.error('获取部门树失败:', error)
  }
}

// 获取员工列表
const fetchEmployeeList = async () => {
  try {
    loading.value = true
    const params: any = {
      pageNo: pagination.pageNo,
      pageSize: pagination.pageSize,
    }

    if (searchForm.sortType) {
      params.sortType = searchForm.sortType
    }
    if (searchForm.username) {
      params.username = searchForm.username
    }
    if (searchForm.departmentId) {
      params.departmentId = searchForm.departmentId
    }

    const res = await getList(params)
    if (res.code === 0 && res.data) {
      tableData.value = res.data.records || []
      pagination.total = res.data.total || 0
    }
  } catch (error) {
    console.error('获取员工列表失败:', error)
    ElMessage.error('获取员工列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.pageNo = 1
  fetchEmployeeList()
}

// 重置
const handleReset = () => {
  searchForm.username = ''
  searchForm.departmentId = undefined
  searchForm.sortType = undefined
  pagination.pageNo = 1
  fetchEmployeeList()
}

// 刷新
const handleRefresh = () => {
  fetchEmployeeList()
  ElMessage.success('刷新成功')
}

// 添加员工
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加员工'
  Object.assign(form, {
    id: undefined,
    username: '',
    password: '',
    email: '',
    phone: '',
    departmentId: undefined,
  })
  dialogVisible.value = true
}

// 编辑员工
const handleEdit = (row: any) => {
  isEdit.value = true
  dialogTitle.value = '编辑员工'
  Object.assign(form, {
    id: row.id,
    username: row.username,
    password: '',
    email: row.email || '',
    phone: row.phone || '',
    departmentId: row.departmentId,
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

        if (isEdit.value) {
          // 编辑时，如果没有修改密码，则不传 password 字段
          const submitData: any = {
            id: form.id,
            username: form.username,
            email: form.email,
            phone: form.phone,
            departmentId: form.departmentId,
          }
          if (form.password) {
            submitData.password = form.password
          }
          await editMerchantUser(submitData)
          ElMessage.success('编辑成功')
        } else {
          await addMerchantUser(form)
          ElMessage.success('添加成功')
        }

        dialogVisible.value = false
        fetchEmployeeList()
      } catch (error: any) {
        console.error('提交失败:', error)
        ElMessage.error(error.msg || '操作失败')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 删除员工
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除员工"${row.username}"吗？此操作不可恢复！`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await deleteMerchantUser([row.id])
      ElMessage.success('删除成功')
      fetchEmployeeList()
    } catch (error: any) {
      console.error('删除失败:', error)
      ElMessage.error(error.msg || '删除失败')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先选择要删除的员工')
    return
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedIds.value.length} 名员工吗？此操作不可恢复！`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await deleteMerchantUser(selectedIds.value)
      ElMessage.success('批量删除成功')
      selectedIds.value = []
      fetchEmployeeList()
    } catch (error: any) {
      console.error('批量删除失败:', error)
      ElMessage.error(error.msg || '批量删除失败')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 权限分配
const handlePermission = async (row: any) => {
  currentUserId.value = row.id
  permissionDialogVisible.value = true

  try {
    permissionLoading.value = true

    // 获取所有权限树
    const allTreeRes = await getAllTree({})
    if (allTreeRes.code === 0 && allTreeRes.data) {
      if (allTreeRes.data.menu) {
        permissionTreeData.value = Array.isArray(allTreeRes.data.menu)
          ? allTreeRes.data.menu
          : [allTreeRes.data.menu]
      } else if (Array.isArray(allTreeRes.data)) {
        permissionTreeData.value = allTreeRes.data
      }
    }

    // 获取当前员工的权限
    const userTreeRes = await getMerchantUserTree({ userId: row.id })
    if (userTreeRes.code === 0 && userTreeRes.data) {
      // 提取已选中的权限 ID
      const extractIds = (nodes: any[]): number[] => {
        let ids: number[] = []
        nodes.forEach(node => {
          ids.push(node.id)
          if (node.children && node.children.length > 0) {
            ids = ids.concat(extractIds(node.children))
          }
        })
        return ids
      }

      if (userTreeRes.data.menu) {
        const menus = Array.isArray(userTreeRes.data.menu)
          ? userTreeRes.data.menu
          : [userTreeRes.data.menu]
        checkedPermissionKeys.value = extractIds(menus)
      }
    }
  } catch (error) {
    console.error('获取权限数据失败:', error)
    ElMessage.error('获取权限数据失败')
  } finally {
    permissionLoading.value = false
  }
}

// 全选权限
const handleCheckAll = () => {
  const allKeys = getAllKeys(permissionTreeData.value)
  permissionTreeRef.value.setCheckedKeys(allKeys)
}

// 取消全选
const handleUncheckAll = () => {
  permissionTreeRef.value.setCheckedKeys([])
}

// 展开/折叠权限树
const handleExpandTree = () => {
  expandPermissionTree.value = !expandPermissionTree.value
}

// 获取所有节点的 key
const getAllKeys = (nodes: any[]): number[] => {
  let keys: number[] = []
  nodes.forEach(node => {
    keys.push(node.id)
    if (node.children && node.children.length > 0) {
      keys = keys.concat(getAllKeys(node.children))
    }
  })
  return keys
}

// 提交权限分配
const handlePermissionSubmit = async () => {
  try {
    permissionSubmitLoading.value = true

    const checkedKeys = permissionTreeRef.value.getCheckedKeys()
    const halfCheckedKeys = permissionTreeRef.value.getHalfCheckedKeys()
    const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys]

    // TODO: 调用实际的权限分配 API
    // await assignUserPermission({
    //   userId: currentUserId.value,
    //   menuIds: allCheckedKeys
    // })

    ElMessage.success('权限分配成功')
    permissionDialogVisible.value = false
  } catch (error: any) {
    console.error('权限分配失败:', error)
    ElMessage.error(error.msg || '权限分配失败')
  } finally {
    permissionSubmitLoading.value = false
  }
}

// 重置密码
const handleResetPassword = (row: any) => {
  Object.assign(currentEmployee, {
    id: row.id,
    username: row.username,
  })
  Object.assign(resetPasswordForm, {
    newPassword: '',
    confirmPassword: '',
  })
  resetPasswordDialogVisible.value = true
}

// 提交重置密码
const handleResetPasswordSubmit = async () => {
  if (!resetPasswordFormRef.value) return

  await resetPasswordFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        resetPasswordLoading.value = true

        // TODO: 调用实际的重置密码 API
        // await resetUserPassword({
        //   id: currentEmployee.id,
        //   password: resetPasswordForm.newPassword
        // })

        ElMessage.success('密码重置成功')
        resetPasswordDialogVisible.value = false
      } catch (error: any) {
        console.error('密码重置失败:', error)
        ElMessage.error(error.msg || '密码重置失败')
      } finally {
        resetPasswordLoading.value = false
      }
    }
  })
}

// 分页变化
const handleSizeChange = () => {
  pagination.pageNo = 1
  fetchEmployeeList()
}

const handleCurrentChange = () => {
  fetchEmployeeList()
}

// 初始化
onMounted(() => {
  fetchDepartmentTree()
  fetchEmployeeList()
})
</script>

<style scoped>
.employee-page {
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
