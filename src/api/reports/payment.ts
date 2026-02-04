import { request } from '@/utils/request'

// 日报表
export const getList = (params: any) => {
  return request.get('/pay-report/payment-order-daily/page', { params })
}
// 日报表导出
export const exportList = (params: any) => {
  return request.get('/pay-report/payment-order-daily/export', { params })
}

// 商户通道日报表
export const channelList = (params: any) => {
  return request.get('/pay-report/payment-channel-daily/page', { params })
}
// 商户通道日报表导出
export const exportChannelList = (params: any) => {
  return request.get('/pay-report/payment-channel-daily/export', { params })
}

// 月报表
export const getMonthList = (params: any) => {
  return request.get('/pay-report/payment-order-daily/page-month', { params })
}
// 月报表导出
export const exportMonthList = (params: any) => {
  return request.get('/pay-report/payment-order-daily/export-month', { params })
}