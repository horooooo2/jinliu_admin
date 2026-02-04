import { request } from '@/utils/request'

// 桌面仪表盘数据参数
export interface DesktopDashboardInfoParams {
  startTime?: string // 开始时间
  endTime?: string // 结束时间
}
// 桌面仪表盘数据响应类型
export interface DesktopDashboardInfoResponse {
  code: number
  msg: string
  data: {
    merchantBalanceMap: { // 商户累计账户余额
      additionalProp1: number
      additionalProp2: number
      additionalProp3: number
    },
    merchantFrozenAmountMap: { // 商户累计冻结金额
      additionalProp1: number
      additionalProp2: number
      additionalProp3: number
    },
    paymentActualMoneyMap: { // 商户支付总额
      additionalProp1: number
      additionalProp2: number
      additionalProp3: number
    },
    paymentSuccessMap: { // 商户支付成功率
      additionalProp1: {
        successCount: number // 成功笔数
        submitCount: number // 提交笔数
        successRate: number // 成功率
      },
      additionalProp2: {
        successCount: number
        submitCount: number
        successRate: number
      },
      additionalProp3: {
        successCount: number
        submitCount: number
        successRate: number
      }
    },
    payoutActualMoneyMap: { // 商户代付总额
      additionalProp1: number
      additionalProp2: number
      additionalProp3: number
    },
    payoutSuccessMap: { // 商户代付成功率
      additionalProp1: {
        successCount: number
        submitCount: number
        successRate: number
      },
      additionalProp2: {
        successCount: number
        submitCount: number
        successRate: number
      },
      additionalProp3: {
        successCount: number
        submitCount: number
        successRate: number
      }
    }
  }
}

// 获取桌面仪表盘数据
export const getDesktopDashboardInfo = (params: DesktopDashboardInfoParams) => {
  return request.get<DesktopDashboardInfoResponse>('/pay-bank/dashboard/info', { params })
}