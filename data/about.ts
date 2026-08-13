/* ============================================
   Personal Data — About Page & Hero
   替换为你的真实信息
   ============================================ */

export const personalInfo = {
  name: "SANJIN",
  title: "应届毕业生 · Java 后端与 AI 应用方向",
  tagline: "以企业采购平台与销售分析 Agent 为主线，记录 Java 后端、AI 应用与数据可视化实践。",
  github: "https://github.com/cuber-sanjin",
  resumeFile: "/SANJIN-Resume.docx",
};

export const jobPreference = {
  targetRoles: ["Java 后端开发", "AI 应用开发", "数据分析"],
  targetCities: ["面议"],
  availability: "2026 届应届毕业生",
  workMode: ["全职", "实习"],
};

export interface Skill {
  name: string;
  level: number; // 1-5, 用于显示熟练度条
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: "语言",
    skills: [
      { name: "Python", level: 3 },
      { name: "Java", level: 2 },
      { name: "HTML / CSS / JavaScript", level: 3 },
      { name: "SQL", level: 3 },
    ],
  },
  {
    category: "框架 & 库",
    skills: [
      { name: "Flask / Servlet", level: 2 },
      { name: "React / Next.js", level: 2 },
      { name: "Pandas / jieba / ECharts", level: 3 },
    ],
  },
  {
    category: "工具 & 平台",
    skills: [
      { name: "Git / GitHub", level: 3 },
      { name: "MySQL", level: 2 },
      { name: "AI 辅助开发", level: 3 },
    ],
  },
];

export interface Experience {
  id: string;
  organization: string;
  role: string;
  period: string;
  description: string;
  highlights?: string[];
}

export const experiences: Experience[] = [];

export interface Education {
  id: string;
  school: string;
  degree: string;
  period: string;
  description?: string;
}

export const education: Education[] = [];
