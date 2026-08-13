import type { Metadata } from "next";
import Link from "next/link";

const REPO = "https://github.com/cuber-sanjin/sanjin-personal-portfolio";
const WEB_EDITOR = "https://github.dev/cuber-sanjin/sanjin-personal-portfolio";

export const metadata: Metadata = {
  title: "作者工作台",
  description: "三金个人作品集的在线内容编辑与发布入口。",
  robots: { index: false, follow: false },
};

const editCards = [
  {
    index: "01",
    eyebrow: "BLOG / MDX",
    title: "写博客",
    description: "在 content/blogs 中新建或修改 MDX，文章会自动出现在博客页。",
    href: `${WEB_EDITOR}/tree/main/content/blogs`,
    action: "打开博客目录",
  },
  {
    index: "02",
    eyebrow: "PROJECT / CASE",
    title: "改项目",
    description: "编辑项目说明、技术栈、排序和截图路径；截图统一放入 public/projects。",
    href: `${WEB_EDITOR}/tree/main/content/projects`,
    action: "打开项目目录",
  },
  {
    index: "03",
    eyebrow: "PROFILE / DATA",
    title: "改个人资料",
    description: "调整姓名、求职方向、技能、经历和简历链接等结构化资料。",
    href: `${WEB_EDITOR}/blob/main/data/about.ts`,
    action: "编辑个人资料",
  },
];

export default function EditorPage() {
  return (
    <section className="editor-shell" aria-labelledby="editor-title">
      <div className="editor-grid" aria-hidden="true" />
      <div className="editor-container">
        <header className="editor-hero">
          <div>
            <p className="editor-kicker">SANJIN / AUTHOR DESK</p>
            <h1 id="editor-title">在线编辑，提交后自动发布。</h1>
            <p className="editor-lede">
              展示站保持纯静态、快速且只读；编辑工作在 GitHub 登录保护下进行。
              每次提交到 <code>main</code>，GitHub Actions 会自动同步到展示站。
            </p>
          </div>
          <div className="editor-status" aria-label="发布流程">
            <span className="editor-status-dot" />
            <div>
              <b>自动发布已连接</b>
              <small>EDIT → COMMIT → BUILD → LIVE</small>
            </div>
          </div>
        </header>

        <div className="editor-actions" aria-label="主要入口">
          <a className="editor-primary" href={WEB_EDITOR} target="_blank" rel="noreferrer">
            进入在线编辑器
            <span aria-hidden="true">↗</span>
          </a>
          <Link className="editor-secondary" href="/">
            查看纯展示站
          </Link>
          <a
            className="editor-secondary"
            href={`${REPO}/actions/workflows/deploy.yml`}
            target="_blank"
            rel="noreferrer"
          >
            查看部署状态
          </a>
        </div>

        <div className="editor-card-grid">
          {editCards.map((card) => (
            <a key={card.index} className="editor-card" href={card.href} target="_blank" rel="noreferrer">
              <span className="editor-card-index">{card.index}</span>
              <p>{card.eyebrow}</p>
              <h2>{card.title}</h2>
              <span className="editor-card-copy">{card.description}</span>
              <b>{card.action} ↗</b>
            </a>
          ))}
        </div>

        <section className="editor-guide" aria-labelledby="publish-guide">
          <div>
            <p className="editor-kicker">PUBLISH CHECKLIST</p>
            <h2 id="publish-guide">三步完成一次更新</h2>
          </div>
          <ol>
            <li><b>编辑</b><span>在 GitHub.dev 修改文件，博客可从模板复制。</span></li>
            <li><b>提交</b><span>左侧“源代码管理”填写中文说明，Commit 到 main。</span></li>
            <li><b>上线</b><span>等待 Actions 变绿，通常 1–3 分钟后展示站更新。</span></li>
          </ol>
          <div className="editor-guide-links">
            <a href={`${REPO}/blob/main/docs/templates/blog-post.mdx`} target="_blank" rel="noreferrer">
              查看博客模板 ↗
            </a>
            <a href={`${REPO}/blob/main/README.md#在线编辑与自动同步`} target="_blank" rel="noreferrer">
              阅读完整说明 ↗
            </a>
          </div>
        </section>

        <p className="editor-security">
          安全说明：此页面不保存账号、密码或访问令牌；实际编辑权限由 GitHub 登录状态决定。
        </p>
      </div>
    </section>
  );
}
