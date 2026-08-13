import Link from "next/link";

export const metadata = { title: "Off Duty" };

const anime = [
  { title: "葬送的芙莉莲", status: "WATCHING", genre: "奇幻 / 公路", note: "把漫长时间写得很轻，情绪却一直在。" },
  { title: "孤独摇滚！", status: "COMPLETED", genre: "乐队 / 日常", note: "喜欢它把内耗变成具体、可笑又可爱的画面。" },
  { title: "赛博朋克：边缘行者", status: "COMPLETED", genre: "科幻 / 动作", note: "节奏很猛，但角色关系留得住。" },
];
const games = [
  { title: "塞尔达传说：旷野之息", platform: "Nintendo Switch", progress: "主线完成", rating: "9.5 / 10", note: "最喜欢在不被任务指挥的时候，自己找到一条路。" },
  { title: "泰坦陨落 2", platform: "PC", progress: "战役通关", rating: "9 / 10", note: "关卡机制和移动手感都很干净。" },
  { title: "鸣潮", platform: "Mobile / PC", progress: "持续游玩", rating: "8 / 10", note: "战斗反馈很直接，适合短时间进入状态。" },
];

export default function HobbiesPage() {
  return <section className="page-console off-duty"><div className="container"><header className="page-title"><p>OFF DUTY / INPUT SIGNALS</p><h1>下班后的输入</h1><span>追番和游戏是另一组持续采样的数据。</span></header><div className="off-duty-grid"><section><header><p>01 / ANIME ARCHIVE</p><h2>追番记录</h2></header>{anime.map((item, index) => <article className="archive-row" key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.title}</h3><p>{item.genre}</p><p>{item.note}</p></div><b>{item.status}</b></article>)}</section><section><header><p>02 / GAME SAVE FILES</p><h2>游戏存档</h2></header>{games.map((item, index) => <article className="archive-row" key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.title}</h3><p>{item.platform} · {item.progress}</p><p>{item.note}</p></div><b>{item.rating}</b></article>)}</section></div><Link className="back-link" href="/">← 返回主信号</Link></div></section>;
}
