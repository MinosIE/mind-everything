export function esc(s: unknown): string {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function el<T extends HTMLElement = HTMLElement>(
  sel: string,
  root: ParentNode = document,
): T | null {
  return root.querySelector<T>(sel);
}
