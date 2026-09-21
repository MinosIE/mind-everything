import type { LObj } from './types';

interface RegEntry {
  moduleId: string;
  item: LObj;
  typeLabelKey: string;
}

const byId = new Map<string, RegEntry>();
const moduleType = new Map<string, string>();

export function registerModuleType(moduleId: string, typeLabelKey: string): void {
  moduleType.set(moduleId, typeLabelKey);
}

export function registerItem(id: string, moduleId: string, item: LObj): void {
  if (!id) return;
  byId.set(id, {
    moduleId,
    item,
    typeLabelKey: moduleType.get(moduleId) || 'search.t.topic',
  });
}

export function getItem(id: string): RegEntry | undefined {
  return byId.get(id);
}

export function allItems(): Map<string, RegEntry> {
  return byId;
}
