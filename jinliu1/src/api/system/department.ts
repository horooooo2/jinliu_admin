import { request } from '@/utils/request'

// 查询部门树状结构
export const getTree = (params: any) => {
  return request.get('/pay-user/system/department/tree', { params })
}

// 添加
export const addDepartment = (data: any) => {
  return request.post('/pay-user/system/department/add', data)
}

// 编辑
export const editDepartment = (data: any) => {
  return request.put('/pay-user/system/department/edit', data)
}
// 删除
export const deleteDepartment = (data: Array<number>) => {
  return request.delete('/pay-user/system/department/delete', {data})
}


// 查询权限分配
export const getAllTree = (params: any) => {
  return request.get('/pay-user/system/menu/all-tree', { params })
}

// 查询部门权限分配
export const getDepartmentTree = (params: any) => {
  return request.get('/pay-user/system/menu/department-tree', { params })
}

