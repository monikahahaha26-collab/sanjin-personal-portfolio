# Personal Portfolio — 内容维护指南

## 📁 项目结构概览

```
Personal_portfolio/
├── app/                    # Next.js 页面（路由）
│   ├── page.tsx            # 首页
│   ├── projects/           # 项目列表 + 详情（动态路由 [slug]）
│   ├── about/              # 关于我 & 简历
│   └── contact/            # 联系方式
├── components/             # React 组件
│   ├── layout/             # Header, Footer
│   ├── hero/               # 首页 Hero 区（Agent 屏幕动画 + 插画）
│   ├── project/            # 项目卡片组件
│   └── ui/                 # 通用 UI（Button, Tag, SectionHeading）
├── content/projects/       # ⭐ 项目 MDX 文件（在这里添加项目）
├── data/
│   └── about.ts            # ⭐ 个人信息、技能、经历（修改这里更新关于页）
├── lib/content.ts          # MDX 读取工具（一般不需要改）
├── styles/
│   ├── tokens.css          # ⭐ 设计 Token（换色/换间距改这里）
│   └── global.css          # 全局响应式样式
├── public/                 # 静态资源
│   ├── .nojekyll
│   ├── sitemap.xml
│   ├── robots.txt
│   ├── resume.pdf          # ⭐ 放你的简历 PDF
│   └── hero-illustration.* # ⭐ 首页插画图片（替换占位图）
└── next.config.ts         # 构建配置（basePath 等）
```

---

## ✏️ 如何添加真实内容

### 1. 修改个人信息 → 编辑 `data/about.ts`

```typescript
export const personalInfo = {
  name: "你的真名",           // ← 改这里
  title: "全栈开发工程师",      // ← 求职定位
  tagline: "一句话介绍自己",    // ← 首页副标题
  email: "you@email.com",     // ← 你的邮箱
  github: "https://github.com/yourusername",  // ← 你的 GitHub
  linkedin: "https://linkedin.com/in/your",    // ← 可选
  resumePdf: "/resume.pdf",   // ← 确保文件在 public/ 目录下
};
```

其他可编辑区域：
- `jobPreference` — 目标岗位、期望城市、到岗时间
- `skillCategories` — 技能列表和熟练度（1-5 星）
- `experiences` — 工作经历时间线
- `education` — 教育背景

### 2. 添加项目 → 在 `content/projects/` 创建 `.mdx` 文件

文件名即 URL slug：`content/projects/my-project.mdx` → `/projects/my-project`

#### Front-matter 模板

```yaml
---
title: "项目名称"
summary: "一句话描述（≤80字，会显示在卡片和 SEO 中）"
cover: "./covers/photo.jpg"    # 相对于此 mdx 文件的路径，或留空用占位
date: "2025-01"                # 用于排序（年-月）
tags: ["React", "TypeScript"] # 技术栈标签（显示在卡片上）
role: "前端负责人 / 独立开发"   # 你的角色
period: "2024.03 – 2025.01"     # 时间段
features:                      # 已实现的功能（不要编数字！）
  - "功能描述 1"
  - "功能描述 2"
challenges:                     # 技术难点与解决方法
  - "难点描述 + 解决方案"
links:
  demo: "https://demo.url"     # 在线演示地址（没有就删掉这行或写 null）
  repo: "https://github.com/..." # GitHub 仓库（同上）
---
```

#### 正文内容

支持 **Markdown + JSX**（MDX 格式）：
- 标题、段落、列表、代码块正常写
- 可以内嵌 `<Component />`（如果后续添加了自定义组件）
- 代码块会自动高亮（shiki）

**写作原则**：
- ✅ 写"做了什么 + 怎么做的 + 我负责哪部分"
- ❌ 不要编造量化指标（如"提升 50%"），除非有真实数据
- ✅ 技术难点要具体（什么问题、怎么解决的、为什么这样选）

### 3. 替换首页插画

当前是 SVG 几何占位图。替换方式：

**方式 A：AI 生成图片**
1. 用 GPT Image / Midjourney 等生成一张图片
2. 命名为 `hero-illustration.webp`（推荐 WebP 格式）
3. 放到 `public/hero-illustration.webp`
4. 编辑 `components/hero/HeroIllustration.tsx`，把 `<div>` 内容替换为 `<img src="/hero-illustration.webp" alt="..." />`

**方式 B：手绘 SVG**
直接在 `HeroIllustration.tsx` 中返回 SVG 元素

### 4. 上传简历 PDF

把简历 PDF 命名为 `resume.pdf`，放到 `public/` 目录下。关于页的"下载简历"按钮会自动链接到它。

---

## 🚀 本地预览与构建

```bash
# 安装依赖（首次）
npm install

# 开发模式（热重载，默认 http://localhost:3000）
npm run dev

# 构建静态站点（输出到 out/ 目录）
npm run build

# 本地预览构建结果（模拟 GitHub Pages 环境）
npx serve out
```

> ⚠️ `npm run dev` 时某些功能（如 MDX 读取）可能表现不同，以 `npm run build` 的结果为准。

---

## 📤 部署到 GitHub Pages

1. 把代码推送到 GitHub 仓库
2. 确保 `.github/workflows/deploy.yml` 存在
3. 推送到 `main` 分支 → 自动触发构建部署
4. 访问 `https://你的用户名.github.io/Personal_portfolio/`

首次部署需要在仓库 Settings → Pages → Source 选择 `GitHub Actions`

---

## 🎨 修改视觉风格

### 快速换色/换间距 → 编辑 `styles/tokens.css`

所有颜色、字号、间距、圆角、阴影、动效参数都集中在这个文件。改完重新 `npm run build` 即可全局生效。

### 更大的设计变更

如果需要改变布局结构、字体层级体系、卡片形态等，需要修改对应组件文件中的 inline style 或 className。

---

## ❓ 常见问题

**Q: 为什么本地 dev 模式下有些内容不显示？**
A: MDX 文件读取使用 Node.js `fs` 模块，在 dev 模式下可能存在缓存问题。以 `npm run build` 后的结果为准。

**Q: 如何添加更多页面？**
A: 在 `app/` 下新建目录和 `page.tsx`，同时在 Header 组件的 `NAV_ITEMS` 数组中添加导航项。

**Q: 图片放哪里？**
A: 静态资源放 `public/` 目录；项目封面图建议放在 `content/projects/covers/` 目录下，在 MDX front-matter 中用相对路径引用。
