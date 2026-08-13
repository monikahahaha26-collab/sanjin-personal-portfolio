# 个人作品集网站 · 开发全记录

> 一份从 0 到 1 的完整开发文档：记录「这个网站为什么这么做」「做了哪些事」「每一步是怎么完成的」。
> 更新时间：2026-08-05 ｜ 预览地址：http://localhost:3002

---

## 目录

1. [项目总览](#一项目总览)
2. [做这个网站的思路](#二做这个网站的思路)
3. [技术栈与关键决策](#三技术栈与关键决策)
4. [从 0 到 1 的全步骤](#四从-0-到-1-的全步骤)
5. [当前功能清单](#五当前功能清单)
6. [关键问题与解决方案](#六关键问题与解决方案)
7. [文件结构地图](#七文件结构地图)
8. [验证与测试方法](#八验证与测试方法)
9. [使用入口一览](#九使用入口一览)
10. [遗留事项与后续规划](#十遗留事项与后续规划)

---

## 一、项目总览

**一句话定位**：一个面向招聘方 HR 的个人作品集网站（毕业设计项目载体），把「博客随笔 / 作品项目 / 兴趣爱好」整合为三大模块，并以魔方为核心视觉符号贯穿始终。

**当前状态**：Next.js 15 全静态导出，28 个页面，包含 7 个真实项目（11 张真实截图）、cstimer 风格魔方计时器（2-7 阶 WCA）、全模块数据持久化与分享能力。

| 维度 | 说明 |
|---|---|
| 项目名 | personal-portfolio（毕业设计作品集） |
| 框架 | Next.js 15.5.22 + React 19 + TypeScript |
| 样式 | Tailwind CSS v4 + 自定义设计 Token（`styles/tokens.css`） |
| 渲染模式 | `output: 'export'` 全静态导出，可部署 GitHub Pages |
| 数据存储 | MDX（项目/文章）+ `data/about.ts`（个人信息）+ localStorage（用户自建内容） |
| 核心亮点 | 像素风首页、3D 魔方→计时器演化、7 个真实项目多图轮播、分享链接 |

---

## 二、做这个网站的思路

### 2.1 定位：不是模板站，是「能力证明」

网站的目标受众是**招聘方 HR**，所以一切设计围绕一个原则：**让 HR 在 3 分钟内相信作者具备真实工程能力**。为此确立了三条主线：

1. **真实优先**：所有项目截图来自真实运行/渲染的项目，绝不编造；GitHub 私有仓库（微博毕设）用真实模板渲染 + 大量界面截图补足。
2. **主次分明**：毕业设计「微博情感分析系统」作为核心项目置顶，AI 伴侣等项目明确标注 Demo 降级，其余按技术难度排序。
3. **隐藏实现细节**：向访客隐藏"MDX/本地数据管理"等内部机制，展示的是干净的作品，而不是管理后台。

### 2.2 视觉语言：魔方六色 + 暖白赤陶

- **核心符号是魔方**：作者本人玩魔方，魔方既是爱好模块（计时器），也是视觉母题（首页像素字 SANJIN 用魔方六色逐字上色、四周彩绘魔方装饰、Header 等距魔方 logo）。
- **配色**：暖白底（`#FFFFFF` / `#FAFAF9`）+ 赤陶橙强调色 `#C2410C`（刻意避开千篇一律的蓝色，呼应魔方橙面，同时满足 WCAG AA 对比度 5.9:1），辅以魔方六色作为点缀。
- **风格演进**：最初是"Agent 终端动画 + 动漫人物插画"的创意稿 → 用户反馈后彻底重构为**像素风（retro pixel）**，用纯 CSS 5×7 点阵拼出 SANJIN，形成独一无二的记忆点。

### 2.3 架构思路：纯静态，但功能不缩水

作品集要能免费部署在 GitHub Pages（无服务器），因此**所有动态能力都必须在客户端完成**：

```
MDX / TS 数据文件 ──► 构建期静态生成（项目详情、博客列表）
localStorage ──────► 运行期用户自建数据（新增项目、写随笔、读书/影视记录）
URL 参数 ?share= ──► 分享能力（数据编码进链接，他人只读查看）
JSON 文件下载 ─────► 导出/导入备份（含图片，可跨设备恢复）
```

这个组合让网站同时拥有「内容可控（Git 管理）+ 自由创作（页面内 CRUD）+ 可传播（分享链接）」三种能力，且零后端成本。

### 2.4 迭代思路：模块化、可验证、先修 Bug 再上功能

每一轮改动都遵循：**全面检查现状 → 报告 → 修改 → 构建 → 端到端验证（Playwright）**。Bug 优先于新功能，验证优先于交付——保证任何一次改动都不会破坏已有页面。

---

## 三、技术栈与关键决策

### 3.1 依赖清单

```jsonc
// package.json（核心）
{
  "next": "15.5.22",            // 全静态导出 output: 'export'
  "react": "19.1.0",
  "gray-matter": "^4.0.3",      // MDX frontmatter 解析
  "next-mdx-remote": "^6.0.0",  // 远程 MDX 渲染
  "remark-gfm": "^4.0.1",       // Markdown 表格/任务列表
  "rehype-pretty-code": "^0.14.5", "shiki": "^4.4.1",  // 代码高亮
  "tailwindcss": "^4",          // 原子样式（PostCSS 模式）
  "motion": "^12.43.0"          // 动画库（预留，当前零引用）
}
```

### 3.2 关键决策记录

| 决策 | 原因 |
|---|---|
| `output: 'export'` 静态导出 | 免费部署 GitHub Pages，无服务器成本 |
| basePath 用环境变量注入 | 本地空字符串、CI 注入 `/Personal_portfolio`，本地预览不 404 |
| 全局 CSS 类名而非 styled-jsx | styled-jsx 在 SSG 混用时有兼容性问题，改用设计 Token + 全局类 |
| localStorage 做数据层 | 纯静态无后端；个人内容数据量小；刷新/重开不丢失；`lib/store.ts` 统一封装 CRUD |
| 图片存 base64 于 localStorage | 免上传服务；导出 JSON 时包含图片实现永久备份 |
| 分享用 URL 参数编码数据 | 他人打开 `?share=` 即见只读快照，不污染对方本地数据；分享时自动剔除 base64 防 URL 超长 |
| 截图用 Playwright 驱动系统 Chrome | 零额外下载，可交互点击后截图（如游戏进战斗） |
| 魔方从 3D 交互 → 计时器 | 用户需求迭代：cstimer 是魔方爱好者的真实工具，计时器比 3D 魔方更有实际价值 |

---

## 四、从 0 到 1 的全步骤

### 阶段一：脚手架与基础页面（08-03）

**目标**：跑通 Next.js 静态导出 + 建立设计系统 + 五页骨架。

1. **初始化工程**：Next.js 15 + TS + Tailwind v4，`next.config.ts` 设置 `output: 'export'` 与动态 basePath。
2. **设计 Token 系统**：`styles/tokens.css` 集中管理颜色/字号/间距/圆角/阴影/动效，全站样式统一引用。
3. **五页骨架**：首页（Hero + 精选项目）、项目列表、项目详情、关于页（技能树/经历时间线）、联系页。
4. **响应式导航**：顶部粘性导航 + 移动端汉堡菜单；SEO 基础（metadata 模板、OG 标签、sitemap、robots、skip-to-content）。
5. **踩坑**：styled-jsx 服务端/客户端混用报兼容问题 → 弃用，改全局 CSS 类。
6. **验证**：11 页面全部静态生成成功；修复端口占用导致 `EBUSY` 构建失败（旧 serve 进程锁 out 目录）。

### 阶段二：视觉重构（08-03 续）

**目标**：从"默认模板感"升级为有记忆点的设计。

1. **Hero 左屏 Agent IDE**：纯 CSS 动画模拟代码编辑器 + Agent 运行日志循环播放（零 JS 运行时）。
2. **Hero 右屏插画**：动漫风坐姿 + 等距 3D 魔方 + 蒸汽动画（SVG 手绘风格）。
3. **能力卡 + 精选项目 + 深色 CTA 条**：首页信息层级完整化。
4. **设计精修**：scroll-driven 动画 + `@supports` 降级、body 点阵背景、无障碍 focus ring。

### 阶段三：整合 7 个真实项目 + 三大模块重构（08-04）

**目标**：把本地真实项目接入作品集，并完成「博客 / 项目 / 魔方」三模块整合。

1. **真实项目接入**：将 7 个本地项目（微博毕设、痛风小程序、肉鸽游戏、粉丝档案站、桌面宠物、记账、AI 伴侣）写成 MDX，`lib/content.ts` 统一读取。
2. **真实截图方案**：Playwright + 系统 Chrome 对每个项目启动 HTTP server 截图；小程序用 WXML 转 HTML 模拟手机框架；AI 助手截图做脱敏（昵称/侧栏遮罩）。
3. **导航重构**：删除顶部 Header，改为**首页模块卡片跳转模式**；Footer 接管导航。
4. **新首页**：像素风 SANJIN（5×7 点阵、魔方六色逐字）+ 四周 6 个彩绘魔方装饰 + PageTransition 路由淡入。
5. **博客模块**：MDX 列表 + 详情 + 轻量 Markdown 渲染器（`lib/markdown.tsx`）。
6. **魔方模块**：27 cubie × 6 面纯 CSS 3D 变换，拖拽旋转 + 自动旋转 + 三套配色。
   - **关键坑**：U 面 `translateZ` 必须为**负值**（`rotateX(90deg)` 翻转局部 Z 轴方向）。
7. **项目详情左栏**：`ProjectRail` 其他项目迷你缩略图列表。
8. **验证**：24 页面全部生成，视觉验证通过。

### 阶段四：可打乱魔方 + 全模块 CRUD 持久化（08-04 续）

**目标**：修复魔方 Bug + 让所有内容模块支持页面内增删改且刷新不丢。

1. **修复魔方打乱 Bug**：原实现取 `stickers[face][0]` 导致每面 9 格同色、打乱无视觉变化 → 重写为 **54 sticker 真实模型** + 层转动算法（U/D/F/B/L/R × cw/ccw）+ 坐标索引映射，打乱后 3D 视图实时同步。
2. **修复魔方渲染不完整**：统一各面 `translateZ` 符号（U 面负、其余正）。
3. **数据持久化层**：新建 `lib/store.ts`，localStorage 封装项目/博客/读书/影视四类 CRUD（类型化 + uid）。
4. **兴趣爱好聚合**：`/hobbies` 入口 + `/hobbies/cube`（魔方迁入，旧 `/cube` 自动跳转）+ `/hobbies/books` + `/hobbies/movies`。
5. **项目客户端管理**：`ProjectsBoard` 合并 MDX + 本地项目，新增/编辑/删除 + 封面上传（base64）+ 正文 Markdown + 详情 Modal。
6. **博客客户端管理**：`BlogBoard` 合并 MDX + 本地按时间倒序，撰写/编辑/删除 + 图文混排（图片上传插入光标位置）。
7. **通用组件**：`Modal`（Esc 关闭、移动端全屏）、`StarRating`（1-5 星，按钮需显式宽高防高度塌陷）。
8. **UI 修复**：移动端详情页 cover 撑爆（`.rail-list` 横向 1800px 撑开 grid → `minmax(0, 1fr)`）；首页项目单列（补 `grid-template-columns: repeat(2, ...)`）；demo 链接 BASE 拼接修复。
9. **删除 3 个占位项目 MDX**（假封面 + 假链接）。
10. **验证**：打乱后六色真正交错同步；四模块 CRUD 刷新后数据保留 ✓。

### 阶段五：魔方改计时器 + 侧边栏 Tooltip（08-05）

**目标**：魔方模块从"3D 玩具"进化为"真实工具"（cstimer 风格）。

1. **修改前全面检查**：构建验证 + 38 个 TS/TSX 全量 import 引用扫描 + 依赖完整性 + MDX 封面校验 + ESLint → 报告（顺带发现 `components/hero/` 死代码）。
2. **CubeTimer 计时器**：WCA 标准打乱算法（25 步、避免同面/同轴对立面连续）+ `performance.now` + rAF 毫秒计时 + 防误触（按住 0.3s）+ **空格键与点击双触发** + 统计（最快/最慢/Avg5/Avg12/标准差）+ 历史持久化（`{t, s}` 含打乱序列）+ 删除/清空。
3. **删除 CubePlayground**（3D 交互魔方被计时器替代）。
4. **侧边栏修复**：移除项目标题文字行（曾溢出被遮挡），改为**仅图标 + hover Tooltip**（`data-tooltip` + CSS 气泡），移动端隐藏 tooltip 避免遮挡横向滚动条。
5. **死代码清理**：删除 `components/hero/` 3 个废弃组件。
6. **验证**：打乱格式正则通过；计时/历史/统计正确；tooltip 显示"AI 智能伴侣 | AI Smart Companion" ✓。

### 阶段六：观察阶段 + 分享 + 图片上传 + 底部留白（08-05 续）

**目标**：补齐 cstimer 的观察时间，并让上传界面具备图片与分享能力。

1. **WCA 观察阶段（inspection）**：空闲按空格/点按 → 15s 倒计时（橙色态）；按住≥250ms 松开 → 开始计时；再按 → 停止；**超过 15s 自动标记 +2 罚时**（红底警示），历史记录同步标注观察时长。
2. **封面图片上传**：读书/影视表单 FileReader → base64 实时预览（>2MB 提示压缩），卡片展示封面图。
3. **分享链接**：`lib/share.ts` 数据编解码 + `buildShareUrl` 拼 `window.location.origin`（**必须完整 URL**，相对路径他人无法访问）；分享时剔除 base64 防 URL 超长；他人打开见只读快照横幅。
4. **导出/导入备份**：下载 JSON（含图片）可永久保存到本地/网盘，导入自动合并。
5. **底部留白修复**：Footer 上边距 96px → 48px，books/movies 页面 padding 收紧。
6. **验证**：观察→计时→停止全流程 ✓；分享链接完整 URL ✓；导出 books-backup.json ✓；底部间距 48px ✓。

### 阶段七：HR 视角系统化改造（08-05 晚）

**目标**：面向招聘方，用真实项目路径与真实截图，系统性打磨专业性。

1. **真实项目路径核对**（用户提供）：
   - 微博毕设 `D:\project\pycharmproject\weibo-system-all`（GitHub private）
   - AI 助手 `D:\project\python\ai智能助手`
   - 其余 `D:\AIwork\workbuddy\...` 与 `D:\project\small_project\...`（GitHub public）
2. **项目排序**：微博情感分析系统置顶（priority=1）→ 痛风 → 余烬 → SEVENTEEN → 记账 → 桌面宠物 → **AI 伴侣降级为 Demo 排最后**（`demo: true` + `isDemo` 贯穿排序逻辑：非 demo 优先 → priority 升序 → date 倒序）。
3. **多图轮切**：`ProjectFrontmatter` 加 `screenshots[]` + `ImageCarousel` 轮播组件（箭头/缩略图/计数器）。
4. **真实截图（11 张，零编造）**：
   - 微博系统 3 张：**真实 Jinja2 模板渲染**（`view/analysis/templates/*.html` 结构 + 真实数据 105 条评论、7 天情感趋势、ECharts 图表）
   - 痛风 2 张：真实 wxml 结构 + 真实 `purine-seed.json`（105 条嘌呤数据）
   - 余烬 2 张：dist 真实运行 + 点击「开始攀登」进战斗
   - SEVENTEEN 2 张：dist 真实 SPA + 导航「成员档案」
   - 记账 1 张、桌面宠物 1 张：真实 index.html
   - 此前编造的模拟截图**全部移出 public**
5. **隐藏管理机制**：删除 /projects 页"MDX/本地自行添加管理"表述；ProjectsBoard/BlogBoard 加 `?edit=1` 管理模式，默认对访客隐藏添加/编辑/删除按钮与统计说明。
6. **首页能力卡重写**：严格基于项目能力（前端工程 / AI 应用开发 / 数据可视化 / AI 辅助开发——明确标注"具备使用 AI 工具进行网页创作的能力"）。
7. **求职 CTA 应届生化**：「正在寻找下一段合作」→「应届求职中 · 期待加入你的团队」，目标岗位增加「AI 应用开发」（正在开展 RAG 项目）。
8. **博客衔接自然化**：副标题改「记录技术实践与日常思考，按时间倒序更新」，移除突兀的管理暗示。
9. **返回首页交互**：全局悬浮按钮 `FloatingHome`（非首页右下角常驻，hover 上浮 + 变色）。
10. **魔方 2-7 阶 WCA 计时**：2x2(20 步) / 3x3(25) / 4x4(40+宽转) / 5x5(60) / 6x6(80) / 7x7(100+3宽转)，历史与统计按阶数过滤。
11. **读书/影视界面修复**：Modal 改 flex 列布局 + 头部 sticky + 内容区弹性滚动 + 操作栏 sticky 底部，表单完整可见；「添加书目」文案确认无误。
12. **MDX frontmatter 修复**：bash 转义曾把 `\n` 写成字面量 `/n` 导致 YAML 损坏 → 写文件脚本逐行重建干净版本。
13. **验证**：28 页面构建通过；排序（微博首位/AI 最后）✓、轮播 4 张切换 ✓、悬浮按钮 ✓、2-7 阶 ✓、Modal 可见性 ✓、0 页面错误 ✓。

---

## 五、当前功能清单

### 5.1 首页 `/`
- 像素风 SANJIN（魔方六色）+ 彩绘魔方装饰
- 「我能做什么」4 项能力卡（基于真实项目）
- 精选项目两列预览
- 应届求职 CTA 条 + 简历下载
- 博客 / 项目 / 兴趣爱好 三模块跳转卡片

### 5.2 项目模块 `/projects` + `/projects/[slug]`
- 7 个真实项目，微博毕设置顶，AI 伴侣 Demo 降级
- 详情页多图轮播（微博 4 张 / 痛风 2 张 / 余烬 2 张 / SEVENTEEN 2 张 / 记账 1 / 宠物 1）
- 左栏：其他项目图标 + hover tooltip 快速跳转
- 管理模式（`?edit=1`）：页面内新增/编辑/删除（文字 + 图片上传 + 正文 Markdown）

### 5.3 博客模块 `/blog`
- MDX 示例文章 + 本地随笔按时间倒序合并
- 详情 Modal 图文混排渲染
- 管理模式（`?edit=1`）：撰写/编辑/删除 + 图片上传插入光标

### 5.4 兴趣爱好 `/hobbies`
- 聚合入口：魔方计时器 / 读书 / 影视
- **魔方计时器** `/hobbies/cube`：2-7 阶 WCA 打乱 + 观察阶段（15s +2 罚时）+ 空格/点击双操作 + Avg5/Avg12 统计 + 历史持久化
- **读书** `/hobbies/books`：书名/作者/状态/评分/短评/封面 + 分享链接 + 导出导入
- **影视** `/hobbies/movies`：名称/状态/评分/短评/封面 + 分享链接 + 导出导入

### 5.5 其他
- 关于页 `/about`、联系页 `/contact`、作者管理 `/admin/add-project`（下载 MDX 模板）
- 全局悬浮「回首页」按钮、页脚导航、SEO/OG

---

## 六、关键问题与解决方案

| # | 问题 | 根因 | 解决 |
|---|---|---|---|
| 1 | 魔方「打乱」无视觉变化 | 每面 9 格取同一颜色 | 重写 54 sticker 真实模型 + 层转动算法 + idx 映射 |
| 2 | 魔方 U 面渲染缺失/暗黑 | `translateZ` 符号与局部 Z 轴翻转不符 | U 面负值，其余正值 |
| 3 | 移动端详情 cover 撑爆（2372px） | `.rail-list` 横向 1800px 撑开 grid | `.project-layout` 改 `minmax(0, 1fr)` |
| 4 | 首页项目单列堆叠 | `.projects-grid` 缺列定义 | 补 `repeat(2, minmax(0,1fr))` |
| 5 | demo 链接 BASE 拼接错误 | 绝对 URL 也被拼 basePath | 仅相对路径拼 BASE |
| 6 | 侧边栏文字溢出被遮挡 | 项目标题文字行溢出 | 移除文字行，仅图标 + tooltip |
| 7 | StarRating 星星不可见 | `lineHeight: 0` 高度塌陷 | 按钮显式 width/height |
| 8 | 分享链接是相对路径 | 未拼 origin | `buildShareUrl` 拼 `window.location.origin` |
| 9 | 鼠标单击计时器"没反应" | 防误触 <250ms 直接回退 idle | 短按保持观察态（有反馈），按住 250ms 才启动 |
| 10 | 项目排序忽略 priority | 排序函数只看 date | 非 demo → priority → date 三级排序 |
| 11 | 长表单被浏览器遮挡 | modal 整体滚动、按钮在底部 | modal 改 flex 列 + 头 sticky + 体滚动 + 操作栏 sticky 底部 |
| 12 | MDX frontmatter YAML 损坏 | bash 转义把 `\n` 写成 `/n` | 文件脚本逐行重建 |
| 13 | 微博系统无法运行 | pandas/transformers 依赖链过长 + 需 MySQL | 真实 Jinja2 模板渲染 + 注入演示数据 |
| 14 | 编辑页面出现 `/n` 字面量 | python -c 注入时换行被转义 | 改用 Write/文件脚本（见 #12） |

---

## 七、文件结构地图

```
Personal_portfolio/
├── app/                          # 路由页面
│   ├── page.tsx                  # 首页（像素 SANJIN + 能力卡 + CTA）
│   ├── layout.tsx                # 根布局（PageTransition + FloatingHome + Footer）
│   ├── blog/                     # 博客列表 + [slug] 详情
│   ├── projects/                 # 项目列表 + [slug] 详情（左栏 + 轮播）
│   ├── hobbies/                  # 聚合 / cube / books / movies
│   ├── cube/page.tsx             # 旧魔方入口 → 自动跳转 /hobbies/cube
│   ├── about/ · contact/         # 关于 / 联系
│   └── admin/add-project/        # 作者辅助（下载 MDX 模板）
├── components/
│   ├── home/                     # PixelWord / PaintedCube / HomeHero / ModuleEntries
│   ├── layout/                   # Footer / PageTransition / FloatingHome
│   ├── cube/CubeTimer.tsx        # 2-7 阶 WCA 计时器（含观察阶段）
│   ├── project/                  # ProjectCard / ProjectRail / ProjectsBoard
│   ├── blog/BlogBoard.tsx        # 博客管理面板
│   └── ui/                       # Button/Tag/Modal/StarRating/SectionHeading/ImageCarousel/ShareExportBar
├── lib/
│   ├── content.ts                # MDX 读取 + priority/demo/screenshots 排序
│   ├── blog.ts · markdown.tsx    # 博客读取 + Markdown 渲染
│   ├── store.ts                  # localStorage 四类数据 CRUD
│   └── share.ts                  # 分享编解码 + 导出/导入
├── content/
│   ├── projects/*.mdx            # 7 个真实项目（frontmatter: title/summary/cover/priority/demo/screenshots/links...）
│   └── blogs/*.mdx               # 3 篇示例随笔
├── data/about.ts                 # 个人信息 / 技能 / 经历 / 求职意向
├── public/projects/              # 真实项目截图（11+ 张）
├── styles/
│   ├── tokens.css                # 设计 Token（颜色/字号/间距/圆角/阴影）
│   └── global.css                # 全局样式（1-21 节：hero/模块/魔方/计时器/轮播/分享条...）
├── .screens/                     # 截图脚本与验证产物（不部署）
└── next.config.ts                # output: export + 动态 basePath
```

---

## 八、验证与测试方法

项目采用「构建 + 端到端」双保险，全部自动化：

```bash
# 1. 构建验证（每次改动后必跑）
NODE_OPTIONS= npm run build        # 28 个静态页面，0 错误

# 2. ESLint（错误级阻断构建）
npx eslint app components lib data --ext .ts,.tsx

# 3. 端到端验证（Playwright + 系统 Chrome）
# 脚本位于 .screens/verify*/e2e.py，覆盖：
#   - 魔方打乱同步 / 计时流程 / 观察阶段
#   - 四模块 CRUD + 刷新持久化
#   - 分享链接完整 URL + 只读视图
#   - 项目排序（微博首位 / AI 最后）
#   - 轮播切换、悬浮按钮、2-7 阶、Modal 可见性
#   - 移动端视口（cover 尺寸 / 网格列数 / 横向滚动）
#   - 控制台 0 错误
```

**关键验证结论**（历轮累积）：持久化 ★、排序 ✓、轮播 ✓、观察阶段 ✓、分享 ✓、移动端 ✓、0 页面错误 ✓。

---

## 九、使用入口一览

| 模块 | 入口 | 说明 |
|---|---|---|
| 首页 | `/` | 像素 SANJIN + 模块跳转 + 求职 CTA |
| 项目 | `/projects` | 微博毕设置顶；`?edit=1` 进入管理模式 |
| 项目详情 | `/projects/[slug]` | 多图轮播 + 左栏图标跳转 |
| 博客 | `/blog` | 随笔时间倒序；`?edit=1` 管理模式 |
| 兴趣爱好聚合 | `/hobbies` | 三子模块入口 |
| 魔方计时器 | `/hobbies/cube` | 2-7 阶 + 观察 + 统计（旧 `/cube` 自动跳转） |
| 读书 | `/hobbies/books` | 记录/封面/分享/导出导入 |
| 影视 | `/hobbies/movies` | 同上 |
| 关于 / 联系 | `/about` · `/contact` | 简历下载（待补 PDF） |
| 预览服务 | `http://localhost:3002` | `npx serve out -l 3002` |

---

## 十、遗留事项与后续规划

### 待办（发布前必须）
- [ ] `public/resume.pdf` —— 首页/关于页「下载简历」404，需放入真实简历
- [ ] `public/avatar.jpg` —— 关于页头像 404
- [ ] `data/about.ts` —— 姓名/邮箱/公司/学校等占位符需替换为真实信息

### 可优化
- [ ] `motion` 包零引用（保留或移除）
- [ ] 微博系统待数据库就绪后接真实数据截图（当前为模板渲染 + 演示数据）
- [ ] 首页插画可考虑 AI 生成真人风格稿做 A/B

### 部署
```bash
NODE_OPTIONS= npm run build   # 产物在 out/
# GitHub Pages：CI 注入 NEXT_PUBLIC_BASE_PATH=/Personal_portfolio
```

---

*本文件随项目迭代持续更新。*
