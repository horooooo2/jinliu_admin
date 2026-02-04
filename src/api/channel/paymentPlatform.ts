import { request } from '@/utils/request'

// 支付平台列表参数
export interface paymentPlatformListParams {
  sortType?: number // 排序 1:帐户馀额降序,2:预付押金降序
  pageNo: number //
  pageSize: number //
  name?: string // 平台名称
}
// 支付平台列表返回参数
export interface paymentPlatformListResponse {
  code: number
  msg: string
  data: {
    size: number
    records: Array<{
      id: number
      name: string // 平台名称
      code: string // 平台代码
      distributeRate: number // 下发费率
      balance: number // 平台余额
      balanceMax: number // 余额上限
      thirdBalance: number // 三方余额
      upstreamDeposit: number // 上游押金
      status: number // 状态
      sort: number // 排序
    }>
    current: number
    total: number
  }
}

// 支付平台详情参数
export interface paymentPlatformDetailParams {
  id: number
}

// 支付平台添加参数
export interface paymentPlatformAddParams {
  id?: number // 主键ID
  name: string // 平台名称
  code: string // 平台代码
  distributeRate: number // 下发费率
  balanceMax: number // 余额上限
  upstreamDeposit: number // 上游押金
  merchantAccount: string // 商户账号
  merchantKey: string // 商户密钥
  extendedKey1: string // 扩展密钥1
  extendedKey2: string // 扩展密钥2
  extendedKey3: string // 扩展密钥3
  createOrderUrl: string // 网关接口
  queryOrderUrl: string // 查询接口
  queryBalanceUrl: string // 余额接口
  whitelistedIp: string // 白名单IP
}

// 支付平台编辑平台名称参数
export interface editPaymentPlatformNameParams {
  id: number
  name: string
}

// 支付平台编辑平台余额上限参数
export interface editPaymentPlatformBalanceMaxParams {
  id: number
  balanceMax: number
}

// 支付平台编辑平台上游押金参数
export interface editPaymentPlatformUpstreamDepositParams {
  id: number
  upstreamDeposit: number
}

// 支付平台编辑排序参数
export interface editPaymentPlatformSortParams {
  id: number
  sort: number
}

// 支付平台删除参数
export interface deletePaymentPlatformParams {
  id: number
}

// 查询三方金流余额参数
export interface queryThirdBalanceParams {
  id: number
}

// 支付平台列表
export const getPaymentPlatformList = (params: paymentPlatformListParams) => {
  return request.get<paymentPlatformListResponse>('/pay-bank/payment-platform/page', { params })
}
// 支付平台详情
export const getPaymentPlatformDetail = (params: paymentPlatformDetailParams) => {
  return request.get('/pay-bank/payment-platform/detail', { params })
}
// 支付平台添加
export const addPaymentPlatform = (data: paymentPlatformAddParams) => {
  return request.post('/pay-bank/payment-platform/add', data)
}
// 支付平台编辑
export const editPaymentPlatform = (data: paymentPlatformAddParams) => {
  return request.post('/pay-bank/payment-platform/edit', data)
}
// 支付平台编辑平台名称
export const editPaymentPlatformName = (params: editPaymentPlatformNameParams) => {
  return request.post('/pay-bank/payment-platform/edit-name', { params })
}
// 支付平台编辑平台余额上限
export const editPaymentPlatformBalanceMax = (params: editPaymentPlatformBalanceMaxParams) => {
  return request.post('/pay-bank/payment-platform/edit-balance-max', { params })
}
// 支付平台编辑平台上游押金
export const editPaymentPlatformUpstreamDeposit = (params: editPaymentPlatformUpstreamDepositParams) => {
  return request.post('/pay-bank/payment-platform/edit-upstream-deposit', { params })
}
// 支付平台编辑排序
export const editPaymentPlatformSort = (params: editPaymentPlatformSortParams) => {
  return request.post('/pay-bank/payment-platform/edit-sort', { params })
}
// 查询三方金流余额
export const queryThirdBalance = (params: queryThirdBalanceParams) => {
  return request.post('/pay-bank/payment-platform/query-third-balance', { params })
}
// 支付平台删除
export const deletePaymentPlatform = (data: deletePaymentPlatformParams) => {
  return request.post('/pay-bank/payment-platform/delete', { data })
}