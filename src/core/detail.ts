import { t } from "./i18n";
import { esc } from "./dom";
import type { DetailView } from "./types";

// 说明：s.html 等由各模块拼装，凡插入数据字段一律经 esc()；来源 url 同样转义后作为 href。

export function renderDetail(
  view: DetailView,
  onRelated: (id: string) => void,
): void {
  const root = document.getElementById("detailRoot");
  if (!root) return;

  const sections = view.sections
    .map(
      (s) => `
      <div class="detail-section">
        <h4>${esc(t(s.labelKey))}</h4>
        <div class="body">${s.html}</div>
      </div>`,
    )
    .join("");

  const related =
    view.related && view.related.length
      ? `<div class="detail-section">
         <h4>${esc(t("ui.related"))}</h4>
         <div class="related-list">${view.related
           .map(
             (r) =>
               `<button class="related-link" data-rel="${esc(r.id)}">${esc(r.title)}</button>`,
           )
           .join("")}</div>
       </div>`
      : "";

  const sources =
    view.sources && view.sources.length
      ? `<div class="detail-section">
         <h4>${esc(t("ui.sources"))}</h4>
         <div class="sources">${view.sources
           .map((s) => {
             // label 已含年份（如 "Milgram (1963)"）时不再重复拼接
             const hasYear =
               s.year != null && String(s.label).includes(`(${s.year})`);
             const text = `${esc(s.label)}${
               s.year && !hasYear ? " (" + esc(s.year) + ")" : ""
             }`;
             return s.url
               ? `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${text}</a>`
               : text;
           })
           .join("；")}</div>
       </div>`
      : "";

  root.innerHTML = `
    <div class="detail-panel" role="dialog" aria-modal="true">
      <div class="detail-head">
        <h2>${esc(view.title)}</h2>
        <button class="detail-close" id="detailClose" aria-label="${esc(t("ui.close"))}">✕</button>
      </div>
      ${view.sub ? `<p class="detail-sub">${esc(view.sub)}</p>` : ""}
      ${sections}${related}${sources}
    </div>`;
  root.hidden = false;
  document.body.style.overflow = "hidden";

  const panel = root.querySelector<HTMLElement>(".detail-panel")!;
  const closeBtn = panel.querySelector<HTMLElement>("#detailClose");
  const lastFocused =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

  const close = () => {
    root.hidden = true;
    root.innerHTML = "";
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
    lastFocused?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      close();
      return;
    }
    if (e.key !== "Tab") return;
    // 焦点圈定：Tab 只在面板内的可聚焦元素间循环
    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((n) => !n.hasAttribute("disabled"));
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  closeBtn?.addEventListener("click", close);
  root.addEventListener("click", (e) => {
    if (e.target === root) close();
  });
  document.addEventListener("keydown", onKey);
  closeBtn?.focus();

  root.querySelectorAll<HTMLElement>(".related-link").forEach((b) =>
    b.addEventListener("click", () => {
      const id = b.dataset.rel;
      if (id) onRelated(id);
    }),
  );
}
