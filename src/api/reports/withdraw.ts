import { request } from '@/utils/request'


// 日报表
export const getList = (params: any) => {
  return request.get('/pay-report/withdrawal-order-daily/page', { params })
}
// 日报表导出
export const exportList = (params: any) => {
  return request.get('/pay-report/withdrawal-order-daily/export', { params })
}
// 月报表
export const getMonthList = (params: any) => {
  return request.get('/pay-report/withdrawal-order-daily/page-month', { params })
}
// 月报表导出
export const exportMonthList = (params: any) => {
  return request.get('/pay-report/withdrawal-order-daily/export-month', { params })
}