import { request } from '@/utils/request'

// 代付充值列表参数
export interface MerchantPayoutBankParams {
  sortType?: number // 排序 1:帐户馀额降序,2:预付押金降序
  pageNo: number
  pageSize: number
  merchantAccount?: string // 商户账号
  payStatus?: number // 充值状态 1:待充值,2:已充值,3:已驳回
  createdTime: Array<string> // 创建时间
  updatedTime?: Array<string> // 处理时间
}
// 代付充值列表参数响应类型
export interface MerchantPayoutBankResponse {
  code: number
  msg: string
  data: {
    size: number
    records: Array<{
      id: number
      merchantId: number // 商户ID
      merchantCode: string // 商户编号
      merchantAccount: string // 商户账号
      currency: string // 货币种类 CNY:人民币,THB:泰铢,INR:印度卢比,PHP:披索,IDR:印尼盾
      bankName: string // 银行名称
      actualMoney: number // 实际打款金额
      fee: number // 手续费
      tradeNo: string // 平台订单号
      realName: string // 开户姓名
      bankNumber: string // 代付银行卡号(或是数字钱包地址)
      bankAddress: string // 银行开户网点
      confirmTime: string // 确认时间
      completeTime: string // 完成时间
      payStatus: number // 代充状态
      createdTime: string // 创建时间
    }>
    current: number
    total: number
  }
}

// 代付充值详情参数
export interface MerchantPayoutBankDetailParams {
  id: number
}

// 手动成功参数
export interface MerchantPayoutBankManualSuccessParams {
  orderId: number // 代充订单ID
  actualMoney: number // 实际支付数量
  priceDiffProfit: number // 差价利润
  remark: string // 财务备注
}

// 手动驳回参数
export interface MerchantPayoutBankManualRejectParams {
  orderId: number // 代充订单ID
  remarkType: number // 备注类型
  remark: string // 财务备注
}

// 分配银行卡参数
export interface MerchantPayoutBankAssignBankCardParams {
  orderId: number // 代充订单ID
  bankId: number // 代充银行ID
  realName: string // 代付开户姓名
  bankNumber: string // 代付银行卡号(或是数字钱包地址)
  bankAddress: string // 银行开户网点
}


// 代付充值列表
export const getMerchantAgentRechargeList = (params: MerchantPayoutBankParams) => {
  return request.get<MerchantPayoutBankResponse>('/pay-bank/payout-topup-order/page', { params })
}

// 导出
export const getMerchantAgentRechargeExport = (params: MerchantPayoutBankParams) => {
  return request.get('/pay-bank/payout-topup-order/export', { params })
}

// 代付充值详情
export const getMerchantAgentRechargeDetail = (params: MerchantPayoutBankDetailParams) => {
  return request.get<MerchantPayoutBankResponse>('/pay-bank/payout-topup-order/detail', { params })
}

// 手动成功
export const getMerchantAgentRechargeManualSuccess = (data: MerchantPayoutBankManualSuccessParams) => {
  return request.post('/pay-bank/payout-topup-order/manual-success', data)
}

// 手动驳回
export const getMerchantAgentRechargeManualReject = (data: MerchantPayoutBankManualRejectParams) => {
  return request.post('/pay-bank/payout-topup-order/manual-reject', data)
}

// 分配银行卡
export const getMerchantAgentRechargeAssignBankCard = (data: MerchantPayoutBankAssignBankCardParams) => {
  return request.post('/pay-bank/payout-topup-order/assign-bank-card', data)
}
