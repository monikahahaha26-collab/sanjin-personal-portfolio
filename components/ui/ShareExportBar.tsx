"use client";

import { useRef, useState } from "react";
import { buildShareUrl, copyText, downloadJson, readJsonFile } from "@/lib/share";
import { Modal } from "@/components/ui/Modal";

/**
 * ShareExportBar — 分享 / 导出 / 导入 操作条
 * - 分享：生成 ?share= 链接（只含文字数据，不含图片），弹窗复制
 * - 导出：下载 JSON 备份文件（含图片 base64，可永久保存）
 * - 导入：读取 JSON 备份恢复
 */
export function ShareExportBar({
  data,
  basePath,
  filename,
  onImport,
  title = "分享与备份",
}: {
  data: unknown;
  basePath: string; // 当前页面路径，如 "/hobbies/books"
  filename: string; // 导出文件名
  onImport?: (data: unknown) => void;
  title?: string;
}) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleShare = () => {
    const url = buildShareUrl(basePath, data);
    setShareUrl(url);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    const ok = await copyText(shareUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      // 选中让用户手动复制
      const el = document.querySelector<HTMLInputElement>(".share-link-input");
      el?.select();
    }
  };

  const handleExport = () => downloadJson(filename, data);

  const handleImportFile = async (file: File) => {
    try {
      const parsed = await readJsonFile(file);
      onImport?.(parsed);
      alert("导入成功，数据已合并到本地。");
    } catch (e) {
      alert(`导入失败：${e instanceof Error ? e.message : "文件格式不正确"}`);
    }
  };

  return (
    <>
      <div className="share-bar" role="group" aria-label={title}>
        <button className="btn btn-outline btn-sm" onClick={handleShare} title="生成可分享链接（不含图片）">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4-4 4M12 2v13" />
          </svg>
          分享链接
        </button>
        <button className="btn btn-outline btn-sm" onClick={handleExport} title="下载 JSON 备份（含图片）">
          ⬇ 导出备份
        </button>
        <button className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()} title="从 JSON 备份恢复">
          ⬆ 导入备份
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImportFile(f);
            e.target.value = "";
          }}
        />
      </div>

      <Modal open={shareUrl !== null} onClose={() => setShareUrl(null)} title="分享链接">
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", margin: "0 0 var(--space-4)", lineHeight: "var(--leading-normal)" }}>
          他人打开此链接即可查看内容快照（仅文字数据，图片不随链接分享）。若需完整备份（含图片），请使用「导出备份」。
        </p>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <input
            className="share-link-input"
            readOnly
            value={shareUrl ?? ""}
            onFocus={(e) => e.currentTarget.select()}
            style={{ flex: 1, minWidth: 0 }}
          />
          <button className="btn btn-primary btn-sm" onClick={handleCopy}>
            {copied ? "✅ 已复制" : "复制链接"}
          </button>
        </div>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", margin: "var(--space-3) 0 0" }}>
          提示：内容保存在链接中，链接越长代表内容越多；分享到聊天/邮件前请确认长度可接受。
        </p>
      </Modal>
    </>
  );
}
