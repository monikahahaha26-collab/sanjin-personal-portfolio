"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import {
  personalInfo,
  jobPreference,
  skillCategories,
  experiences,
  education,
} from "@/data/about";

export default function AboutPage() {
  return (
    <section
      style={{
        padding: "var(--space-16) var(--space-6)",
        minHeight: "60vh",
      }}
      aria-label="关于我"
    >
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto" }}>
        {/* Profile Header */}
        <div
          style={{
            display: "flex",
            gap: "var(--space-8)",
            alignItems: "flex-start",
            marginBottom: "var(--space-16)",
          }}
          className="profile-header"
        >
          {/* Avatar */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              backgroundColor: "var(--color-bg-tertiary)",
              overflow: "hidden",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",
              border: "2px solid var(--color-border)",
            }}
            aria-label="头像"
          >
            👤
          </div>

          {/* Info */}
          <div>
            <h1
              style={{
                fontSize: "var(--text-3xl)",
                fontWeight: 800,
                color: "var(--color-text-primary)",
                marginTop: 0,
                marginBottom: "var(--space-2)",
              }}
            >
              {personalInfo.name}
            </h1>
            <p
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--color-accent)",
                fontWeight: 600,
                margin: 0,
                marginBottom: "var(--space-3)",
              }}
            >
              {personalInfo.title}
            </p>
            <p
              style={{
                fontSize: "var(--text-base)",
                color: "var(--color-text-secondary)",
                lineHeight: "var(--leading-relaxed)",
                maxWidth: 560,
                marginBottom: "var(--space-4)",
              }}
            >
              {personalInfo.tagline}
            </p>

            {/* 仅展示非敏感求职信息 */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-4)",
                fontSize: "var(--text-sm)",
                color: "var(--color-text-muted)",
              }}
            >
              <span>{jobPreference.availability}</span>
            </div>

            {/* Resume Download */}
            <div style={{ marginTop: "var(--space-5)" }}>
              <Button href={personalInfo.resumeFile} size="md" download>
                📄 下载简历
              </Button>
            </div>
          </div>
        </div>

        {/* Job Preference */}
        <section style={{ marginBottom: "var(--space-16)" }}>
          <h2
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              marginBottom: "var(--space-5)",
            }}
          >
            💼 求职意向
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            <div
              style={{
                padding: "var(--space-5)",
                backgroundColor: "var(--color-bg-secondary)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <dt
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "var(--space-2)",
                }}
              >
                目标岗位
              </dt>
              <dd
                style={{ margin: 0, display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}
              >
                {jobPreference.targetRoles.map((role) => (
                  <Tag key={role}>{role}</Tag>
                ))}
              </dd>
            </div>
            <div
              style={{
                padding: "var(--space-5)",
                backgroundColor: "var(--color-bg-secondary)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <dt
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "var(--space-2)",
                }}
              >
                期望城市
              </dt>
              <dd
                style={{ margin: 0, display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}
              >
                {jobPreference.targetCities.map((city) => (
                  <Tag key={city} variant="outline">
                    {city}
                  </Tag>
                ))}
              </dd>
            </div>
            <div
              style={{
                padding: "var(--space-5)",
                backgroundColor: "var(--color-bg-secondary)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <dt
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "var(--space-2)",
                }}
              >
                工作模式 & 到岗时间
              </dt>
              <dd
                style={{ margin: 0, display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}
              >
                {[...jobPreference.workMode, jobPreference.availability].map((item) => (
                  <Tag key={item} variant="accent">
                    {item}
                  </Tag>
                ))}
              </dd>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section style={{ marginBottom: "var(--space-16)" }}>
          <SectionHeading subtitle="我在日常开发中熟练使用的技术栈和工具。">
            技能
          </SectionHeading>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-6)",
            }}
          >
            {skillCategories.map((category) => (
              <div key={category.category}>
                <h3
                  style={{
                    fontSize: "var(--text-base)",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginTop: 0,
                    marginBottom: "var(--space-4)",
                    paddingBottom: "var(--space-2)",
                    borderBottom: "2px solid var(--color-accent)",
                    display: "inline-block",
                  }}
                >
                  {category.category}
                </h3>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-3)",
                  }}
                >
                  {category.skills.map((skill) => (
                    <li key={skill.name}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "var(--space-1)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--color-text-primary)",
                          }}
                        >
                          {skill.name}
                        </span>
                        <span
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--color-text-muted)",
                          }}
                        >
                          {"★".repeat(skill.level)}
                          <span style={{ opacity: 0.3 }}>
                            {"★".repeat(5 - skill.level)}
                          </span>
                        </span>
                      </div>
                      {/* Skill bar */}
                      <div
                        style={{
                          height: 4,
                          backgroundColor: "var(--color-bg-tertiary)",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${(skill.level / 5) * 100}%`,
                            backgroundColor: "var(--color-accent)",
                            borderRadius: 2,
                            transition: "width var(--duration-slow) var(--ease-out)",
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Timeline */}
        {experiences.length > 0 && <section style={{ marginBottom: "var(--space-16)" }}>
          <SectionHeading subtitle="我的职业成长路径。">
            工作经历
          </SectionHeading>
          <div style={{ position: "relative" }}>
            {/* Timeline line */}
            <div
              style={{
                position: "absolute",
                left: 7,
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: "var(--color-border)",
              }}
              aria-hidden="true"
            />
            {experiences.map((exp, i) => (
              <div
                key={exp.id}
                style={{
                  position: "relative",
                  paddingLeft: "var(--space-8)",
                  paddingBottom:
                    i < experiences.length - 1 ? "var(--space-10)" : 0,
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 6,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: "var(--color-bg-primary)",
                    border: "3px solid var(--color-accent)",
                  }}
                  aria-hidden="true"
                />
                <div
                  style={{
                    padding: "var(--space-5)",
                    backgroundColor: "var(--color-bg-secondary)",
                    borderRadius: "var(--radius-lg)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "baseline",
                      gap: "var(--space-3)",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "var(--text-base)",
                        fontWeight: 700,
                        color: "var(--color-text-primary)",
                        margin: 0,
                      }}
                    >
                      {exp.role}
                    </h3>
                    <span
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-accent)",
                        fontWeight: 500,
                      }}
                    >
                      @ {exp.organization}
                    </span>
                    <span
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {exp.period}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text-secondary)",
                      margin: "0 0 var(--space-3) 0",
                      lineHeight: "var(--leading-normal)",
                    }}
                  >
                    {exp.description}
                  </p>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--space-1)",
                      }}
                    >
                      {exp.highlights.map((highlight, j) => (
                        <li
                          key={j}
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--color-text-muted)",
                            paddingLeft: "var(--space-4)",
                            position: "relative",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              color: "var(--color-accent)",
                            }}
                          >
                            •
                          </span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>}

        {/* Education */}
        {education.length > 0 && <section>
          <SectionHeading subtitle="教育背景。">
            教育经历
          </SectionHeading>
          {education.map((edu) => (
            <div
              key={edu.id}
              style={{
                padding: "var(--space-5)",
                backgroundColor: "var(--color-bg-secondary)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "baseline",
                  gap: "var(--space-3)",
                  marginBottom: "var(--space-2)",
                }}
              >
                <h3
                  style={{
                    fontSize: "var(--text-base)",
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                    margin: 0,
                  }}
                >
                  {edu.school}
                </h3>
                <span
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {edu.degree}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {edu.period}
                </span>
              </div>
              {edu.description && (
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-muted)",
                    margin: 0,
                  }}
                >
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </section>}
      </div>
    </section>
  );
}
