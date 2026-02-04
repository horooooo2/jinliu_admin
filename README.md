# 后台管理系统

基于 Vite + Vue3 + Element Plus + TypeScript 开发的后台管理系统。

## 技术栈

- **框架**: Vue 3.4.21
- **构建工具**: Vite 5.1.6
- **UI 组件库**: Element Plus 2.6.0
- **路由**: Vue Router 4.3.0
- **状态管理**: Pinia 2.1.7
- **语言**: TypeScript 5.2.2

## 项目结构

```
jinliu_admin/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 公共组件
│   │   ├── Header.vue   # 顶部导航栏
│   │   ├── Sidebar.vue  # 侧边栏菜单
│   │   └── MainLayout.vue # 主布局容器
│   ├── router/          # 路由配置
│   │   └── index.ts
│   ├── styles/          # 全局样式
│   │   └── index.css
│   ├── views/           # 页面组件
│   │   ├── Dashboard.vue    # 仪表盘
│   │   └── Ecommerce.vue    # 电商数据
│   ├── App.vue          # 根组件
│   ├── main.ts          # 入口文件
│   └── vite-env.d.ts    # 类型声明
├── index.html           # HTML 模板
├── vite.config.ts       # Vite 配置
├── tsconfig.json        # TypeScript 配置
└── package.json         # 项目依赖

## 功能特性

### 基础布局
- ✅ 响应式顶部导航栏
  - 菜单折叠按钮
  - 搜索框
  - 全屏切换
  - 通知中心
  - 用户下拉菜单

- ✅ 可折叠侧边栏
  - Logo 展示
  - 多级菜单导航
  - 菜单折叠动画
  - 当前路由高亮

- ✅ 内容区域
  - 页面路由切换
  - 响应式布局
  - 底部版权信息

### 页面
- **Dashboard**: 数据统计看板，包含统计卡片、图表、数据表格
- **电商数据**: 销售数据展示、订单管理

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

项目将运行在 http://localhost:3000/

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 布局说明

### 顶部导航栏 (Header)
- 左侧：菜单折叠按钮、搜索框
- 右侧：全屏按钮、通知（带未读数量徽章）、用户菜单

### 侧边栏 (Sidebar)
- Logo 区域（可根据折叠状态切换大小）
- 菜单分组：
  - 菜单 (Menu)
  - 页面 (Pages)
  - 通用 (General)
- 支持多级子菜单
- 当前页面高亮显示

### 主内容区
- 顶部：页面标题
- 中间：页面内容（可滚动）
- 底部：版权信息

## 自定义配置

### 修改主题颜色
在 `src/main.ts` 中可以配置 Element Plus 的主题：

```typescript
import ElementPlus from 'element-plus'

app.use(ElementPlus, {
  // 配置项
})
```

### 添加新路由
在 `src/router/index.ts` 中添加路由配置：

```typescript
{
  path: '/your-path',
  name: 'YourPage',
  component: () => import('../views/YourPage.vue'),
}
```

### 添加新菜单
在 `src/components/Sidebar.vue` 中添加菜单项：

```vue
<el-menu-item index="/your-path">
  <el-icon><YourIcon /></el-icon>
  <span>菜单名称</span>
</el-menu-item>
```

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## License

MIT

---

