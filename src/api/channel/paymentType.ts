import { request } from '@/utils/request'

// 支付类型列表参数
export interface PaymentTypelListParams {
  sortType?: number // 排序 1:帐户馀额降序,2:预付押金降序
  pageNo: number //
  pageSize: number //
  name?: string // 支付类型名称
}
// 支付类型列表返回参数
export interface PaymentTypelListResponse {
  code: number
  msg: string
  data: {
    size: number
    records: Array<{
      id: number // 主键ID
      code: string // 支付类型
      name: string // 支付类型名称
      rate: number // 费率
      fixedFee: number // 固费
      status: number // 状态
    }>
    current: number
    total: number
  }
}

// 支付类型添加参数
export interface AddPaymentTypeParams {
  id?: number // 主键ID
  code: string // 支付类型
  name: string // 支付类型名称
}

// 支付类型编辑名称参数
export interface EditPaymentTypeNameParams {
  id: number
  name: string
}

// 支付类型编辑代码参数
export interface EditPaymentTypeCodeParams {
  id: number
  code: string
}
// 支付类型编辑状态参数
export interface EditPaymentTypeStatusParams {
  id: number
  status: number
}



// 支付类型列表
export const getPaymentTypeList = (params: PaymentTypelListParams) => {
  return request.get<PaymentTypelListResponse>('/pay-bank/payment-type/page', { params })
}
// 支付类型添加
export const addPaymentType = (data: AddPaymentTypeParams) => {
  return request.post('/pay-bank/payment-type/add', data)
}
// 支付类型编辑
export const editPaymentType = (data: AddPaymentTypeParams) => {
  return request.put('/pay-bank/payment-type/edit', data)
}
// 支付类型删除
export const deletePaymentType = (ids: Array<number>) => {
  return request.delete('/pay-bank/payment-type/delete', { data: ids })
}
// 支付类型编辑名称
export const editPaymentTypeName = (params: EditPaymentTypeNameParams) => {
  return request.put('/pay-bank/payment-type/edit-name', { params })
}
// 支付类型编辑代码
export const editPaymentTypeCode = (params: EditPaymentTypeCodeParams) => {
  return request.put('/pay-bank/payment-type/edit-code', { params })
}
// 支付类型编辑状态
export const editPaymentTypeStatus = (params: EditPaymentTypeStatusParams) => {
  return request.put('/pay-bank/payment-type/edit-status', { params })
}