import { Fragment, type ReactNode } from "react";

/**
 * renderMarkdown — 轻量 Markdown → JSX 渲染器
 * 覆盖博客正文所需的常见语法：标题、段落、列表、代码块、行内代码、
 * 引用、粗体/斜体、链接、分割线、图片。不引入额外依赖。
 */

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // 依次匹配：行内代码 / 加粗 / 斜体 / 链接 / 图片
  const pattern =
    /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(!\[([^\]]*)\]\(([^)]+)\))|(\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(text.slice(last, m.index));
    }
    const full = m[0];
    if (full.startsWith("`")) {
      nodes.push(
        <code key={`${keyPrefix}-c${i++}`}>{full.slice(1, -1)}</code>
      );
    } else if (full.startsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-b${i++}`}>{full.slice(2, -2)}</strong>
      );
    } else if (full.startsWith("*")) {
      nodes.push(<em key={`${keyPrefix}-i${i++}`}>{full.slice(1, -1)}</em>);
    } else if (full.startsWith("![")) {
      const alt = m[5];
      const src = m[6];
      nodes.push(
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${keyPrefix}-img${i++}`}
          src={src}
          alt={alt}
          style={{
            maxWidth: "100%",
            borderRadius: "var(--radius-lg)",
            margin: "var(--space-4) 0",
          }}
        />
      );
    } else if (full.startsWith("[")) {
      const label = m[8];
      const href = m[9];
      nodes.push(
        <a
          key={`${keyPrefix}-a${i++}`}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {label}
        </a>
      );
    }
    last = m.index + full.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function renderMarkdown(md: string): ReactNode[] {
  const lines = md.split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;

  const push = (node: ReactNode) => out.push(<Fragment key={key++}>{node}</Fragment>);

  while (i < lines.length) {
    const line = lines[i];

    // 代码块
    if (line.trimStart().startsWith("```")) {
      const lang = line.trim().slice(3).trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++; // 跳过结束标记
      push(
        <pre>
          <code className={lang ? `language-${lang}` : undefined}>
            {buf.join("\n")}
          </code>
        </pre>
      );
      continue;
    }

    // 标题
    const h = /^(#{2,3})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const text = h[2];
      if (level === 2) {
        push(<h2>{inline(text, `h2-${key}`)}</h2>);
      } else {
        push(<h3>{inline(text, `h3-${key}`)}</h3>);
      }
      i++;
      continue;
    }

    // 分割线
    if (/^\s*(---|\*\*\*)\s*$/.test(line)) {
      push(<hr />);
      i++;
      continue;
    }

    // 引用
    if (line.trimStart().startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].trimStart().startsWith(">")) {
        buf.push(lines[i].trimStart().replace(/^>\s?/, ""));
        i++;
      }
      push(<blockquote>{inline(buf.join(" "), `bq-${key}`)}</blockquote>);
      continue;
    }

    // 无序 / 有序列表
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items: string[] = [];
      while (
        i < lines.length &&
        (/^\s*[-*]\s+/.test(lines[i]) || /^\s*\d+\.\s+/.test(lines[i]))
      ) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, "").replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      if (ordered) {
        push(
          <ol>
            {items.map((it, idx) => (
              <li key={idx}>{inline(it, `oli-${key}-${idx}`)}</li>
            ))}
          </ol>
        );
      } else {
        push(
          <ul>
            {items.map((it, idx) => (
              <li key={idx}>{inline(it, `uli-${key}-${idx}`)}</li>
            ))}
          </ul>
        );
      }
      continue;
    }

    // 空行
    if (line.trim() === "") {
      i++;
      continue;
    }

    // 段落（合并后续普通行）
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{2,3})\s+/.test(lines[i]) &&
      !lines[i].trimStart().startsWith("```") &&
      !lines[i].trimStart().startsWith(">") &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    push(<p>{inline(buf.join(" "), `p-${key}`)}</p>);
  }

  return out;
}
