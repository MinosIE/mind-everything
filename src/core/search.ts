import { allItems } from "./related";
import { t, L } from "./i18n";
import { esc } from "./dom";

interface Hit {
  id: string;
  title: string;
  sub: string;
  typeLabel: string;
}

export function initSearch(openDetailById: (id: string) => void): void {
  const input = document.getElementById("search") as HTMLInputElement | null;
  const box = document.getElementById("searchResults");
  if (!input || !box) return;

  let hits: Hit[] = [];
  let activeIdx = -1;

  const titleOf = (item: any): string =>
    String(L(item, "name") ?? L(item, "term") ?? item.id ?? "");

  const closeBox = (): void => {
    box.hidden = true;
    activeIdx = -1;
    input.setAttribute("aria-expanded", "false");
  };
  const showBox = (): void => {
    box.hidden = false;
    input.setAttribute("aria-expanded", "true");
  };
  const setActive = (i: number): void => {
    if (!hits.length) return;
    activeIdx = (i + hits.length) % hits.length;
    box
      .querySelectorAll<HTMLElement>(".sr-item")
      .forEach((b, j) => b.classList.toggle("active", j === activeIdx));
  };
  const openHit = (i: number): void => {
    const h = hits[i];
    if (!h) return;
    closeBox();
    input.value = "";
    openDetailById(h.id);
  };

  const render = () => {
    const q = input.value.trim().toLowerCase();
    activeIdx = -1;
    if (!q) {
      closeBox();
      box.innerHTML = "";
      return;
    }
    hits = [];
    allItems().forEach((entry, id) => {
      const title = titleOf(entry.item);
      const sub = String(
        L(entry.item, "oneLiner") ?? L(entry.item, "plain") ?? "",
      );
      const hay = (title + " " + sub + " " + id).toLowerCase();
      if (hay.includes(q)) {
        hits.push({ id, title, sub, typeLabel: t(entry.typeLabelKey) });
      }
    });
    if (!hits.length) {
      showBox();
      box.innerHTML = `<div class="sr-empty">${esc(t("searchEmpty"))}</div>`;
      return;
    }
    showBox();
    box.innerHTML = hits
      .map(
        (h, i) =>
          `<button class="sr-item" data-i="${i}" role="option"><span class="sr-tag">${esc(
            h.typeLabel,
          )}</span><span>${esc(h.title)}</span></button>`,
      )
      .join("");
    box
      .querySelectorAll<HTMLElement>(".sr-item")
      .forEach((b) =>
        b.addEventListener("click", () => openHit(Number(b.dataset.i))),
      );
  };

  input.addEventListener("input", render);
  input.addEventListener("blur", () => setTimeout(() => closeBox(), 150));
  input.addEventListener("keydown", (e: KeyboardEvent) => {
    if (box.hidden || !hits.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(activeIdx + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(activeIdx - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      openHit(activeIdx >= 0 ? activeIdx : 0);
    } else if (e.key === "Escape") {
      closeBox();
    }
  });

  box.setAttribute("role", "listbox");
  const placeholder =
    input.getAttribute("placeholder") || t("searchPlaceholder");
  input.setAttribute("placeholder", placeholder);
}
