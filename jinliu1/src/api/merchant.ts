import { request } from '@/utils/request'
import { A } from 'vue-router/dist/router-CWoNjPRp.mjs'

// 商户接口类型定义

// 获取商户列表参数
export interface MerchantListParams {
  channelId: string
}
// 获取商户财务记录参数
export interface MerchantFinancialRecordParams {
  sortType?: number // 排序 1:帐户馀额降序,2:预付押金降序
  pageNo: number // 页码
  pageSize: number // 每页笔数
  merchantId: string // 商户ID
  merchantAccount?: string // 商户账号
  financialType?: number // 财务类型 1:支付,2:提现,3:冻结,4:解冻,5:佣金,6:代充,7:代付,8:微调
  remark?: string // 财务备注
  createdTimeStart?: string // 开始时间
}
// 获取商户财务记录响应类型
export interface MerchantFinancialRecordResponse {
  code: number
  msg: string
  data: {
    size: number
    records: Array<{
      id: string
      merchantId: string // 商户ID
      merchantAccount: string // 商户账号
      financialType: number // 财务类型 1:支付,2:提现,3:冻结,4:解冻,5:佣金,6:代充,7:代付,8:微调
      money: number // 数量
      fee: number // 手续费
      assocOrderNo: string // 关连单号
      remark: string // 财务备注
      afterChangeBalance: number // 变更后(余额)
      afterChangeFrozenAmount: number // 变更后(冻结金额)
      afterChangePrepaidDeposit: number // 变更后(预付押金)
      createdBy: string
      createdTime: string
    }>
    current: number
    total: number
  }
}

// 获取商户列表
export const getMerchantList = (params: MerchantListParams) => {
  return request.get('/pay-bank/payment-channel/query-merchants', { params })
}

// 获取商户财务记录
export const getMerchantFinancialRecord = (params: MerchantFinancialRecordParams) => {
  return request.get<MerchantFinancialRecordResponse>('/pay-bank/merchant-financial-record/page', { params })
}

// 商户财务记录导出
export const exportMerchantFinancialRecord = (params: MerchantFinancialRecordParams) => {
  return request.get('/pay-bank/merchant-financial-record/export', { params })
}
