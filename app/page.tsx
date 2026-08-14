import Link from "next/link";
import { HomeHero } from "@/components/home/HomeHero";
import { getFeaturedProjects } from "@/lib/content";
import { jobPreference, personalInfo, skillCategories } from "@/data/about";
import { withBasePath } from "@/lib/public-path";

export default function HomePage() {
  const featured = getFeaturedProjects();
  return <>
    <HomeHero />
    <section className="console-section"><div className="container"><header className="section-console-head"><p>01 / CAPABILITY MAP</p><h2>我如何把信号<br />变成可用结果</h2><span>从数据、模型到界面与设备侧的工程实现</span></header>
      <div className="capability-grid">{skillCategories.map((group, index) => <article className="capability-panel" key={group.category}><span className="panel-index">0{index + 1}</span><h3>{group.category}</h3><ul>{group.skills.map((skill) => <li key={skill.name}><span>{skill.name}</span><i><b style={{ width: `${skill.level * 20}%` }} /></i></li>)}</ul></article>)}</div>
    </div></section>
    <section className="console-section feature-section"><div className="container"><header className="section-console-head inline"><div><p>02 / FEATURED BUILDS</p><h2>重点项目</h2></div><Link href="/projects" className="text-link">浏览全部仓库 <b>+</b></Link></header><div className="featured-grid">{featured.map((project) => <article key={project.repoName} className="featured-project"><div className="featured-number">{String(project.featured).padStart(2, "0")}</div><div><p>{project.category} / {project.language || "SOURCE"}</p><h3>{project.frontmatter.title}</h3><p className="featured-summary">{project.frontmatter.summary}</p><div className="repo-tags">{project.frontmatter.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div><Link href={`/projects/${project.slug}`}>查看项目档案 <b>+</b></Link></div></article>)}</div></div></section>
    <section className="console-section"><div className="container route-layout"><header className="section-console-head"><p>03 / TECHNICAL ROUTE</p><h2>软硬之间，<br />保持链路完整</h2></header><div className="route-line"><article><span>INPUT</span><h3>感知与数据</h3><p>理解用户、传感器与业务数据提供的原始信号。</p></article><article><span>PROCESS</span><h3>模型与系统</h3><p>用算法、服务和明确的边界处理复杂性。</p></article><article><span>OUTPUT</span><h3>交互与验证</h3><p>让结果在页面、设备或流程里被真正使用。</p></article></div></div></section>
    <section className="off-duty-prompt"><div className="container"><div><p>04 / OFF DUTY IS NOT IDLE</p><h2>365 部追番，<br />和持续扩展的游戏库。</h2></div><p>把长期偏好当作另一组可检索的数据：封面、进度和来源平台都留在档案里。</p><Link href="/hobbies" className="console-button primary">打开兴趣档案 ↗</Link></div></section>
    <section id="contact" className="contact-console"><div className="container"><p className="console-label"><span className="status-light" /> CHANNEL OPEN / {jobPreference.availability}</p><h2>正在寻找<br /><span>下一段信号。</span></h2><p>目标岗位：{jobPreference.targetRoles.join(" / ")}<br />{personalInfo.school} · {personalInfo.graduation} · {personalInfo.location}</p><div className="signal-actions"><a className="console-button primary" href={`mailto:${personalInfo.email}`}>发送邮件</a><a className="console-button" href={personalInfo.github} target="_blank" rel="noreferrer">GitHub</a><a className="console-button" href={withBasePath(personalInfo.resumeFile)} download>下载简历</a></div></div></section>
  </>;
}
