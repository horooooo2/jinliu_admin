import { request } from '@/utils/request'

// 支付通道列表参数
export interface paymentChannelListParams {
  sortType?: number // 排序 1:帐户馀额降序,2:预付押金降序
  pageNo: number //
  pageSize: number //
  name?: string // 通道名称
  typeId?: number // 通道类型
  platformId?: number // 支付平台ID
  status?: number // 状态
}
// 支付通道列表返回参数
export interface paymentChannelListResponse {
  code: number
  msg: string
  data: {
    size: number
    records: Array<{
      id: number // 主键ID
      name: string // 通道名称
      platformName: string // 平台名称
      typeName: string // 通道类型名称
      channelCode: string // 通道代码
      upstreamChannelRate: number // 上游通道费率
      upstreamChannelFixedFee: number // 上游通道固费
      singleAmountMin: number // 单笔下限
      singleAmountMax: number // 单笔上限
      status: number // 状态
      sort: number // 排序
    }>
    current: number
    total: number
  }
}

// 支付通道添加参数
export interface addPaymentChannelParams {
  id?: number // 主键ID
  typeId: number // 支付类型ID
  name: string // 通道名称
  platformId: number // 支付平台ID
  methodId: number // 支付方法ID
  channelCode: string // 通道代码
  uniqueDecimalAmount: number // 唯一小数金额
  forceSubmitName: number // 强制提交姓名
  enableNameRiskControl: number // 开启姓名风控
  fixedAmountList: string // 固定金额列表
  upstreamChannelRate: number // 上游通道费率
  upstreamChannelFixedFee: number // 上游通道固费
  singleAmountMin: number // 单笔下限
  singleAmountMax: number // 单笔上限
  sort: number // 排序
}


// 支付通道列表
export const getPaymentChannelList = (params: paymentChannelListParams) => {
  return request.get<paymentChannelListResponse>('/pay-bank/payment-channel/page', { params })
}
// 支付通道添加
export const addPaymentChannel = (data: addPaymentChannelParams) => {
  return request.post('/pay-bank/payment-channel/add', data)
}
// 支付通道编辑
export const editPaymentChannel = (data: addPaymentChannelParams) => {
  return request.put('/pay-bank/payment-channel/edit', data)
}
// 支付通道删除
export const deletePaymentChannel = (id: number) => {
  return request.delete('/pay-bank/payment-channel/delete', { data: { id } })
}