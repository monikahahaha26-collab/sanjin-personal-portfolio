export const personalInfo = {
  name: "YOUR NAME",
  title: "电子信息工程 · AI 应用开发 / 嵌入式方向",
  tagline: "把传感、数据和模型做成稳定、可验证、能交付的产品。",
  github: "https://github.com/monikahahaha26-collab",
  email: "your.email@example.com",
  location: "城市待补充",
  school: "学校待补充",
  graduation: "毕业时间待补充",
  resumeFile: "/SANJIN-Resume.docx",
};

export const jobPreference = {
  targetRoles: ["AI 应用开发", "嵌入式软件工程师"],
  targetCities: ["城市待补充"],
  availability: "OPEN TO OPPORTUNITIES",
  workMode: ["全职", "实习"],
};

export interface Skill { name: string; level: number }
export interface SkillCategory { category: string; skills: Skill[] }

export const skillCategories: SkillCategory[] = [
  { category: "软件与 AI", skills: [{ name: "Python", level: 3 }, { name: "Java / Spring", level: 3 }, { name: "RAG / Agent", level: 3 }, { name: "React / Vue", level: 3 }] },
  { category: "嵌入式", skills: [{ name: "C / C++", level: 2 }, { name: "MCU 外设", level: 2 }, { name: "串口与网络", level: 2 }, { name: "传感器数据", level: 2 }] },
];

export interface Experience { id: string; organization: string; role: string; period: string; description: string; highlights?: string[] }
export const experiences: Experience[] = [];
export interface Education { id: string; school: string; degree: string; period: string; description?: string }
export const education: Education[] = [];
