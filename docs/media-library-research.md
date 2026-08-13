# 读书与影视馆藏初始化研究

研究日期：2026-08-06。本文只整理馆藏初始化所需的基础元数据和无剧透简介；“读后感/观后感”应作为站内可编辑字段，由站主再按个人体验修改。

## 数据边界与录入建议

- 每一张书封面或海报对应一个可点击条目；详情页至少保存 `title`、`originalTitle`、`year`、`type`、`creator`、`synopsis`、`review`、`imageSource`、`sourceUrl`。
- 影视按“单部电影/单季电视剧”录入，不把整套系列压成一张卡。可额外用 `series` 字段把同系列条目聚合。
- 简介以下均为基于官方简介的重新表述，避免直接复制长段落；不含关键反转。读后感/观后感是新写的个人化草稿，不是来源摘录。
- “全系列”按用户明确点名的已上映长片处理；未来已官宣但截至研究日未上映的项目另列“待上映”，避免把未观看内容当成已看条目。

## 图书

### 《白夜行》

- 作者：东野圭吾（Keigo Higashino）
- 首次出版：1999（日本，集英社单行本；集英社目录列出 1999-08-05）
- 类型：推理 / 犯罪 / 社会派悬疑长篇
- 无剧透简介：一桩童年命案牵出两条此后多年交错的人生轨迹。小说以长期追查和旁观者视角逐层拼出真相，重点落在罪、代价与人如何被环境塑形。
- 资料与封面核对：[集英社书目页（ISBN 978-4-08-774400-2）](https://www.shueisha.co.jp/books/items/contents.html?isbn=4-08-774400-0)、[集英社检索页](https://www.shueisha.co.jp/books/search/search.html?titleauthor=%E7%99%BD%E5%A4%9C%E8%A1%8C)
- 录入备注：中文版本封面因出版社/再版不同而异，须把版本信息（出版社、ISBN）和图片来源一并保存。

### 《恶意》

- 作者：东野圭吾
- 首次出版：1996（日本原作；国会图书馆收录讲谈社ノベルス版本；常见讲谈社文库版为后续再版）
- 类型：本格推理 / 犯罪心理 / 加贺恭一郎系列
- 无剧透简介：畅销作家在工作场所遇害，嫌疑人与死者关系密切，却始终不愿说明真正动机。叙事通过调查记录、证言与文本视角的变化，持续追问“事实”和“动机”是否是同一件事。
- 资料：[讲谈社官方产品页](https://www.kodansha.co.jp/book/products/0000202077)、[日本国会图书馆书目（讲谈社ノベルス）](https://ndlsearch.ndl.go.jp/books/R100000002-I000002855531)
- 录入备注：详情页标注“加贺恭一郎系列·第 4 作”（系列编号来自出版方/书目体系）；不要把电影《恶意》（2025）混入图书条目。

### “法医秦明”系列

- 归类判断：**不是唯一一本书名**，而是作者笔名/品牌及多套法医悬疑作品的总称。微信读书官方书页将其列为“烧脑大合集（套装 15 册）”，并同时列出《尸语者》《无声的证词》《第十一根手指》《清道夫》《幸存者》等不同书名。
- 建议首批条目：以首部常被作为系列入口的《尸语者》（副题常见为“公安厅从未公开的法医禁忌档案”）作为一张卡，`series = 法医秦明`；之后每一本单独添加，不要用“法医秦明”作为可点击书名。
- 作者：法医秦明（笔名；职业法医背景是其作者品牌设定）
- 首次出版：2012 左右（中文版本/出版社再版较多，具体年份应以实际持有 ISBN 的版权页为准）
- 类型：法医 / 刑侦 / 悬疑推理
- 《尸语者》无剧透简介：资深法医“老秦”通过尸检和现场证据还原案件，多个独立案件展示法医工作如何让沉默的遗体“说话”。重点在证据链、职业伦理和办案者的心理压力。
- 资料：[微信读书官方套装页](https://weread.qq.com/web/bookDetail/f623242072a191daf6294db)（书名、作者、系列构成及《尸语者》简介）；具体中文版本封面/出版年份请按所选 ISBN 回查出版社或国家图书馆目录。

## 电影

### 漫威《复仇者联盟》主系列（已上映 1–4）

以下四部是截至 2026-08 已上映的主标题长片；“复仇者”在 MCU 其他个人电影中客串不另拆为本系列条目。

| 中文名 | 原名 | 年份 | 类型 | 无剧透简介 |
|---|---|---:|---|---|
| 复仇者联盟 | *The Avengers* | 2012 | 超级英雄 / 动作冒险 | 当地球面对单一英雄难以应对的威胁时，来自不同背景的英雄被召集，必须先学会协作。 |
| 复仇者联盟2：奥创纪元 | *Avengers: Age of Ultron* | 2015 | 超级英雄 / 科幻动作 | 团队试图以技术守护世界，却制造出新的失控风险；成员之间的信任和责任成为核心冲突。 |
| 复仇者联盟3：无限战争 | *Avengers: Infinity War* | 2018 | 超级英雄 / 科幻动作 | 一位追求宇宙级目标的对手开始收集关键力量，英雄们被迫在多条战线上同时应战。 |
| 复仇者联盟4：终局之战 | *Avengers: Endgame* | 2019 | 超级英雄 / 科幻动作 | 在巨大失败之后，幸存者们寻找扭转局势的可能，并面对行动所需的代价。 |

官方核对：[Marvel The Avengers](https://www.marvel.com/movies/the-avengers)、[Age of Ultron](https://www.marvel.com/movies/avengers-age-of-ultron)、[Infinity War](https://www.marvel.com/movies/avengers-infinity-war)、[Endgame](https://www.marvel.com/movies/avengers-endgame)。

**未来边界：** Marvel 已将《复仇者联盟：末日》（*Avengers: Doomsday*，2026-12-18）和《复仇者联盟：秘密战争》（*Avengers: Secret Wars*，2027-12-17）列为官方项目，但在研究日仍属于待上映；可提前建立 `status = announced` 草稿，不能当作已观看条目。[Doomsday 官方页](https://www.marvel.com/movies/avengers-doomsday)、[Secret Wars 官方页](https://www.marvel.com/movies/avengers-secret-wars)

### 《钢铁侠》三部曲

| 中文名 | 原名 | 年份 | 类型 | 无剧透简介 |
|---|---|---:|---|---|
| 钢铁侠 | *Iron Man* | 2008 | 超级英雄 / 科幻动作 | 军工企业家托尼·斯塔克在一次意外后重新审视自己的技术与责任，并打造出改变人生的装甲。 |
| 钢铁侠2 | *Iron Man 2* | 2010 | 超级英雄 / 科幻动作 | 身份公开后，托尼同时面对监管、竞争者和装甲技术带来的新威胁。 |
| 钢铁侠3 | *Iron Man 3* | 2013 | 超级英雄 / 科幻动作 | 一次个人危机迫使托尼离开熟悉的装备与资源，重新思考“英雄”究竟依赖什么。 |

官方核对：[Iron Man](https://www.marvel.com/movies/iron-man)、[Iron Man 2](https://www.marvel.com/movies/iron-man-2)、[Iron Man 3](https://www.marvel.com/movies/iron-man-3)。

### 蜘蛛侠：三代真人院线系列

#### 马奎尔版（Sam Raimi trilogy）

| 中文名 | 原名 | 年份 | 类型 | 无剧透简介 |
|---|---|---:|---|---|
| 蜘蛛侠 | *Spider-Man* | 2002 | 超级英雄 / 动作冒险 | 普通高中生彼得·帕克获得超能力后，在守护纽约、面对宿敌与维系日常生活之间寻找平衡。 |
| 蜘蛛侠2 | *Spider-Man 2* | 2004 | 超级英雄 / 动作冒险 | 彼得试图回归普通生活，但新的高危对手和责任感迫使他重新穿上战衣。 |
| 蜘蛛侠3 | *Spider-Man 3* | 2007 | 超级英雄 / 动作冒险 | 彼得面对多个敌人及内心的阴影，个人关系和英雄身份同时承受压力。 |

官方核对：[Sony Spider-Man](https://www.sonypictures.com/movies/spiderman)、[Spider-Man 2](https://www.sonypictures.com/movies/spiderman2)、[Spider-Man 3](https://www.sonypictures.com/movies/spiderman3)。

#### 超凡蜘蛛侠（Andrew Garfield）

| 中文名 | 原名 | 年份 | 类型 | 无剧透简介 |
|---|---|---:|---|---|
| 超凡蜘蛛侠 | *The Amazing Spider-Man* | 2012 | 超级英雄 / 动作冒险 | 青少年彼得在校园生活、家庭谜团和新获得的能力之间摸索，并开始承担城市守护者的角色。 |
| 超凡蜘蛛侠2 | *The Amazing Spider-Man 2* | 2014 | 超级英雄 / 动作冒险 | 当新的敌人接连出现，彼得发现自己面临一场比以往更复杂的选择与考验。 |

官方核对：[Sony The Amazing Spider-Man](https://www.sonypictures.com/movies/theamazingspiderman)、[The Amazing Spider-Man 2](https://www.sonypictures.com/movies/theamazingspiderman2)。

#### 荷兰弟（Tom Holland，MCU/Sony）

| 中文名 | 原名 | 年份 | 类型 | 无剧透简介 |
|---|---|---:|---|---|
| 蜘蛛侠：英雄归来 | *Spider-Man: Homecoming* | 2017 | 超级英雄 / 青春动作 | 彼得在校园日常与超级英雄训练之间努力证明自己，同时面对一名利用高科技犯罪的对手。 |
| 蜘蛛侠：英雄远征 | *Spider-Man: Far From Home* | 2019 | 超级英雄 / 青春动作 | 一次欧洲旅行被突发任务打断，彼得被迫在个人生活和更大的世界危机之间做决定。 |
| 蜘蛛侠：英雄无归 | *Spider-Man: No Way Home* | 2021 | 超级英雄 / 科幻动作 | 彼得寻求解决身份困境的方法，却引发跨越不同世界的连锁后果。 |
| 蜘蛛侠：崭新之日（暂译） | *Spider-Man: Brand New Day* | 2026 | 超级英雄 / 动作冒险 | Sony/Marvel 官方页已列为 2026 电影，故事设定为彼得在一个不再记得他的世界里独自以蜘蛛侠身份行动。Marvel 官方页给出 2026-07-31 上映日；上线地区的中文发行名应以当地发行方为准。 |

前三部官方核对：[Homecoming](https://www.marvel.com/movies/spider-man-homecoming)、[Far From Home](https://www.marvel.com/movies/spider-man-far-from-home)、[No Way Home](https://www.marvel.com/movies/spider-man-no-way-home)；第四部核对：[Marvel Brand New Day](https://www.marvel.com/movies/spider-man-brand-new-day)、[Sony Brand New Day](https://www.sonypictures.com/movies/spidermanbrandnewday)。

## 电视剧

### 《仙剑奇侠传三》

- 年份：2009
- 类型：古装 / 仙侠 / 奇幻 / 爱情；37 集（爱奇艺页面标注）
- 主创识别：导演李国立；主要角色景天、唐雪见、龙葵、长卿等。
- 无剧透简介：渝州永安当伙计景天与唐门大小姐雪见相遇，因玉佩和身世线索结成搭档，逐步卷入守护苍生的仙侠旅程。简介保留“欢喜冤家”和成长主题，不揭示结局。
- 官方资料：[爱奇艺正版页面](https://m.iqiyi.com/a_19rrh8qrf9.html)（剧名、导演、集数、剧情简介）；亦可用[腾讯视频条目](https://v.qq.com/x/cover/mzc00200fplxtc5.html)作播放入口。

### 《老九门》

- 年份：2016
- 类型：民国 / 悬疑 / 探险 / 剧情；48 集（爱奇艺页面标注）
- 主创识别：导演梁胜权；核心人物张启山、二月红、尹新月。
- 无剧透简介：民国长沙九大家族守护地下秘密，张启山调查神秘鬼车和矿山线索，并向已退隐的二月红求助；调查牵连家族历史、情感和抗战背景。
- 官方资料：[爱奇艺正版页面](https://www.iqiyi.com/a_19rrhbeaxt.html)（导演、集数、剧情简介）。

## 海报/封面图片的合法来源策略

1. **首选本地原创素材。** 书籍可拍摄自己合法购买的实体书封面，影视可使用自己拍摄的收藏/票根/观影记录，或为卡片制作不含原画的文字排版占位图。图片文件旁记录拍摄者、日期和来源。
2. **需要官方封面时走授权或官方媒体资源。** 出版社产品页、Marvel/Sony 电影页中的图片仍受版权保护；官方页面能证明来源，但不等于给网站再发布授权。若要下载并随站点分发，应取得出版社/制片方/发行方的书面许可，并保留许可凭证和署名要求。
3. **电影海报 API 只在遵守条款时使用。** TMDB 等服务可提供图片 URL 和 attribution 要求，但版权仍归制片方/发行方；必须按 API 条款署名、不要移除水印或把 API 图片当作自有素材，也不要抓取豆瓣图片后直接热链。
4. **避免不稳定热链。** 生产环境将获准图片下载到 `public/media`，保存 `sourceUrl`、`license`、`credit` 和抓取日期；未获授权的条目使用本地原创占位图，详情页保留官方资料链接即可。

## 游戏馆藏

游戏固定分为 `Steam`、`手机游戏`、`主机游戏` 三类。年份优先记录作品首次正式发行年；Steam 后上架的老游戏同时记录 `steamReleaseYear`，避免把移植/上架年份误作首发年份。

### Steam

| 展示中文名 | 官方英文/店铺名 | 首发 / Steam 年份 | 设备与平台 | 无剧透简介 |
|---|---|---|---|---|
| 荒野大镖客：救赎 2 | *Red Dead Redemption 2* | 2018 / 2019 | Windows PC（Steam）；原始版本亦有 PS4、Xbox One | 亚瑟·摩根与范德林德帮在美国旧西部的时代转折中逃亡求生，玩家需要在帮派忠诚、个人选择和开放世界探索之间作出决定。 |
| 黑神话：悟空 | *Black Myth: Wukong* | 2024 / 2024 | Windows PC（Steam）；亦有 PS5 等版本 | 玩家扮演“天命人”，在取材自中国神话与《西游记》的世界里探索、战斗并追寻昔日传说的真相。 |
| 泰坦陨落 2 | *Titanfall® 2* | 2016 / 2020 | Windows PC（Steam）；原始版本亦有 PS4、Xbox One | 一名边境民兵步枪兵与先锋级泰坦结成搭档，在高速跑酷、机甲战斗和战役任务中完成彼此的使命。 |
| 飞越 13 号房 | *Breakout 13* | 2023 / 2023 | Windows、macOS、Linux（Steam 当前平台标记） | 一名叛逆少年被送入行为矫治机构，玩家通过互动影像、线索调查和分支选择寻找逃离与改变结局的可能。 |

命名说明：Steam 中国区页面把前两款中的《荒野大镖客：救赎 2》以英文 `Red Dead Redemption 2` 上架，把《泰坦陨落 2》以 `Titanfall® 2` 上架；表中中文名是国内通行展示名，`storeTitle` 应保留官方英文。Steam 官方接口当前给出的上架日分别为 2019-12-05、2024-08-19、2020-06-18、2023-01-08；《黑神话：悟空》发行方公布的全球日期为 2024-08-20，因此若保存精确日期，应以发行方公告为准，年份不受影响。

官方核对：[Red Dead Redemption 2 Steam](https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/)、[Rockstar 官方页](https://www.rockstargames.com/reddeadredemption2/)、[黑神话：悟空 Steam](https://store.steampowered.com/app/2358720/_/)、[游戏科学官网](https://www.gamesci.cn/wukong)、[Titanfall 2 Steam](https://store.steampowered.com/app/1237970/Titanfall_2/)、[EA 官方页](https://www.ea.com/games/titanfall/titanfall-2)、[飞越 13 号房 Steam](https://store.steampowered.com/app/2095300/13/)。

### 手机游戏

| 官方中文名 | 英文名 / 英文参考名 | 年份 | 设备与平台 | 无剧透简介 |
|---|---|---:|---|---|
| 王者荣耀 | *Honor of Kings* | 2015 | iOS、Android；中国大陆移动客户端 | 腾讯天美推出的团队英雄竞技游戏，核心体验是在多种地图和规则下进行 5v5 实时对战并与队友协作推进。 |
| 鸣潮 | *Wuthering Waves* | 2024 | iOS、Android；另有 Windows PC、PS5 版本 | 玩家作为苏醒的“漂泊者”在灾变后的开放世界中旅行，与共鸣者同行，寻找失去的记忆并调查世界异变。 |
| 火影忍者 | *NARUTO Mobile*（英文参考名，无独立国际版官名） | 2016 | iOS、Android；腾讯中国大陆移动客户端 | 以《火影忍者》动画剧情和角色为基础的横版格斗手游，包含忍者收集、剧情关卡与实时竞技玩法。 |

年份说明：腾讯官方新闻明确《王者荣耀》于 2015-11-26 正式公测；《火影忍者》手游于 2016-05-19 开启公测。`Honor of Kings` 是《王者荣耀》的官方全球英文品牌，但国际服与中国服的内容、账号体系不应在数据层混为同一客户端。《火影忍者》没有与中国腾讯客户端完全对应的官方国际英文产品名，因此英文栏只作为检索参考。

官方核对：[王者荣耀官网](https://pvp.qq.com/)、[2015-11-26 公测公告](https://pvp.qq.com/webplat/info/news_version3/15592/24091/24092/24094/m15241/201511/404574.shtml)、[鸣潮官网](https://wutheringwaves.kurogames.com/)、[鸣潮全球上线公告](https://wutheringwaves.kurogames.com/en/main/news/detail/728)、[火影忍者手游官网](https://hyrz.qq.com/)、[2016-05-19 公测公告](https://hyrz.qq.com/webplat/info/news_version3/11946/23790/23792/23935/23937/m21283/201605/462770.shtml)。

### 主机游戏

| 官方中文名 | 官方英文名 | 年份 | 设备与平台 | 无剧透简介 |
|---|---|---:|---|---|
| 超级马力欧 奥德赛 | *Super Mario Odyssey* | 2017 | Nintendo Switch 系列 | 马力欧与拥有附身能力的帽子伙伴凯皮环游多个王国，运用跳跃和投帽动作阻止酷霸王的婚礼计划。 |
| 超级马力欧兄弟 惊奇 | *Super Mario Bros. Wonder* | 2023 | Nintendo Switch 系列 | 马力欧一行进入花花王国，触碰惊奇花会让横版关卡发生意想不到的规则和场景变化。 |
| 塞尔达传说 旷野之息 | *The Legend of Zelda: Breath of the Wild* | 2017 | Nintendo Switch、Wii U；本馆按 Switch 版归类 | 林克在沉睡百年后醒来，于开放的海拉鲁大地探索遗迹、恢复记忆并寻找拯救王国的方法。 |
| 宝可梦 紫 | *Pokémon Violet* | 2022 | Nintendo Switch 系列 | 玩家在帕底亚地区展开开放世界冒险，可自由选择探索路线，捕捉、培育宝可梦并挑战不同故事线。 |
| 星之卡比 探索发现 | *Kirby and the Forgotten Land* | 2022 | Nintendo Switch 系列 | 卡比来到遍布文明遗迹的未知世界，以复制能力和“塞满嘴变形”探索立体关卡并营救瓦豆鲁迪。 |
| 宝可梦 X | *Pokémon X* | 2013 | Nintendo 3DS / 2DS 系列；不支持 Nintendo Switch | 玩家在卡洛斯地区收集、培育和对战宝可梦，探索新地区并接触系列首次引入的超级进化系统。 |

选择说明：用户未指定具体“星之卡比”作品，首批馆藏采用 2022 年的《星之卡比 探索发现》，因为它是 Switch 上独立发行的主线 3D 动作代表作；不使用笼统的“星之卡比”作为单个游戏条目。《宝可梦 X》当年没有官方中文版，中文展示名使用宝可梦现行中文品牌名，`originalTitle` 保存 `Pokémon X`，并明确它是 3DS 软件而不是 Switch 软件。

官方核对：[超级马力欧 奥德赛（任天堂香港）](https://www.nintendo.com.hk/switch/super_mario_odyssey/)、[Super Mario Odyssey（Nintendo US）](https://www.nintendo.com/us/store/products/super-mario-odyssey-switch/)、[超级马力欧兄弟 惊奇（任天堂香港）](https://www.nintendo.com.hk/switch/aqmxa/)、[Super Mario Bros. Wonder（Nintendo US）](https://www.nintendo.com/us/store/products/super-mario-bros-wonder-switch/)、[塞尔达传说 旷野之息（任天堂香港）](https://www.nintendo.com.hk/switch/zelda_botw/index.html)、[Breath of the Wild 官方页](https://www.zelda.com/breath-of-the-wild/)、[宝可梦 紫（任天堂香港商店）](https://store.nintendo.com.hk/70010000053974)、[Pokémon Violet 官方页](https://scarletviolet.pokemon.com/en-us/)、[星之卡比 探索发现（任天堂香港）](https://www.nintendo.com.hk/switch/arzga/index.html)、[Kirby and the Forgotten Land（Nintendo US）](https://www.nintendo.com/us/store/products/kirby-and-the-forgotten-land-switch/)、[Pokémon X / Y 官方页](https://www.pokemon.com/us/pokemon-video-games/pokemon-x-and-pokemon-y)。

### 游戏封面素材来源建议

1. **Steam 条目：** 优先使用 Steam 商店官方接口返回的 `capsule_image` 或 `header_image`，不要从第三方攻略站抓图。把获准使用的文件下载到 `public/media/games/steam/<slug>/`，并在数据中保存 Steam App ID、原始 URL、权利人和获取日期。Steam 页面可作为来源证明，但商店素材仍受发行商版权约束，公开部署前应确认 Steam Web API/发行商的展示条款。
2. **手机游戏：** 优先使用游戏官网的新闻媒体包、官方 App Store/Google Play 商品页截图或开发商明确提供的宣传图。腾讯、库洛等官网图片可核对真伪，但“能下载”不等于允许再分发；没有明确授权时使用自制文字封面。
3. **任天堂/宝可梦：** 优先使用 Nintendo eShop、任天堂香港和 Pokémon 官方商品页的包装图作为核对来源；需要本地化时优先申请媒体素材授权。不要使用电商卖家扫描图或百科图片替代官方来源。
4. **统一素材清单：** 建议为每个本地文件记录 `sourceUrl`、`rightsHolder`、`licenseStatus`、`retrievedAt`、`credit`。`licenseStatus` 未确认时只在开发环境预览，生产环境回退到原创文字卡面；不要直接热链官方 CDN。

## 交互动效研究

本节面向个人作品集上线前的动效美化。原则是“动效帮助理解层级、关系和状态”，而不是让所有元素持续运动。数值均是结合本项目界面密度给出的实现建议，不是浏览器规范强制值。

### 技术能力与适用边界

| 能力 | 一手资料结论 | 本项目适用场景 | 实现边界 |
|---|---|---|---|
| Web Animations API（WAAPI） | 将浏览器的时间模型和动画模型暴露给脚本；`Element.animate()` 返回可暂停、取消、反向和查询状态的 `Animation`。 | 筛选结果重排后的淡入、封面打开/关闭、需要中途取消或反向的交互动效。 | 简单 hover 和单次淡入仍优先 CSS；组件卸载或新动画开始时取消旧动画，避免动画队列叠加。 |
| Intersection Observer | 异步观察元素与视口/祖先容器的交叉变化，适合“是否进入视口”的判断。 | 首页章节、作品卡片、时间线节点的一次性入场；粘性导航切换背景状态。 | 它不提供逐像素滚动进度，不应用来模拟连续视差；入场完成后 `unobserve`，页面无脚本时内容必须默认可见。 |
| CSS scroll-driven animations | CSS 动画可以绑定滚动时间线或元素进入视口的 view timeline，而不是绑定普通时间轴。 | 文章阅读进度条、极轻的章节强调、封面从视口边缘进入时的局部变化。 | 用 `@supports (animation-timeline: view())` 渐进增强；不支持时保持静态或退回 Intersection Observer。避免大幅视差、横向劫持和改变阅读速度的滚动效果。 |
| View Transitions API | 可在同文档 DOM 状态变化或跨文档导航间创建过渡，并能给共享元素设置独立过渡。 | 馆藏封面进入详情页、项目卡进入项目详情、列表/网格视图切换。 | 只为稳定、唯一的封面或项目主图设置 `view-transition-name`；先保证普通导航完整可用，再用能力检测增强。不要让返回键、焦点恢复或滚动位置依赖动画。 |
| `prefers-reduced-motion` | 浏览器可读取用户在操作系统中减少非必要运动的偏好，页面应移除、减少或替换运动。 | 全站所有入场、视差、平滑滚动、共享元素过渡和自动循环效果。 | 不能只缩短持续时间而保留大幅位移；减少动效模式下取消视差和缩放，使用即时状态变化或很短的透明度过渡，同时保留信息和操作反馈。 |

资料：[MDN Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)、[W3C Web Animations](https://www.w3.org/TR/web-animations-1/)、[MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)、[MDN CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations)、[W3C Scroll-driven Animations Level 1](https://www.w3.org/TR/scroll-animations-1/)、[MDN View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)、[W3C CSS View Transitions Level 1](https://www.w3.org/TR/css-view-transitions-1/)、[Chrome/web.dev View Transitions 指南](https://developer.chrome.com/docs/web-platform/view-transitions)、[MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)。

### 设计系统的共同原则

- **Material Design 3：表达性必须服务于易用性。** Material 将 motion 定义为让界面更有表现力且更易使用的工具。本项目应让动效说明“卡片来自哪里、详情与哪张封面相关、筛选后哪些内容发生变化”，不为普通正文逐字或逐行表演。[Material Design 3 Motion](https://m3.material.io/styles/motion/overview)
- **IBM Carbon：区分高频生产型动效与少量表达型动效。** 导航、筛选、按钮反馈属于高频操作，应快速克制；首页首屏或重点项目可有稍明显但次数有限的表达型入场。不要把首页宣传级节奏复制到每一张馆藏卡。[Carbon Motion](https://carbondesignsystem.com/elements/motion/overview/)
- **Microsoft Fluent 2：功能、自然、一致、吸引力按此顺序。** 同类组件应共享时长、缓动和方向；空间关系要连续，不能让元素无缘由从不同方向飞入。[Fluent 2 Motion](https://fluent2.microsoft.design/motion)
- **Awwwards 只作为视觉样本库。** 获奖动画站点适合观察构图、节奏和焦点转移，但其中全屏转场、跟随光标、滚动劫持等展示型手法不应直接照搬到需要快速浏览的个人作品集。[Awwwards Animation Websites](https://www.awwwards.com/websites/animation/)

### 建议的全站动效节奏

以下参数可作为第一版设计 token，再根据真实设备截图和录屏微调：

| 层级 | 建议持续时间 | 位移 / 缩放 | 节奏 |
|---|---:|---|---|
| 按钮、图标、卡片 hover | 140–200ms | `translateY(-2px)` 或 `scale(1.01)`，二选一 | 立即响应，不延迟；触屏端不依赖 hover。 |
| 筛选、标签、局部内容替换 | 180–260ms | 透明度配合 4–8px 位移 | 新操作到来时取消上一动画。 |
| 章节首次进入视口 | 380–520ms | 从下方 12–16px 回到原位 | 标题先于内容，间隔约 60–90ms。 |
| 一组卡片入场 | 每张 320–440ms | 8–12px + 透明度 | 每张错开 45–70ms，最多错开 5–6 张；更长列表按组出现。 |
| 封面/项目卡进入详情 | 240–320ms | 共享元素保持空间连续，正文淡入 | 不播放全屏遮罩，不延迟 URL 和可交互状态更新。 |

缓动建议：进入使用自然减速曲线，退出略快；全站只维护 2–3 个 easing token。不要每个组件自定义弹簧、回弹或不同方向，这会破坏一致性。

### 针对本项目的具体方案

1. **首页首屏：** 姓名/主标题以透明度和 12px 上移在 480ms 内出现，副标题和主要操作晚 70ms；首屏图片只做淡入，不做缩放穿梭。首屏加载时不播放超过一秒的开场动画。
2. **章节入场：** 用一个 Intersection Observer 管理带 `data-reveal` 的章节，建议阈值约 `0.15`、底部 `rootMargin` 约 `-8%`；每个章节只播放一次。卡片很多时只错开首行，后续整体出现。
3. **读书、影视、游戏馆藏：** 列表卡 hover 仅轻微抬升和边框/阴影变化；点击封面时可用 View Transition 把同一封面连续带到详情页，简介和读后感/观后感随后淡入。禁止 3D 翻书、持续倾斜或跟随鼠标旋转，这些效果会妨碍密集浏览。
4. **项目与馆藏筛选：** 状态先立即更新，再用 WAAPI 对新结果做 180–220ms 淡入；旧动画在下次筛选前取消。结果数量和焦点位置不能等待动画结束才更新。
5. **文章阅读进度：** 有支持时用 scroll-driven animation 驱动顶部细进度条；不支持时可省略，不需要用高频 `scroll` 监听器复制。滚动时间线只改变进度条的 `transform: scaleX()`。
6. **导航和详情返回：** 粘性导航的背景/分隔线可由顶部 sentinel 的 Intersection Observer 切换；详情页返回列表优先恢复原滚动位置，动画不能覆盖这一浏览器行为。
7. **减少动效模式：** 在 `prefers-reduced-motion: reduce` 下移除所有滚动绑定、视差、位移和缩放；设置 `scroll-behavior: auto`，入场内容直接可见。必要反馈可保留 80–120ms 的透明度变化。脚本创建 WAAPI 动画时也要通过 `matchMedia('(prefers-reduced-motion: reduce)')` 选择静态分支。

### 性能与上线前检查

- 主要动画只改变 `transform` 和 `opacity`。web.dev 明确建议尽量使用这两类属性，并避免触发布局或绘制的属性；不要动画化 `width`、`height`、`top`、`left`，也不要对大面积元素持续使用 blur/filter。[web.dev 高性能 CSS 动画](https://web.dev/articles/animations-guide)
- 不给所有卡片永久设置 `will-change`；只在确有必要且生命周期短的动画附近使用。Intersection Observer 入场完成后停止观察，WAAPI 动画在组件卸载时取消。
- 内容必须在动画脚本失败、CSS 新特性不支持、JavaScript 关闭时仍然可见和可操作。新增 API 全部采用 feature detection 和渐进增强。
- 上线前在桌面与手机各检查：首页首次加载、快速滚动、连续切换筛选、详情进入/返回、键盘 Tab 导航、浏览器后退、系统减少动效模式。
- 验收时确认没有布局跳动、滚动劫持、焦点被过渡层遮挡、按钮在动画期间失效，以及多张卡同时运动争夺注意力的问题。
- `prefers-reduced-motion` 服务于可能因运动产生不适的用户，应把它作为功能需求而非装饰性选项。[web.dev prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion)

### 明确避免

- 避免所有页面元素一进入视口就重复播放，尤其不要滚下去和滚回来各播放一次。
- 避免整页平滑滚动劫持、惯性光标、自动轮播、长时间背景循环、文字逐字弹跳和大幅视差。
- 避免在同一视口同时使用粒子背景、封面倾斜、标题拆字和卡片错峰；每个屏幕只保留一个明确的运动焦点。
- 避免用动画掩盖加载时间，或把导航、链接和表单的可操作时机推迟到过渡结束。
- 避免仅以“浏览器支持”为上线依据；View Transitions 和 scroll-driven animations 都必须有无动画或低动画回退。
