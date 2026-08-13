import type { StoredBook, StoredGame, StoredMovie } from "@/lib/store";

/**
 * 公开版本直接读取这些固定馆藏；本地开发环境可写入 localStorage
 * 以便作者整理内容，重新构建后再发布。
 */
export const LIBRARY_SEED_VERSION = "library-2026-08-06-v1";
export const GAME_SEED_VERSION = "games-2026-08-06-v2";

const book = (value: Omit<StoredBook, "id" | "date" | "status" | "rating">): StoredBook => ({
  ...value,
  id: `seed-book-${value.title}`,
  date: "2026-08-06",
  status: "已读",
  rating: 5,
});

export const seedBooks: StoredBook[] = [
  book({
    title: "白夜行",
    author: "东野圭吾",
    category: "长篇小说 · 推理",
    year: "1999",
    cover: "/media/books/bai-ye-xing.jpg",
    intro: "故事从一桩发生在大阪的谋杀案开始，沿着十九年的时间线，追踪桐原亮司与唐泽雪穗两个人各自沉默、彼此照应的人生。小说把推理的谜面藏在人物命运里，真正的悬念是：一个人为了活下去，究竟可以把自己改造成什么样子。",
    reflection: "我最难忘的不是案件本身，而是两个人始终没有并肩走在同一束光下。作者几乎不直接写他们的内心，只让旁人的目光拼出一条冷而完整的轨迹。读到最后，所谓“白夜”更像一种活着的惩罚：太阳永远不会真正升起，但人还得继续走。它让我重新想起，推理小说也可以把人的孤独写得这样深。",
    note: "把人的孤独写成了一条没有日出的长路。",
  }),
  book({
    title: "恶意",
    author: "东野圭吾",
    category: "长篇小说 · 本格推理",
    year: "1996",
    cover: "/media/books/e-yi.jpg",
    intro: "畅销作家野野口修被发现死于家中，案件看似证据确凿，却在叙述的缝隙中不断反转。加贺恭一郎面对的不是“谁做的”，而是一个更难回答的问题：为什么有人要把另一个人从世界上抹掉，还要精心替他写好一份不堪的故事。",
    reflection: "《恶意》厉害的地方在于，它让我在阅读时一次次相信“真相”，又一次次发现自己只是接受了被安排的叙事。加贺的追问没有炫技，反而像一点点剥掉语言上的装饰。读完之后我会对“我听到的故事”多留一分警惕，也更相信真正的恶意往往不是爆发，而是长时间的比较、羞耻和自我说服。",
    note: "最可怕的不是谎言，而是一个人如何把谎言活成了自我解释。",
  }),
  book({
    title: "尸语者",
    author: "法医秦明",
    category: "纪实推理 · 法医",
    year: "2012",
    cover: "/media/books/shi-yu-zhe.jpg",
    intro: "法医秦明以真实职业经验为底色，记录解剖室、现场勘查与案件侦破中的细节。书中每一个“不会说话”的遗体，都通过伤痕、时间和物证留下线索；法医的工作，是让这些沉默的证词重新回到案件里。",
    reflection: "这本书让我第一次具体地理解法医工作的重量：专业不是冷漠，而是必须在情绪之外保持准确。书里有悬疑，也有很多不适合被浪漫化的日常。真正打动我的，是作者对死者的尊重和对证据的耐心。所谓“尸语”，其实是在提醒我们，事实从来不会因为没人愿意听就消失。",
    note: "专业的底色不是猎奇，而是对事实和逝者的尊重。",
  }),
];

const movie = (value: Omit<StoredMovie, "id" | "date" | "rating" | "note">): StoredMovie => ({
  ...value,
  id: `seed-movie-${value.title}`,
  date: "2026-08-06",
  rating: value.status === "想看" ? 0 : 5,
  note: value.reflection ?? "",
  kind: value.kind ?? (value.category?.startsWith("电视剧") ? "电视剧" : "电影"),
});

