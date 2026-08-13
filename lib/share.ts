/**
 * 内容分享与备份工具（纯前端，无后端）
 *
 * - 分享链接：把数据 JSON 编码进 URL 的 ?share= 参数，他人打开即可查看只读快照。
 *   说明：图片(base64)体积大，分享时剔除，仅携带文字数据。
 * - 导出/导入备份：把数据下载为 .json 文件，可跨设备永久保存与恢复。
 */

/** 编码：数据 → URL 参数值（剔除超大字段以控制链接长度） */
export function encodeShareData(
  data: unknown,
  opts?: { maxLength?: number }
): string {
  const max = opts?.maxLength ?? 30000;
  // 递归剔除图片字段（base64），避免 URL 超长
  const strip = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(strip);
    if (v && typeof v === "object") {
      const o: Record<string, unknown> = {};
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
        if (typeof val === "string" && (val.startsWith("data:image") || val.length > 2000)) continue;
        o[k] = strip(val);
      }
      return o;
    }
    return v;
  };
  let encoded = encodeURIComponent(JSON.stringify(strip(data)));
  // 超出长度则逐步丢弃（记录太多时保留前面部分）
  while (encoded.length > max) {
    try {
      const arr = JSON.parse(decodeURIComponent(encoded));
      if (Array.isArray(arr) && arr.length > 1) {
        encoded = encodeURIComponent(JSON.stringify(arr.slice(0, Math.ceil(arr.length / 2))));
      } else {
        break;
      }
    } catch {
      break;
    }
  }
  return encoded;
}

/** 解码：URL 参数值 → 数据 */
export function decodeShareData<T>(raw: string): T | null {
  try {
    return JSON.parse(decodeURIComponent(raw)) as T;
  } catch {
    return null;
  }
}

/** 从当前 URL 读取 share 参数 */
export function getShareParam(): string | null {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.search).get("share");
  return p;
}

/** 拼接分享链接（完整 URL，含 origin，可直接分享给他人） */
export function buildShareUrl(base: string, data: unknown): string {
  const enc = encodeShareData(data);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}${base}?share=${enc}`;
}

/** 复制文本到剪贴板（失败时回退 execCommand） */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

/** 下载 JSON 备份文件 */
export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** 读取用户选择的 JSON 文件 */
export function readJsonFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result)));
      } catch {
        reject(new Error("JSON 解析失败"));
      }
    };
    reader.onerror = () => reject(new Error("文件读取失败"));
    reader.readAsText(file);
  });
}
