import { request } from '@/utils/request'

// 提现订单列表参数
export interface MerchantPayoutBankParams {
  sortType: number // 排序 1:帐户馀额降序,2:预付押金降序
  pageNo: number
  pageSize: number
  username?: string // 商户账号
  tradeNo?: string // 系统订单号
  outTradeNo?: string // 商户订单号
  createdTime: Array<string> // 创建时间
  updatedTime?: Array<string> // 更新时间
  payStatus?: number // 提现状态 1:待打款,2:已打款,3:已驳回
}
// 提现订单列表参数响应类型
export interface MerchantPayoutBankResponse {
  code: number
  msg: string
  data: {
    size: number
    records: Array<{
      id: number
      merchantId: number // 商户ID
      merchantCode: string // 商户代码
      merchantAccount: string // 商户账号
      money: number // 提现金额
      fee: number // 商户手续费
      actualMoney: number // 打款金额
      tradeNo: string // 平台订单号
      outTradeNo: string // 商户订单号
      bankName: string // 银行名称
      realName: string // 开户姓名
      bankNumber: string // 代付银行卡号(或是数字钱包地址)
      bankAddress: string // 银行开户网点
      payStatus: number // 代付状态
      notificationStatus: number // 通知状态 1:通知,0:未通知
      thirdStatus: string // 三方状态
      createdTime: string // 创建时间
      completeTime: string // 完成时间
      receivedBy: string // 已领取者
    }>
    current: number
    total: number
  }
}

// 提现订单详情参数
export interface MerchantWithdrawalOrderDetailParams {
  id: number
}

// 领取参数
export interface MerchantWithdrawalOrderReceiveParams {
  orderId: number
}

// 手动出款参数
export interface MerchantWithdrawalOrderManualWithdrawalParams {
  orderId: number
}

// 手动驳回参数
export interface MerchantWithdrawalOrderManualRejectParams {
  orderId: number
}

// 回调商户订单结果参数
export interface MerchantWithdrawalOrderNotifyParams {
  orderId: number
}



// 提现订单列表
export const getMerchantWithdrawalOrderList = (params: MerchantPayoutBankParams) => {
  return request.get<MerchantPayoutBankResponse>('/pay-bank/withdrawal-order/page', { params })
}

// 提现订单详情
export const getMerchantWithdrawalOrderDetail = (params: MerchantWithdrawalOrderDetailParams) => {
  return request.get<MerchantPayoutBankResponse>('/pay-bank/withdrawal-order/detail', { params })
}

// 导出提现订单列表
export const exportMerchantWithdrawalOrderList = (params: MerchantPayoutBankParams) => {
  return request.get('/pay-bank/withdrawal-order/export', { params })
}

// 领取
export const receiveMerchantWithdrawalOrder = (params: MerchantWithdrawalOrderReceiveParams) => {
  return request.post('/pay-bank/withdrawal-order/receive', { params })
}

// 手动出款
export const manualWithdrawalMerchantWithdrawalOrder = (params: MerchantWithdrawalOrderManualWithdrawalParams) => {
  return request.post('/pay-bank/withdrawal-order/manual-withdrawal', { params })
}

// 手动驳回
export const manualRejectMerchantWithdrawalOrder = (params: MerchantWithdrawalOrderManualRejectParams) => {
  return request.post('/pay-bank/withdrawal-order/manual-reject', { params })
}

// 回调商户订单结果
export const notifyMerchantWithdrawalOrder = (params: MerchantWithdrawalOrderNotifyParams) => {
  return request.post('/pay-bank/withdrawal-order/notify', { params })
}