export const seedMovies: StoredMovie[] = [
  movie({ title: "复仇者联盟", category: "电影 · MCU", series: "复仇者联盟", year: "2012", cover: "/media/movies/avengers-1.jpg", status: "已看", intro: "钢铁侠、美国队长、雷神、绿巨人、黑寡妇与鹰眼第一次集结，在纽约保卫战中面对洛基与宇宙魔方带来的危机。", reflection: "第一次看到一群完全不同的英雄真正站到一起，爽感来自性格碰撞而不只是大场面。最后那句关于团队的台词，到现在仍然是超级英雄电影最清楚的一次自我介绍。" }),
  movie({ title: "复仇者联盟2：奥创纪元", category: "电影 · MCU", series: "复仇者联盟", year: "2015", cover: "/media/movies/avengers-2.jpg", status: "已看", intro: "复仇者们试图用心灵宝石启动和平守卫计划，却意外创造出把人类视为威胁的人工智能奥创。", reflection: "这部的情绪比第一部更复杂：英雄的胜利同时制造了新的灾难。奥创像是托尼不安的回声，让“为了保护大家”第一次显出危险的另一面。" }),
  movie({ title: "复仇者联盟3：无限战争", category: "电影 · MCU", series: "复仇者联盟", year: "2018", cover: "/media/movies/avengers-3.jpg", status: "已看", intro: "灭霸为收集六颗无限宝石向宇宙发起战争，复仇者与银河护卫队等英雄被迫在不同战场共同迎战。", reflection: "它把超级英雄电影拍出了史诗悲剧的结构：每个人都很努力，却仍然无法阻止结局。灭霸的逻辑并不值得认同，但电影让他的执念拥有了完整的重量，这也是它最残酷的地方。" }),
  movie({ title: "复仇者联盟4：终局之战", category: "电影 · MCU", series: "复仇者联盟", year: "2019", cover: "/media/movies/avengers-4.jpg", status: "已看", intro: "幸存的英雄们在失败后重新集结，试图通过一次跨越时间的行动扭转宇宙的失去，并为十一年的故事暂时画下句号。", reflection: "《终局之战》像一封写给长期观众的回信，最动人的不是反转，而是每个人终于要为自己的选择付出代价。那种“我们一起走到这里”的情绪，至今仍然很难被别的系列复制。" }),
  movie({ title: "钢铁侠", category: "电影 · MCU", series: "钢铁侠", year: "2008", cover: "/media/movies/iron-man-1.jpg", status: "已看", intro: "军火商托尼·史塔克在一次绑架后重新审视自己的发明，用简陋装甲逃出生天，并把天才、财富与责任重新组合成钢铁侠。", reflection: "它最迷人的地方是把英雄诞生拍得像一次产品迭代：失败、拆解、重做，最后才成为真正可靠的版本。托尼的魅力不在于完美，而在于他愿意承认旧的自己已经不够用了。" }),
  movie({ title: "钢铁侠2", category: "电影 · MCU", series: "钢铁侠", year: "2010", cover: "/media/movies/iron-man-2.jpg", status: "已看", intro: "托尼面对装甲技术外泄、伊凡·万科的复仇以及身体状况恶化，同时还要学会把英雄身份交给团队共同承担。", reflection: "这部更像托尼从个人秀走向团队协作的过渡章。剧情不如第一部紧，但黑寡妇登场、舞台赛车和最后的装甲协同，仍然保留了那种机械与性格一起发光的快乐。" }),
  movie({ title: "钢铁侠3", category: "电影 · MCU", series: "钢铁侠", year: "2013", cover: "/media/movies/iron-man-3.jpg", status: "已看", intro: "纽约大战后陷入焦虑的托尼，在一系列恐怖袭击与“满大人”阴影中重新面对装甲之外的自己。", reflection: "我很喜欢它把“钢铁侠”从一套装备重新放回一个人的身体里。托尼失去装甲时仍然可以解决问题，这个落点让英雄不再只是炫酷科技，而是选择、幽默和承担。" }),
  movie({ title: "蜘蛛侠", category: "电影 · 超级英雄", series: "马奎尔版蜘蛛侠", year: "2002", cover: "/media/movies/spider-man-raimi-1.jpg", status: "已看", intro: "彼得·帕克被蜘蛛咬伤后获得超能力，在成长、爱情与责任之间学会成为真正的蜘蛛侠。", reflection: "它有一种很真诚的漫画感：城市像童话，绿魔像噩梦，而彼得的犹豫又完全像普通高中生。那句关于力量与责任的话，成为很多人第一次理解超级英雄的入口。" }),
  movie({ title: "蜘蛛侠2", category: "电影 · 超级英雄", series: "马奎尔版蜘蛛侠", year: "2004", cover: "/media/movies/spider-man-raimi-2.jpg", status: "已看", intro: "彼得在生活压力、感情选择与章鱼博士失控的机械实验之间摇摆，重新决定自己是否要继续做蜘蛛侠。", reflection: "这是我心里最完整的蜘蛛侠电影之一。彼得把面具放下时，城市短暂恢复平静；当他重新戴上面具，电梯里那个小孩的眼神又让责任变得具体而温柔。" }),
  movie({ title: "蜘蛛侠3", category: "电影 · 超级英雄", series: "马奎尔版蜘蛛侠", year: "2007", cover: "/media/movies/spider-man-raimi-3.jpg", status: "已看", intro: "彼得遭遇毒液、沙人和哈利的复仇，名声与黑暗力量同时膨胀，迫使他面对自己最不愿承认的部分。", reflection: "它有些拥挤，却也因此显得像一次青春期的失控。黑色战衣不是单纯的反派道具，而是彼得虚荣、嫉妒和报复心的外化。最后的道歉来得迟，但仍然保留了这个系列的悲悯。" }),
  movie({ title: "超凡蜘蛛侠", category: "电影 · 超级英雄", series: "超凡蜘蛛侠", year: "2012", cover: "/media/movies/amazing-spider-man-1.jpg", status: "已看", intro: "彼得·帕克在追查父母留下的线索时获得超能力，也在格温·史黛西身边重新理解“保护他人”的意义。", reflection: "这一版的彼得更像一个有点莽撞的摄影少年，和格温之间的化学反应让电影多了轻盈的青春气息。蛛丝摆荡拍得很有速度感，像城市终于有了属于自己的游乐场。" }),
  movie({ title: "超凡蜘蛛侠2", category: "电影 · 超级英雄", series: "超凡蜘蛛侠", year: "2014", cover: "/media/movies/amazing-spider-man-2.jpg", status: "已看", intro: "彼得与格温的关系走到新的选择，电光人和哈利·奥斯本的命运则把他推向一次无法回避的失去。", reflection: "它最有效的部分仍然是彼得和格温的关系：两个人都明白危险，却还是愿意认真相爱。结尾让蜘蛛侠的责任突然变得沉重，也解释了他为什么必须继续回来。" }),
  movie({ title: "蜘蛛侠：英雄归来", category: "电影 · MCU", series: "荷兰弟版蜘蛛侠", year: "2017", cover: "/media/movies/spider-man-mcu-1.jpg", status: "已看", intro: "刚加入复仇者视野的彼得想证明自己，在皇后区处理小事的同时追查秃鹫的武器网络。", reflection: "它把蜘蛛侠重新放回“邻家”尺度：考试、朋友、地铁和一件不合身的战衣。彼得最后拒绝直接获得更大的身份，反而说明他已经准备好成为自己的英雄。" }),
  movie({ title: "蜘蛛侠：英雄远征", category: "电影 · MCU", series: "荷兰弟版蜘蛛侠", year: "2019", cover: "/media/movies/spider-man-mcu-2.jpg", status: "已看", intro: "彼得以为自己终于可以享受一次欧洲旅行，却被尼克·弗瑞拉回超能力世界，面对神秘客制造的幻象。", reflection: "旅行喜剧的轻快和幻境战斗的失真感放在一起很有意思。它真正讲的是彼得想把责任交给一个更成熟的大人，后来才发现成长往往意味着不能把决定权永远交出去。" }),
  movie({ title: "蜘蛛侠：英雄无归", category: "电影 · MCU", series: "荷兰弟版蜘蛛侠", year: "2021", cover: "/media/movies/spider-man-mcu-3.jpg", status: "已看", intro: "彼得请求奇异博士让所有人忘记自己的身份，却意外打开多元宇宙，让不同世界的敌人与蜘蛛侠同时来到身边。", reflection: "它的情怀很直接，却没有只停在怀旧：三个彼得彼此看见，也彼此修补了曾经的遗憾。最后的选择把“被记住”换成“继续做正确的事”，是很成熟的告别。" }),
  movie({ title: "蜘蛛侠：崭新之日", category: "电影 · MCU", series: "荷兰弟版蜘蛛侠", year: "2026", cover: "/media/movies/spider-man-mcu-4.jpg", status: "想看", intro: "新一章的蜘蛛侠故事，彼得在失去旧生活后继续守护纽约。影片仍处于上映前后的新阶段，馆藏先记录为待看。", reflection: "先把期待留给银幕。相比继续堆叠熟悉的多元宇宙，我更想看到一个真正独自生活、独自承担选择的彼得。", }),
  movie({ title: "仙剑奇侠传三", category: "电视剧 · 古装奇幻", series: "国产电视剧", year: "2009", cover: "/media/movies/chinese-paladin-3-v2.jpg", status: "已看", intro: "景天与雪见、龙葵、长卿、紫萱等人踏上寻找五灵珠的旅途，在前世今生、江湖情义与拯救苍生之间作出选择。", reflection: "它把“少年人的快乐”和“注定要失去”放在同一条旅途里，所以多年后重看仍然会被击中。景天不只是一个被选中的人，他是在一次次告别之后主动承担起责任的普通人。" }),
  movie({ title: "老九门", category: "电视剧 · 民国悬疑", series: "国产电视剧", year: "2016", cover: "/media/movies/the-mystic-nine.jpg", status: "已看", intro: "长沙城九门势力围绕矿山、古墓与家族秘密展开故事，张启山、二月红等人在乱世中寻找真相，也守护各自珍视的人。", reflection: "我喜欢它的不是单纯的探墓刺激，而是九门人物各自背负的旧账。张启山的克制、二月红的深情和齐铁嘴的机敏，让一部群像剧有了很鲜明的气质。" }),
];

