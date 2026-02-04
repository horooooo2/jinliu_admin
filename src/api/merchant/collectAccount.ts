import { request } from '@/utils/request'

// 获取代付银行列表参数
export interface MerchantPayoutBankParams {
  sortType: number // 排序 1:帐户馀额降序,2:预付押金降序
  pageNo: number
  pageSize: number
  name?: string // 银行名称
}
// 获取代付银行列表响应类型
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
      createdBy: string // 创建人
      createdTime: string // 创建时间（时间戳/字符串按你们全局约定）
      updatedBy: string // 最后更新人
      updatedTime: string // 最后更新时间
      deleted: number // 是否删除 0：否 1：是
    }>
    current: number
    total: number
  }
}

// 代付银行添加参数
export interface MerchantPayoutBankAddParams {
  id?: number
  type: number // 银行类型 1:银行卡,2:USDT,3:支付宝
  code: string // 银行代码
  name: string // 银行名称
  currency: string // 货币种类 CNY:人民币,THB:泰铢,INR:印度卢比,PHP:披索,IDR:印尼盾
  remark: string // 银行描述
  sort: number // 排序
}

// 代付银行编辑名称参数
export interface MerchantPayoutBankEditNameParams {
  id: number
  name: string // 银行名称
}

// 代付银行编辑排序参数
export interface MerchantPayoutBankEditSortParams {
  id: number
  sort: number // 排序
}

// 代付银行删除参数
export interface MerchantPayoutBankDeleteParams {
  id: number
}



// 代付银行列表
export const getMerchantPayoutBankList = (params: MerchantPayoutBankParams) => {
  return request.get<MerchantPayoutBankResponse>('/pay-bank/payout-bank/page', { params })
}

// 代付银行添加
export const addMerchantPayoutBank = (data: MerchantPayoutBankAddParams) => {
  return request.post('/pay-bank/payout-bank/add', data)
}

// 代付银行编辑
export const editMerchantPayoutBank = (data: MerchantPayoutBankAddParams) => {
  return request.put('/pay-bank/payout-bank/edit', data)
}

// 代付银行编辑名称
export const editMerchantPayoutBankName = (params: MerchantPayoutBankEditNameParams) => {
  return request.put('/pay-bank/payout-bank/edit-name', { params })
}

// 代付银行编辑排序
export const editMerchantPayoutBankSort = (params: MerchantPayoutBankEditSortParams) => {
  return request.put('/pay-bank/payout-bank/edit-sort', { params })
}

// 代付银行删除
export const deleteMerchantPayoutBank = (params: MerchantPayoutBankDeleteParams) => {
  return request.delete('/pay-bank/payout-bank/delete', { params })
}