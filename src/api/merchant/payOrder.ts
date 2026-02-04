import { request } from '@/utils/request'

// 获取商户支付订单列表参数
export interface MerchantPaymentOrderParams {
  sortType?: number // 排序 1:帐户馀额降序,2:预付押金降序
  pageNo: number
  pageSize: number
  username?: string // 商户帐号
  orderNo?: string // 交易单号
  createdIp?: string // 提交人IP
  payerName?: string // 付款人名
  typeId?: string // 支付类型ID
  channelId?: string // 支付类型ID
  createdTime: Array<string> // 创建时间
  updatedTime?: Array<string> // 更新时间
  payStatus?: number // 支付状态
}
// 获取商户支付订单列表响应类型
export interface MerchantPaymentOrderResponse {
  code: number
  msg: string
  data: {
    size: number
    records: Array<{
      id: number
      merchantId: number // 商戶ID
      merchantCode: string // 商户编号
      merchantAccount: string // 商户账号
      money: number // 支付金额
      payerName: string // 付款人名
      actualMoney: number // 实际支付金额
      typeName: string // 支付类型名称
      fee: number // 商户手续费
      tradeNo: string // 系统订单号
      outTradeNo: string // 商户订单号
      thirdTradeNo: string // 三方单号
      createdTime: string // 創建時間
      completeTime: string // 完成时间
      payStatus: number // 支付状态
      notificationStatus: number // 通知状态 1:通知,0:未通知
    }>
    current: number
    total: number
  }
}

// 创建支付补单参数
export interface CreateMerchantPaymentOrderParams {
  merchantId: number // 商户ID
  channelId: number // 支付类型ID
  money: number // 充值金額
  remark?: string // 备注
}

// 商户支付订单详情参数
export interface MerchantPaymentOrderDetailParams {
  id: number
}

// 获取支付类型参数
export interface GetMerchantPaymentTypesParams {
  pageNo: number // 页码
  pageSize: number // 每页数量
  name?: string // 支付类型名称
}
// 获取支付类型响应类型
export interface GetMerchantPaymentTypesResponse {
  code: number
  msg: string
  data: {
    size: number
    records: Array<{
      id: number
      code: string // 支付类型编码
      name: string // 支付类型名称
      rate: number // 费率
      fixedFee: number // 固定手续费
      status: number // 状态 1:启用,0:禁用
    }>
    current: number
    total: number
  }
}

// 支付补单参数
export interface CompletionMerchantPaymentOrderParams {
  orderId: number // 支付订单ID
  actualMoney: number // 实际支付金额
  remark?: string // 备注
}

// 关闭订单参数
export interface CloseMerchantPaymentOrderParams {
  orderId: number // 支付订单ID
  remark?: string // 备注
}

// 回调商户订单结果参数
export interface NotifyMerchantPaymentOrderParams {
  orderId: number // 支付订单ID
}

// 禁用付款人姓名参数
export interface DisableMerchantPaymentOrderPayerNameParams {
  payerName: string // 付款人名
}

// 禁用请求IP参数
export interface DisableMerchantPaymentOrderRequestIpParams {
  ip: string // 请求IP
}

// 支付单刷新参数
export interface RefreshMerchantPaymentOrderParams {
  tradeNo: string // 系统订单号
}

// 支付单刷新返回参数
export interface RefreshMerchantPaymentOrderResponse {
  code: number
  msg: string
  data: {
    tradeNo: string // 系统订单号
    thirdTradeNo: string // 三方单号
    money: number // 订单金额
    actualThirdFee: number // 三方手续费
    actualMoney: number // 实际支付金额
    payStatus: number // 支付状态
    code: number // 三方返回码
    msg: string // 三方返回信息
  }
}



// 商户支付订单列表
export const getMerchantPaymentOrderList = (params: MerchantPaymentOrderParams) => {
  return request.get<MerchantPaymentOrderResponse>('/pay-bank/payment-order/page', { params })
}

// 商户支付订单导出
export const exportMerchantPaymentOrderList = (params: MerchantPaymentOrderParams) => {
  return request.get('/pay-bank/payment-order/export', { params })
}

// 商户支付订单详情
export const getMerchantPaymentOrderDetail = (params: any) => {
  return request.get('/pay-bank/payment-order/detail', { params })
}

// 获取支付类型
export const getMerchantPaymentTypes = (data: GetMerchantPaymentTypesParams) => {
  return request.get<GetMerchantPaymentTypesResponse>('/pay-bank/payment-type/page', { data })
}

// 创建支付补单
export const createMerchantPaymentOrder = (data: CreateMerchantPaymentOrderParams) => {
  return request.post('/pay-bank/payment-order/create', data)
}

// 支付补单
export const completionMerchantPaymentOrder = (data: CompletionMerchantPaymentOrderParams) => {
  return request.post('/pay-bank/payment-order/completion', data)
}

// 关闭订单
export const closeMerchantPaymentOrder = (data: CloseMerchantPaymentOrderParams) => {
  return request.post('/pay-bank/payment-order/close', data)
}

// 回调商户订单结果
export const notifyMerchantPaymentOrder = (params: NotifyMerchantPaymentOrderParams) => {
  return request.post('/pay-bank/payment-order/notify', { params })
}

// 禁用付款人姓名
export const disableMerchantPaymentOrderPayerName = (params: DisableMerchantPaymentOrderPayerNameParams) => {
  return request.post('/pay-bank/payment-order/disable-payer-name', { params })
}

// 禁用请求IP
export const disableMerchantPaymentOrderRequestIp = (params: DisableMerchantPaymentOrderRequestIpParams) => {
  return request.post('/pay-bank/payment-order/disable-request-ip', { params })
}

// 支付单刷新
export const refreshMerchantPaymentOrder = (params: RefreshMerchantPaymentOrderParams) => {
  return request.post<RefreshMerchantPaymentOrderResponse>('/pay-bank/payment-order/refresh', { params })
}

// 





