import { request } from '@/utils/request'


// 获取员工列表
export const getList = (params: any) => {
  return request.get('/pay-user/merchant-user/page', { params })
}

// 添加员工
export const addMerchantUser = (data: any) => {
  return request.post('/pay-user/merchant-user/add', data)
}
// 编辑
export const editMerchantUser = (data: any) => {
  return request.put('/pay-user/merchant-user/edit', data)
}
// 编辑状态
export const editstatusMerchantUser = (params: any) => {
  return request.put('/pay-user/merchant-user/edit-status', { params })
}
// 删除
export const deleteMerchantUser = (data: Array<number>) => {
  return request.delete('/pay-user/merchant-user/delete', { data })
}
// 查询权限分配
export const getAllTree = (params: any) => {
  return request.get('/pay-user/system/menu/all-tree', { params })
}
// 查询员工权限分配
export const getMerchantUserTree = (params: any) => {
  return request.get('/pay-user/system/menu/merchant-user-tree', { params })
}