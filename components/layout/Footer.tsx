import Link from "next/link";
import { personalInfo } from "@/data/about";
export function Footer() { return <footer className="console-footer"><div className="container"><p><span className="status-light" /> PORTFOLIO SIGNAL / {new Date().getFullYear()}</p><nav aria-label="页脚导航"><Link href="/">首页</Link><Link href="/projects">项目</Link><Link href="/hobbies">兴趣</Link><a href={personalInfo.github} target="_blank" rel="noreferrer">GitHub</a></nav></div></footer>; }
