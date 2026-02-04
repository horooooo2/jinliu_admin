import { request } from '@/utils/request'

// 代付订单列表参数
export interface MerchantPayoutOrderParams {
  sortType?: number // 排序 1:帐户馀额降序,2:预付押金降序
  pageNo: number
  pageSize: number
  merchantAccount?: string // 商户账号
  tradeNo?: string // 系统订单号
  payStatus?: number // 代付状态 1:待处理,2:代付中,3:建单失败,4:建单超时,5:用户取消,6:系统取消,7:商户取消,8:超时未回,9:代付成功,10:代付失败
  createdTime: string[] // 创建时间
  completeTime: string[] // 完成时间
  updatedBy?: string // 操作者
}
// 代付订单列表响应类型
export interface MerchantPayoutOrderResponse {
  code: number
  msg: string
  data: {
    size: number
    records: Array<{
      id: number
      merchantId: number // 商户ID
      merchantCode: string // 商户编号
      merchantAccount: string // 商户账号
      money: number // 代付金额
      actualMoney: number // 已付金额
      fee: number // 商户手续费
      thirdFee: number // 三方手续费
      actualThirdFee: number // 实际三方手续费
      tradeNo: string // 系统订单号
      outTradeNo: string // 商户单号
      thirdTradeNo: string // 三方单号
      realName: string // 开户姓名
      bankName: string // 银行名称
      bankNumber: string // 代付银行卡号
      completeTime: string // 完成时间
      payStatus: number // 代付状态 1:待处理,2:代付中,3:建单失败,4:建单超时,5:用户取消,6:系统取消,7:商户取消,8:超时未回,9:代付成功,10:代付失败
      thirdStatus: number // 三方状态
      notificationStatus: number // 通知状态 1:通知,0:未通知
      createdTime: string // 创建时间
    }>
    current: number
    total: number
  }
}

// 代付订单详情参数
export interface MerchantPayoutOrderDetailParams {
  id: number
}

// 转上游订单参数
export interface MerchantPayoutOrderRerouteParams {
  platformId: number // 支付平台ID
  orderId: number // 代付订单ID
}

// 领取参数
export interface MerchantPayoutOrderReceiveParams {
  orderId: number // 代付订单ID
}

// 手动出款参数
export interface MerchantPayoutOrderManualDisburseParams {
  orderId: number // 代付订单ID
}

// 手动驳回参数
export interface MerchantPayoutOrderManualRejectParams {
  orderId: number // 代付订单ID
}

// 手动冲正参数
export interface MerchantPayoutOrderManualReversalParams {
  orderId: number // 代付订单ID
}

// 商户订单结果回调参数
export interface MerchantPayoutOrderNotifyParams {
  orderId: number // 代付订单ID
}

// 三方代付订单列表参数
export interface MerchantPayoutUpstreamOrderParams {
  orderId: number // 代付订单ID
}
// 三方代付订单列表响应类型
export interface MerchantPayoutUpstreamOrderResponse {
  code: number
  msg: string
  data: Array<{
    id: number
    createdTime: string // 创建时间
    updatedTime: string // 更新时间
    tradeNo: string // 系统订单号
    externalNo: string // 三方订单号
    platformName: string // 支付平台名称
    money: number // 代付金额
    thirdFee: number // 三方手续费
    createdBy: string // 创建人
    thirdStatus: number // 三方状态
  }>
}
// 刷新参数
export interface MerchantPayoutUpstreamOrderRefreshParams {
  orderId: number // 代付订单ID
}
// 刷新响应类型
export interface MerchantPayoutUpstreamOrderRefreshResponse {
  code: number
  msg: string
  data: {
    orderId: number // 代付订单ID
    thirdTradeNo: string // 三方单号
    money: number // 订单金额
    actualThirdFee: number // 三方手续费
    thirdStatus: string // 代付状态
    thirdCode: string // 三方响应代码
    thirdMsg: string // 三方响应信息
  }
}

// 手动修改成功参数
export interface MerchantPayoutUpstreamOrderManualSuccessParams {
  orderId: number // 代付订单ID
}

// 手动修改失败参数
export interface MerchantPayoutUpstreamOrderManualFailParams {
  orderId: number // 代付订单ID
}


// 代付订单列表
export const getMerchantPayoutOrderList = (params: MerchantPayoutOrderParams) => {
  return request.get<MerchantPayoutOrderResponse>('/pay-bank/payout-order/page', { params })
}
// 代付订单详情
export const getMerchantPayoutOrderDetail = (params: MerchantPayoutOrderDetailParams) => {
  return request.get<MerchantPayoutOrderResponse>('/pay-bank/payout-order/detail', { params })
}
// 代付订单导出
export const getMerchantPayoutOrderExport = (params: MerchantPayoutOrderParams) => {
  return request.get('/pay-bank/payout-order/export', { params })
}
// 转上游订单
export const rerouteMerchantPayoutOrder = (data: MerchantPayoutOrderRerouteParams) => {
  return request.post('/pay-bank/payout-order/reroute', data)
}
// 领取
export const receiveMerchantPayoutOrder = (data: MerchantPayoutOrderReceiveParams) => {
  return request.post('/pay-bank/payout-order/receive', { data })
}
// 手动出款
export const manualDisburseMerchantPayoutOrder = (data: MerchantPayoutOrderManualDisburseParams) => {
  return request.post('/pay-bank/payout-order/manual-disburse', { data })
}
// 手动驳回
export const manualRejectMerchantPayoutOrder = (data: MerchantPayoutOrderManualRejectParams) => {
  return request.post('/pay-bank/payout-order/manual-reject', { data })
}
// 手动冲正
export const manualReversalMerchantPayoutOrder = (data: MerchantPayoutOrderManualReversalParams) => {
  return request.post('/pay-bank/payout-order/manual-reversal', { data })
}
// 商户订单结果回调
export const notifyMerchantPayoutOrder = (data: MerchantPayoutOrderNotifyParams) => {
  return request.post('/pay-bank/payout-order/notify', { data })
}

// ----------三方代付订单----------------

// 三方代付订单列表
export const getMerchantPayoutUpstreamOrderList = (params: MerchantPayoutUpstreamOrderParams) => {
  return request.get<MerchantPayoutUpstreamOrderResponse>('/pay-bank/payout-upstream-order/list/' + params.orderId)
}
// 刷新
export const refreshMerchantPayoutUpstreamOrder = (data: MerchantPayoutUpstreamOrderRefreshParams) => {
  return request.post<MerchantPayoutUpstreamOrderRefreshResponse>('/pay-bank/payout-upstream-order/refresh', { data })
}
// 手动修改成功
export const manualSuccessMerchantPayoutUpstreamOrder = (data: MerchantPayoutUpstreamOrderManualSuccessParams) => {
  return request.post('/pay-bank/payout-upstream-order/manual-success', { data })
}
// 手动修改失败
export const manualFailedMerchantPayoutUpstreamOrder = (data: MerchantPayoutUpstreamOrderManualFailParams) => {
  return request.post('/pay-bank/payout-upstream-order/manual-failed', { data })
}
