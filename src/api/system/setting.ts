import { request } from '@/utils/request'

// 查询设置
export const getConfig = (params: any) => {
  return request.get('/pay-bank/system-platform-site-config/get', { params })
}
// 保存设置
export const saveConfig = (data: any) => {
  return request.put('/pay-bank/system-platform-site-config/save', data)
}