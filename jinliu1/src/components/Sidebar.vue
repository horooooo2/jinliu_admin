<template>
  <div class="sidebar-container" :class="{ 'is-collapse': isCollapse }">
    <!-- Logo -->
    <div class="sidebar-logo">
      <img
        v-if="!isCollapse"
        src="https://via.placeholder.com/120x30/409EFF/ffffff?text=ADMIN"
        alt="Logo"
        class="logo-lg"
      />
      <img
        v-else
        src="https://via.placeholder.com/30x30/409EFF/ffffff?text=A"
        alt="Logo"
        class="logo-sm"
      />
    </div>

    <!-- Menu -->
    <el-scrollbar class="sidebar-scrollbar">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        class="sidebar-menu"
        router
      >
        <!-- Menu Title -->
        <!-- <div v-if="!isCollapse" class="menu-title">菜单</div> -->

        <!-- 首页 -->
        <el-menu-item index="/desktop">
          <el-icon><House /></el-icon>
          <span>桌面</span>
        </el-menu-item>

        <el-sub-menu index="1">
          <template #title>
            <el-icon><HomeFilled /></el-icon>
            <span>码商</span>
          </template>
          <el-menu-item index="/codeMerchant/all">
            <span>所有码商</span>
          </el-menu-item>
          <el-menu-item index="/codeMerchant/financial">
            <span>财务记录</span>
          </el-menu-item>
          <el-menu-item index="/codeMerchant/payAccount">
            <span>收款账号</span>
          </el-menu-item>
          <el-menu-item index="/codeMerchant/payBehalf">
            <span>码商代付</span>
          </el-menu-item>
          <el-menu-item index="/codeMerchant/withdrawalOrder">
            <span>提现订单</span>
          </el-menu-item>
          <el-menu-item index="/codeMerchant/topUp">
            <span>码商充值</span>
          </el-menu-item>
          <el-menu-item index="/codeMerchant/beneficiaryBank">
            <span>收款银行</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="2">
          <template #title>
            <el-icon><HomeFilled /></el-icon>
            <span>商户</span>
          </template>
          <el-menu-item index="/merchant/all">
            <span>所有商户</span>
          </el-menu-item>
          <el-menu-item index="/merchant/finance">
            <span>财务记录</span>
          </el-menu-item>
          <el-menu-item index="/merchant/payOrder">
            <span>支付订单</span>
          </el-menu-item>
          <el-menu-item index="/merchant/agentBank">
            <span>支付银行</span>
          </el-menu-item>
          <el-menu-item index="/merchant/withdrawOrder">
            <span>提现订单</span>
          </el-menu-item>
          <el-menu-item index="/merchant/withdrawBank">
            <span>提现银行</span>
          </el-menu-item>
          <el-menu-item index="/merchant/agentRecharge">
            <span>代付充值</span>
          </el-menu-item>
          <el-menu-item index="/merchant/agentOrder">
            <span>代付订单</span>
          </el-menu-item>
          <el-menu-item index="/merchant/collectAccount">
            <span>代付银行</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="3">
          <template #title>
            <el-icon><HomeFilled /></el-icon>
            <span>通道</span>
          </template>
          <el-menu-item index="/channel/paymentChannel">
            <span>支付通道</span>
          </el-menu-item>
          <el-menu-item index="/channel/paymentType">
            <span>支付类型</span>
          </el-menu-item>
          <el-menu-item index="/channel/paymentPlatform">
            <span>支付平台</span>
          </el-menu-item>
          <el-menu-item index="/channel/behalfPlatform">
            <span>代付平台</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="4">
          <template #title>
            <el-icon><HomeFilled /></el-icon>
            <span>报表</span>
          </template>
          <el-menu-item index="/reports/payment">
            <span>支付报表</span>
          </el-menu-item>
          <el-menu-item index="/reports/branch">
            <span>支线报表</span>
          </el-menu-item>
          <el-menu-item index="/reports/topUpBehalf">
            <span>代充报表</span>
          </el-menu-item>
          <el-menu-item index="/reports/payBehalf">
            <span>代付报表</span>
          </el-menu-item>
          <el-menu-item index="/reports/pendLine">
            <span>待线报表</span>
          </el-menu-item>
          <el-menu-item index="/reports/withdraw">
            <span>提现报表</span>
          </el-menu-item>
          <el-menu-item index="/reports/shangEra">
            <span>商代报表</span>
          </el-menu-item>
          <el-menu-item index="/reports/platform">
            <span>平台报表</span>
          </el-menu-item>
          <el-menu-item index="/reports/runScore">
            <span>跑分报表</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="5">
          <template #title>
            <el-icon><HomeFilled /></el-icon>
            <span>系统</span>
          </template>
          <el-menu-item index="/system/setting">
            <span>系统设置</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="6">
          <template #title>
            <el-icon><HomeFilled /></el-icon>
            <span>权限</span>
          </template>
          <el-menu-item index="/system/employee">
            <span>员工管理</span>
          </el-menu-item>
          <el-menu-item index="/system/department">
            <span>部门管理</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- Pages -->
        <!-- <div v-if="!isCollapse" class="menu-title">页面</div> -->

        <!-- <el-sub-menu index="2">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item index="/users/list">
            <span>用户列表</span>
          </el-menu-item>
          <el-menu-item index="/users/roles">
            <span>角色管理</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="3">
          <template #title>
            <el-icon><Warning /></el-icon>
            <span>错误页面</span>
          </template>
          <el-menu-item index="/error/404">
            <span>404 页面</span>
          </el-menu-item>
          <el-menu-item index="/error/500">
            <span>500 页面</span>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/calendar">
          <el-icon><Calendar /></el-icon>
          <span>日历</span>
        </el-menu-item> -->

        <!-- General -->
        <!-- <div v-if="!isCollapse" class="menu-title">通用</div>

        <el-sub-menu index="4">
          <template #title>
            <el-icon><Grid /></el-icon>
            <span>组件</span>
          </template>
          <el-menu-item index="/components/button">
            <span>按钮</span>
          </el-menu-item>
          <el-menu-item index="/components/form">
            <span>表单</span>
          </el-menu-item>
          <el-menu-item index="/components/table">
            <span>表格</span>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/widgets">
          <el-icon><Present /></el-icon>
          <span>小部件</span>
        </el-menu-item>

        <el-sub-menu index="5">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>表单</span>
          </template>
          <el-menu-item index="/forms/basic">
            <span>基础表单</span>
          </el-menu-item>
          <el-menu-item index="/forms/advanced">
            <span>高级表单</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="6">
          <template #title>
            <el-icon><Memo /></el-icon>
            <span>表格</span>
          </template>
          <el-menu-item index="/tables/basic">
            <span>基础表格</span>
          </el-menu-item>
          <el-menu-item index="/tables/advanced">
            <span>高级表格</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="7">
          <template #title>
            <el-icon><PieChart /></el-icon>
            <span>图表</span>
          </template>
          <el-menu-item index="/charts/line">
            <span>折线图</span>
          </el-menu-item>
          <el-menu-item index="/charts/bar">
            <span>柱状图</span>
          </el-menu-item>
          <el-menu-item index="/charts/pie">
            <span>饼图</span>
          </el-menu-item>
        </el-sub-menu> -->
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  House,
  HomeFilled,
  UserFilled,
  Warning,
  Calendar,
  Grid,
  Present,
  Document,
  Memo,
  PieChart,
} from '@element-plus/icons-vue'

interface Props {
  isCollapse: boolean
}

defineProps<Props>()

const route = useRoute()

const activeMenu = computed(() => {
  return route.path
})
</script>

<style scoped>
.sidebar-container {
  height: 100%;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  transition: width 0.3s;
  width: 240px;
  overflow: hidden;
}

.sidebar-container.is-collapse {
  width: 64px;
}

.sidebar-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e5e7eb;
}

.logo-lg {
  height: 30px;
}

.logo-sm {
  height: 30px;
  width: 30px;
}

.sidebar-scrollbar {
  height: calc(100% - 60px);
}

.sidebar-menu {
  border-right: none;
}

.menu-title {
  padding: 12px 20px 8px;
  font-size: 12px;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 48px;
  line-height: 48px;
}

:deep(.el-menu-item.is-active) {
  background-color: #ecf5ff;
  color: #409eff;
}

:deep(.el-sub-menu .el-menu-item) {
  padding-left: 60px !important;
  min-width: auto;
}
</style>
