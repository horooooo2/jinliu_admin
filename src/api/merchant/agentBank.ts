import { request } from '@/utils/request'

// 提现银行列表参数
export interface MerchantPayoutBankParams {
  sortType?: number // 排序 1:帐户馀额降序,2:预付押金降序
  pageNo: number
  pageSize: number
  name?: string // 银行名称
}
// 提现银行列表响应类型
export interface MerchantPayoutBankResponse {
  code: number
  msg: string
  data: {
    size: number
    records: Array<{
      id: number
      type: number // 银行类型 1:银行卡,2:USDT,3:支付宝
      code: string // 银行代码
      name: string // 银行名称
      currency: string // 货币种类 CNY:人民币,THB:泰铢,INR:印度卢比,PHP:披索,IDR:印尼盾
      remark: string // 银行描述
      sort: number // 排序
    }>
    current: number
    total: number
  }
}

// 提现银行添加参数
export interface MerchantPayoutBankAddParams {
  id?: number
  type: number // 银行类型 1:银行卡,2:USDT,3:支付宝
  code: string // 银行代码
  name: string // 银行名称
  currency: string // 货币种类 CNY:人民币,THB:泰铢,INR:印度卢比,PHP:披索,IDR:印尼盾
  remark: string // 银行描述
  sort: number // 排序
}

// 提现银行编辑名称参数
export interface MerchantPayoutBankEditNameParams {
  id: number
  name: string // 银行名称
}

// 提现银行编辑排序参数
export interface MerchantPayoutBankEditSortParams {
  id: number
  sort: number // 排序
}

// 提现银行删除参数
export interface MerchantPayoutBankDeleteParams {
  id: number
}


// 提现银行列表
export const getMerchantWithdrawalBankList = (params: MerchantPayoutBankParams) => {
  return request.get<MerchantPayoutBankResponse>('/pay-bank/withdrawal-bank/page', { params })
}
// 提现银行添加
export const addMerchantWithdrawalBank = (data: MerchantPayoutBankAddParams) => {
  return request.post('/pay-bank/withdrawal-bank/add', data)
}
// 提现银行编辑
export const editMerchantWithdrawalBank = (data: MerchantPayoutBankAddParams) => {
  return request.put('/pay-bank/withdrawal-bank/edit', data)
}
// 提现银行编辑名称
export const editMerchantWithdrawalBankName = (data: MerchantPayoutBankEditNameParams) => {
  return request.put('/pay-bank/withdrawal-bank/edit-name', { data })
}
// 提现银行编辑排序
export const editMerchantWithdrawalBankSort = (data: MerchantPayoutBankEditSortParams) => {
  return request.put('/pay-bank/withdrawal-bank/edit-sort', { data })
}
// 提现银行删除
export const deleteMerchantWithdrawalBank = (ids: Array<number>) => {
  return request.delete('/pay-bank/withdrawal-bank/delete', { data: ids })
}