export const BASE = import.meta.env.BASE_URL;

export async function loadJson<T = any>(file: string): Promise<T> {
  const res = await fetch(BASE + 'data/' + file);
  if (!res.ok) throw new Error('load ' + file + ' -> ' + res.status);
  return (await res.json()) as T;
}