const game = (value: Omit<StoredGame, "id" | "date" | "rating" | "note">): StoredGame => ({
  ...value,
  id: `seed-game-${value.title}`,
  date: "2026-08-06",
  rating: value.status === "想玩" ? 0 : 5,
  note: value.reflection ?? "",
});

export const seedGames: StoredGame[] = [
  game({ title: "Red Dead Redemption 2（荒野大镖客：救赎 2）", platform: "Steam", device: "PC · Steam", category: "开放世界 · 动作冒险", year: "2019", cover: "/media/games/rdr2.jpg", status: "已通关", intro: "1899 年，美国蛮荒时代走向终结。亚瑟·摩根与范德林德帮在一次抢劫失利后被迫逃亡，在忠诚、理想与生存之间作出选择。", reflection: "我最喜欢它愿意让旅程慢下来：扎营、照料马匹、听同伴聊天，这些小事让帮派真正像一个逐渐裂开的家。亚瑟的弧光不是突然成为英雄，而是在迟来的清醒里尽量把剩下的路走对。" }),
  game({ title: "黑神话：悟空", platform: "Steam", device: "PC · Steam", category: "动作角色扮演 · 中国神话", year: "2024", cover: "/media/games/black-myth-wukong.jpg", status: "已通关", intro: "玩家化身“天命人”，为了探寻昔日传说的真相，踏上一条充满强敌、奇景与隐秘故事的西游之路。", reflection: "它最打动我的不只是技术完成度，而是那些熟悉的神怪、古建和民间想象终于以可探索的空间出现。战斗需要耐心观察，章节结尾又常留下一点苍凉，让这趟西游不只是打赢妖王。" }),
  game({ title: "Titanfall 2（泰坦陨落 2）", platform: "Steam", device: "PC · Steam", category: "第一人称射击 · 科幻", year: "2016", cover: "/media/games/titanfall-2.jpg", status: "已通关", intro: "边境民兵步枪兵杰克·库珀意外与先锋级泰坦 BT-7274 建立连接，两人在敌后并肩完成一项几乎不可能的任务。", reflection: "跑墙、滑铲和泰坦切换带来的速度感至今仍然很少有射击游戏能复制。真正留下来的却是 BT 那种克制的可靠感，短短一段战役把“信任协议”写成了很真诚的伙伴关系。" }),
  game({ title: "飞越13号房", platform: "Steam", device: "PC · Steam", category: "互动影像 · 剧情选择", year: "2023", cover: "/media/games/breakout-13.jpg", status: "已通关", intro: "一名被送入戒网瘾机构的少年试图寻找出路。玩家通过调查、选择与多线叙事，逐步改变自己和同伴的命运。", reflection: "互动影像让每次妥协和反抗都变得很具体，有些选择明知危险却仍然不愿沉默。它的表演偶尔夸张，但题材的现实重量和多分支探索让我愿意把不同结局都走一遍。" }),
  game({ title: "王者荣耀", platform: "手机游戏", device: "iOS · Android", category: "多人在线战术竞技", year: "2015", cover: "/media/games/honor-of-kings.jpg", status: "在玩", intro: "腾讯天美工作室群开发的多人在线战术竞技手游。玩家选择英雄组成队伍，在不同模式中围绕路线、资源和团队配合展开对战。", reflection: "它适合随时开一局，但真正有意思的部分始终是团队节奏：一次及时支援比单纯追求击杀更有成就感。英雄和版本不断变化，也让我每隔一段时间回来都会重新学习。" }),
  game({ title: "鸣潮", platform: "手机游戏", device: "iOS · Android", category: "开放世界 · 动作角色扮演", year: "2024", cover: "/media/games/wuthering-waves.jpg", status: "在玩", intro: "漂泊者从沉睡中醒来，在经历灾变的世界里结识共鸣者，探索文明重建后的地域，并追寻自身记忆与身份。", reflection: "高速闪避、弹反和角色切换让战斗很有节奏，移动探索也足够轻快。我更期待它把世界观里那些关于声音与灾变的概念讲得更集中，让风景之外也有持续追下去的动力。" }),
  game({ title: "火影忍者", platform: "手机游戏", device: "iOS · Android", category: "格斗 · 动作", year: "2016", cover: "/media/games/naruto-mobile.jpg", status: "在玩", intro: "由正版授权、腾讯发行的动作格斗手游，以忍者收集、决斗场对战和原作剧情体验为核心。", reflection: "熟悉的忍者技能被做成清晰的连招与替身博弈，决斗场赢下一次预判时很有满足感。对我来说它也是一份可操作的火影记忆，角色登场往往会唤起当年追动画的片段。" }),
  game({ title: "超级马力欧 奥德赛", platform: "主机游戏", device: "Nintendo Switch", category: "3D 平台跳跃", year: "2017", cover: "/media/games/super-mario-odyssey.jpg", status: "已通关", intro: "马力欧与拥有附身能力的帽子凯皮结伴，乘坐奥德赛号穿越多个王国，阻止酷霸王的婚礼计划。", reflection: "几乎每个角落都藏着一个小点子，月亮奖励让探索总有回应。附身机制不断改变移动和观察方式，通关后仍会觉得这个世界还有一半惊喜没有被发现。" }),
  game({ title: "超级马力欧兄弟 惊奇", platform: "主机游戏", device: "Nintendo Switch", category: "2D 平台跳跃", year: "2023", cover: "/media/games/super-mario-bros-wonder.jpg", status: "已通关", intro: "马力欧一行来到花花王国。惊奇花会让关卡规则突然改变，水管、敌人乃至视角都可能变成全新的样子。", reflection: "它把熟悉的横版马力欧重新做出了第一次游玩的新鲜感，惊奇花几乎每关都敢换一套规则。难度亲切但不敷衍，和朋友一起时尤其能体会到混乱又默契的快乐。" }),
  game({ title: "塞尔达传说 旷野之息", platform: "主机游戏", device: "Nintendo Switch", category: "开放世界 · 动作冒险", year: "2017", cover: "/media/games/zelda-botw.jpg", status: "已通关", intro: "林克从百年沉睡中醒来，在辽阔的海拉鲁恢复记忆、解放神兽，并准备面对盘踞在城堡中的灾厄盖侬。", reflection: "它最珍贵的是把“你能不能过去看看”变成了游戏的核心语言。攀上一座山、借风滑翔或临时拼出解法时，我感到自己不是在完成清单，而是真的在理解一片土地。" }),
  game({ title: "宝可梦 紫", platform: "主机游戏", device: "Nintendo Switch", category: "角色扮演 · 收集养成", year: "2022", cover: "/media/games/pokemon-violet.png", status: "已通关", intro: "玩家进入帕底亚地区的学院学习，在开放世界中自由推进冠军之路、传说之路与星尘之路三条故事线。", reflection: "自由决定挑战顺序让宝可梦冒险终于更像一次自己的旅行，伙伴故事也比预想中温暖。技术表现有遗憾，但第一次骑着密勒顿穿过帕底亚时，那种探索新地区的兴奋仍然很纯粹。" }),
  game({ title: "星之卡比 探索发现", platform: "主机游戏", device: "Nintendo Switch", category: "3D 动作 · 平台跳跃", year: "2022", cover: "/media/games/kirby-forgotten-land.jpg", status: "已通关", intro: "卡比被卷入神秘漩涡，来到文明与自然交错的新世界，为营救瓦豆鲁迪展开首次完整的 3D 冒险。", reflection: "它看起来轻松可爱，却总能用场景变化和能力升级给出新的反馈。塞满嘴变形既好笑又聪明，后期挑战也证明卡比的温柔气质并不等于缺少深度。" }),
  game({ title: "宝可梦 X", platform: "主机游戏", device: "Nintendo 3DS", category: "角色扮演 · 收集养成", year: "2013", cover: "/media/games/pokemon-x.png", status: "已通关", intro: "玩家来到以法国为灵感的卡洛斯地区，与伙伴踏上宝可梦训练家之旅，并首次体验系列主线作品的全 3D 对战与超级进化。", reflection: "从像素走向 3D 的变化在当年非常有冲击力，超级进化也让熟悉的宝可梦重新获得惊喜。卡洛斯的城市和道路有一种明亮的旅行感，是我很愿意重新打开 3DS 回去走走的一代。" }),
];
