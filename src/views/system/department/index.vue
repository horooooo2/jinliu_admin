<template>
  <div class="department-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">部门管理</h2>
    </div>

    <!-- 操作按钮区域 -->
    <el-card class="action-card" shadow="never">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加部门
      </el-button>
      <el-button @click="handleRefresh">
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
      <el-button type="success" @click="handleExpandAll">
        <el-icon><Sort /></el-icon>
        {{ expandAll ? '折叠全部' : '展开全部' }}
      </el-button>
    </el-card>

    <!-- 部门树形表格 -->
    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="loading"
        :data="tableData"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :default-expand-all="expandAll"
        stripe
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column prop="name" label="部门名称" min-width="200" />
        <el-table-column prop="id" label="部门ID" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" fixed="right" width="280">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleAddChild(row)">
              添加子部门
            </el-button>
            <el-button type="warning" link size="small" @click="handlePermission(row)">
              权限分配
            </el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑部门对话框 -->
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
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入部门名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="上级部门" prop="parentId">
          <el-tree-select
            v-model="form.parentId"
            :data="departmentTreeOptions"
            :props="{ label: 'name', value: 'id' }"
            placeholder="请选择上级部门（不选则为顶级部门）"
            style="width: 100%"
            check-strictly
            :render-after-expand="false"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
            maxlength="200"
            show-word-limit
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
      title="权限分配"
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, Sort } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import {
  getTree,
  addDepartment,
  editDepartment,
  deleteDepartment,
  getAllTree,
  getDepartmentTree,
} from '@/api/system/department'

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)
const expandAll = ref(false)

// 部门树选项（用于上级部门选择）
const departmentTreeOptions = ref<any[]>([])

// 添加/编辑对话框
const dialogVisible = ref(false)
const dialogTitle = ref('添加部门')
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const submitLoading = ref(false)

const form = reactive({
  id: undefined as number | undefined,
  name: '',
  parentId: 0,
  status: 1,
  remark: '',
})

const formRules: FormRules = {
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' },
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
const currentDepartmentId = ref<number>()

// 获取部门树
const fetchDepartmentTree = async () => {
  try {
    loading.value = true
    const res = await getTree({})
    if (res.code === 0 && res.data) {
      // 根据实际返回的数据结构调整
      if (res.data.menu) {
        tableData.value = Array.isArray(res.data.menu) ? res.data.menu : [res.data.menu]
      } else if (Array.isArray(res.data)) {
        tableData.value = res.data
      } else {
        tableData.value = []
      }

      // 更新部门树选项（添加一个"顶级部门"选项）
      departmentTreeOptions.value = [
        { id: 0, name: '顶级部门', children: tableData.value },
      ]
    }
  } catch (error) {
    console.error('获取部门树失败:', error)
    ElMessage.error('获取部门树失败')
  } finally {
    loading.value = false
  }
}

// 刷新
const handleRefresh = () => {
  fetchDepartmentTree()
  ElMessage.success('刷新成功')
}

// 展开/折叠全部
const handleExpandAll = () => {
  expandAll.value = !expandAll.value
}

// 添加部门
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加部门'
  Object.assign(form, {
    id: undefined,
    name: '',
    parentId: 0,
    status: 1,
    remark: '',
  })
  dialogVisible.value = true
}

// 添加子部门
const handleAddChild = (row: any) => {
  isEdit.value = false
  dialogTitle.value = '添加子部门'
  Object.assign(form, {
    id: undefined,
    name: '',
    parentId: row.id,
    status: 1,
    remark: '',
  })
  dialogVisible.value = true
}

// 编辑部门
const handleEdit = (row: any) => {
  isEdit.value = true
  dialogTitle.value = '编辑部门'
  Object.assign(form, {
    id: row.id,
    name: row.name,
    parentId: row.parentId || 0,
    status: row.status ?? 1,
    remark: row.remark || '',
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

        const submitData = {
          ...form,
          parentId: form.parentId || 0,
        }

        if (isEdit.value) {
          await editDepartment(submitData)
          ElMessage.success('编辑成功')
        } else {
          // 添加时不需要传 id
          const { id, ...addData } = submitData
          await addDepartment(addData)
          ElMessage.success('添加成功')
        }

        dialogVisible.value = false
        fetchDepartmentTree()
      } catch (error: any) {
        console.error('提交失败:', error)
        ElMessage.error(error.msg || '操作失败')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 删除部门
const handleDelete = (row: any) => {
  // 检查是否有子部门
  if (row.children && row.children.length > 0) {
    ElMessage.warning('该部门下有子部门，无法删除')
    return
  }

  ElMessageBox.confirm(
    `确定要删除部门"${row.name}"吗？此操作不可恢复！`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await deleteDepartment([row.id])
      ElMessage.success('删除成功')
      fetchDepartmentTree()
    } catch (error: any) {
      console.error('删除失败:', error)
      ElMessage.error(error.msg || '删除失败')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

// 权限分配
const handlePermission = async (row: any) => {
  currentDepartmentId.value = row.id
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

    // 获取当前部门的权限
    const departmentTreeRes = await getDepartmentTree({ departmentId: row.id })
    if (departmentTreeRes.code === 0 && departmentTreeRes.data) {
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

      if (departmentTreeRes.data.menu) {
        const menus = Array.isArray(departmentTreeRes.data.menu)
          ? departmentTreeRes.data.menu
          : [departmentTreeRes.data.menu]
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
    // await assignDepartmentPermission({
    //   departmentId: currentDepartmentId.value,
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

// 初始化
onMounted(() => {
  fetchDepartmentTree()
})
</script>

<style scoped>
.department-page {
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

:deep(.el-card__body) {
  padding: 20px;
}
</style>
