import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import MainLayout from '../components/MainLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: () => {
      // 根据 token 决定重定向到哪里
      const token = localStorage.getItem('token')
      return token ? '/desktop' : '/login'
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'desktop',
        name: 'Desktop',
        component: () => import('../views/desktop/index.vue'),
      }
    ],
  },
  {
    path: '/codeMerchant',
    component: MainLayout,
    children: [
      {
        path: 'all',
        name: 'CodeMerchantAll',
        component: () => import('../views/codeMerchant/all/index.vue'),
      },
      {
        path: 'beneficiaryBank',
        name: 'CodeBeneficiaryBank',
        component: () => import('../views/codeMerchant/beneficiaryBank/index.vue'),
      },
      {
        path: 'financial',
        name: 'CodeFinancial',
        component: () => import('../views/codeMerchant/financial/index.vue'),
      },
      {
        path: 'payAccount',
        name: 'CodePayAccount',
        component: () => import('../views/codeMerchant/payAccount/index.vue'),
      },
      {
        path: 'payBehalf',
        name: 'CodePayBehalf',
        component: () => import('../views/codeMerchant/payBehalf/index.vue'),
      },
      {
        path: 'topUp',
        name: 'CodeTopUp',
        component: () => import('../views/codeMerchant/topUp/index.vue'),
      },
      {
        path: 'withdrawalOrder',
        name: 'CodeWithdrawalOrder',
        component: () => import('../views/codeMerchant/withdrawalOrder/index.vue'),
      },
    ]
  },
  {
    path: '/merchant',
    component: MainLayout,
    children: [
      {
        path: 'all',
        name: 'MerchantAll',
        component: () => import('../views/merchant/all/index.vue'),
      },
      {
        path: 'finance',
        name: 'MerchantFinance',
        component: () => import('../views/merchant/finance/index.vue'),
      },
      {
        path: 'payOrder',
        name: 'MerchantPayOrder',
        component: () => import('../views/merchant/payOrder/index.vue'),
      },
      {
        path: 'collectAccount',
        name: 'MerchantCollectAccount',
        component: () => import('../views/merchant/collectAccount/index.vue'),
      },
      {
        path: 'withdrawOrder',
        name: 'MerchantWithdrawOrder',
        component: () => import('../views/merchant/withdrawOrder/index.vue'),
      },
      {
        path: 'withdrawBank',
        name: 'MerchantWithdrawBank',
        component: () => import('../views/merchant/withdrawBank/index.vue'),
      },
      {
        path: 'agentRecharge',
        name: 'MerchantAgentRecharge',
        component: () => import('../views/merchant/agentRecharge/index.vue'),
      },
      {
        path: 'agentOrder',
        name: 'MerchantAgentOrder',
        component: () => import('../views/merchant/agentOrder/index.vue'),
      },
      {
        path: 'agentBank',
        name: 'MerchantAgentBank',
        component: () => import('../views/merchant/agentBank/index.vue'),
      },
    ],
  },
  {
    path: '/channel',
    component: MainLayout,
    children: [
      {
        path: 'paymentChannel',
        name: 'ChannelPaymentChannel',
        component: () => import('../views/channel/paymentChannel/index.vue'),
      },
      {
        path: 'paymentType',
        name: 'ChannelPaymentType',
        component: () => import('../views/channel/paymentType/index.vue'),
      },
      {
        path: 'paymentPlatform',
        name: 'ChannelPaymentPlatform',
        component: () => import('../views/channel/paymentPlatform/index.vue'),
      },
      {
        path: 'behalfPlatform',
        name: 'ChannelBehalfPlatform',
        component: () => import('../views/channel/behalfPlatform/index.vue'),
      },
    ]
  },
  {
    path: '/reports',
    component: MainLayout,
    children: [
      {
        path: 'payment',
        name: 'ReportssPayment',
        component: () => import('../views/reports/payment/index.vue'),
      },
      {
        path: 'branch',
        name: 'ReportssBranch',
        component: () => import('../views/reports/branch/index.vue'),
      },
      {
        path: 'topUpBehalf',
        name: 'ReportssTopUpBehalf',
        component: () => import('../views/reports/topUpBehalf/index.vue'),
      },
      {
        path: 'payBehalf',
        name: 'ReportssPayBehalf',
        component: () => import('../views/reports/payBehalf/index.vue'),
      },
      {
        path: 'pendLine',
        name: 'ReportssPendLine',
        component: () => import('../views/reports/pendLine/index.vue'),
      },
      {
        path: 'withdraw',
        name: 'ReportssWithdraw',
        component: () => import('../views/reports/withdraw/index.vue'),
      },
      {
        path: 'shangEra',
        name: 'ReportssShangEra',
        component: () => import('../views/reports/shangEra/index.vue'),
      },
      {
        path: 'platform',
        name: 'ReportssPlatform',
        component: () => import('../views/reports/platform/index.vue'),
      },
      {
        path: 'runScore',
        name: 'ReportssRunScore',
        component: () => import('../views/reports/runScore/index.vue'),
      },
    ]
  },
  {
    path: '/system',
    component: MainLayout,
    children: [
      {
        path: 'setting',
        name: 'SystemSetting',
        component: () => import('../views/system/setting/index.vue'),
      },
      {
        path: 'employee',
        name: 'SystemEmployee',
        component: () => import('../views/system/employee/index.vue'),
      },
      {
        path: 'department',
        name: 'SystemDepartment',
        component: () => import('../views/system/department/index.vue'),
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫 - 判断 token 是否存在
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // 如果访问登录页
  if (to.path === '/login') {
    // 已登录则跳转到 desktop
    if (token) {
      next('/desktop')
    } else {
      next()
    }
  } else {
    // 访问其他页面，需要验证 token
    if (token) {
      next()
    } else {
      // 未登录则跳转到登录页
      next('/login')
    }
  }
})

export default router
