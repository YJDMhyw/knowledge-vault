# 知识掌中宝 (Knowledge Vault)

📚 一个专注于概念与定义学习的记录应用，支持多级分类管理和智能考核推送。

## 功能特点

### 📁 三级分类管理
- 顶级目录 → 次级目录 → 概念卡片
- 支持创建、编辑、删除操作
- 数据本地持久化存储

### 🎓 智能考核推送
- 推送顺序：①②①③②④③⑤④⑤...
- 每个概念推送两次，增强记忆
- 点击"阅"按钮标记已掌握，后续不再推送
- 两次都有内容输入自动标记已掌握

### 📱 PWA 支持
- 可安装到手机桌面
- 离线可用
- 响应式设计，完美适配移动端

## 技术栈

- React 18 + TypeScript
- Vite
- Zustand (状态管理)
- React Router (路由)
- CSS Modules

## 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

## 项目结构

```
src/
├── components/     # UI组件
│   ├── Layout/    # 布局组件
│   ├── Quiz/      # 考核相关组件
│   └── ...
├── pages/         # 页面组件
│   ├── Home.tsx          # 首页
│   ├── Categories.tsx    # 目录页面
│   ├── Quiz.tsx          # 考核页面
│   └── Manage.tsx        # 管理页面
├── context/       # React Context
│   ├── AppContext.tsx    # 应用状态
│   └── QuizContext.tsx   # 考核状态
├── types/         # TypeScript类型定义
└── utils/         # 工具函数

dist/              # 构建输出目录（部署用）
```

## 部署

本项目已配置 GitHub Pages 部署。

### 手动部署

1. Fork 本仓库
2. 在仓库 Settings → Pages 中选择 `gh-pages` 分支
3. 访问 `https://[你的用户名].github.io/[仓库名]/`

### 自动部署

使用 GitHub Actions，每次 push 到 main 分支会自动部署。

## License

MIT
