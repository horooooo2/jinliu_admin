import { request } from '@/utils/request'

// 代付平台列表参数
export interface behalfPlatformListParams {
  sortType: number // 排序 1:帐户馀额降序,2:预付押金降序
  pageNo: number
  pageSize: number
  name: string // 平台名称
}
// 代付平台列表返回
export interface behalfPlatformListResponse {
  code: number
  msg: string
  data: {
    size: number
    records: Array<{
      id: number
      code: string // 平台代码
      name: string // 平台名称
      feeMoney: number // 单笔费率数量
      feeRate: number // 单笔费率％
      fixedFee: number // 单笔固费
      thirdBalance: number // 三方余额
      payoutSingleMin: number // 代付单笔限额起
      payoutSingleMax: number // 代付单笔限额迄
      status: number // 状态 1:启用,0:禁用
      sort: number // 排序
      createdTime: string // 创建时间
    }>
    total: number
    current: number
  }
}

// 代付平台详情参数
export interface behalfPlatformDetailParams {
  id: number
}
//代付平台详情返回
export interface behalfPlatformDetailResponse {
  code: number
  msg: string
  data: {
    id: number
    code: string // 平台代码
    name: string // 平台名称
    currency: string // 货币种类
    feeMoney: number // 单笔费率数量
    feeRate: number // 单笔费率％
    fixedFee: number // 单笔固费
    thirdBalance: number // 三方余额
    payoutSingleMin: number // 代付单笔限额起
    payoutSingleMax: number // 代付单笔限额迄
    merchantAccount: string // 商户账号
    merchantKey: string // 商户密钥
    extendedKey1: string // 扩展密钥1
    extendedKey2: string // 扩展密钥2
    extendedKey3: string // 扩展密钥3
    createOrderUrl: string // 网关接口
    queryOrderUrl: string // 查询接口
    queryBalanceUrl: string // 余额接口
    whitelistedIp: string // 白名单IP
    status: number // 状态 1:启用,0:禁用
    sort: number // 排序
    banks: Array<{ // 银行列表
      bankId: number // 银行ID
      thirdBankCode: string // 三方银行代码
    }>
  }
}

// 代付平台添加参数
export interface behalfPlatformAddParams {
  id?: number
  code: string // 平台代码
  name: string // 平台名称
  currency: string // 货币种类 CNY:人民币,THB:泰铢,INR:印度卢比,PHP:披索,IDR:印尼盾
  feeMoney: number // 单笔费率数量
  feeRate: number // 单笔费率％
  fixedFee: number // 单笔固费
  payoutSingleMin: number // 代付单笔限额起
  payoutSingleMax: number // 代付单笔限额迄
  merchantAccount: string // 商户账号
  merchantKey: string // 商户密钥
  extendedKey1: string // 扩展密钥1
  extendedKey2: string // 扩展密钥2
  extendedKey3: string // 扩展密钥3
  createOrderUrl: string // 网关接口
  queryOrderUrl: string // 查询接口
  queryBalanceUrl: string // 余额接口
  whitelistedIp: string // 白名单IP
  sort: number // 排序
  banks: Array<{ // 银行列表
    bankId: number // 银行ID
    thirdBankCode: string // 三方银行代码
  }>
}
// 代付平台编辑状态参数
export interface editBehalfPlatformStatusParams {
  id: number
  status: number // 状态 1:启用,0:禁用
}
// 代付平台编辑名称参数
export interface editBehalfPlatformNameParams {
  id: number
  name: string // 平台名称
}

// 代付平台编辑排序参数
export interface editBehalfPlatformSortParams {
  id: number
  sort: number // 排序
}
// 代付平台删除参数
export interface deleteBehalfPlatformParams {
  id: number
}




// 代付平台列表
export const getBehalfPlatformList = (params: behalfPlatformListParams) => {
  return request.get<behalfPlatformListResponse>('/pay-bank/payout-platform/page', { params })
}
// 代付平台详情
export const getBehalfPlatformDetail = (params: behalfPlatformDetailParams) => {
  return request.get<behalfPlatformDetailResponse>('/pay-bank/payout-platform/detail', { params })
}
// 代付平台添加
export const addBehalfPlatform = (data: behalfPlatformAddParams) => {
  return request.post('/pay-bank/payout-platform/add', data)
}
// 代付平台编辑
export const editBehalfPlatform = (data: behalfPlatformAddParams) => {
  return request.put('/pay-bank/payout-platform/edit', data)
}
// 代付平台编辑名称
export const editBehalfPlatformName = (params: editBehalfPlatformNameParams) => {
  return request.put('/pay-bank/payout-platform/edit-name', { params })
}
// 代付平台编辑排序
export const editBehalfPlatformSort = (params: editBehalfPlatformSortParams) => {
  return request.put('/pay-bank/payout-platform/edit-sort', { params })
}
// 代付平台编辑状态
export const editBehalfPlatformStatus = (params: editBehalfPlatformStatusParams) => {
  return request.put('/pay-bank/payout-platform/edit-status', { params })
}
// 代付平台删除
export const deleteBehalfPlatform = (params: deleteBehalfPlatformParams) => {
  return request.delete('/pay-bank/payout-platform/delete', { params })
}