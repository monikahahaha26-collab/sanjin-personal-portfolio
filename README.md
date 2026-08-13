# 叁金个人作品集

这是叁金的个人作品集网站，记录可运行的 Web 应用、Java 后端、AI 应用、数据分析与交互实验。站点使用 Next.js App Router 构建，项目详情以 MDX 维护，截图和静态资源统一放在 `public/` 中。

## 内容概览

- 企业礼赠采购平台：Spring Boot、MyBatis、Redis、Spring AI、pgvector 与 Vue 运营后台。
- 叁金销售数据分析 Agent：Spring Boot、LangChain4j、SSE、Vue、Pinia 与 ECharts。
- 微博舆情分析、微信小程序、PWA、网页游戏和 Java Web 课程项目。

## 本地运行

```bash
npm ci
npm run dev
```

打开 <http://localhost:3000> 查看站点。生产构建使用：

```bash
npm run build
```

## 发布

推送到 `main` 后，GitHub Actions 会自动构建并部署到 GitHub Pages。仓库只包含个人作品集站点与展示素材，不包含 AegisGift 或叁金销售 Agent 的源码。

## 在线编辑与自动同步

作品集提供两个用途明确的入口：

- 纯展示站：<https://cuber-sanjin.github.io/sanjin-personal-portfolio/>
- 作者工作台：<https://cuber-sanjin.github.io/sanjin-personal-portfolio/editor/>
- GitHub 在线编辑器：<https://github.dev/cuber-sanjin/sanjin-personal-portfolio>

在线修改流程：

1. 登录 GitHub 后，从作者工作台进入 GitHub.dev。
2. 博客放在 `content/blogs/`，可复制 `docs/templates/blog-post.mdx`；项目说明放在 `content/projects/`，图片放在 `public/projects/`。
3. 在 GitHub.dev 左侧“源代码管理”中填写提交说明并提交到 `main`。
4. GitHub Actions 会自动构建和发布，通常 1–3 分钟后同步到纯展示站；可以在工作台中查看部署状态。

静态展示站本身不保存 GitHub Token，也不直接写仓库。编辑权限完全由 GitHub 登录和仓库权限控制，避免在公开网页中暴露密钥。
