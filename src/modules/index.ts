import type { ListModule } from '../core/types';
import { concepts } from './concepts';
import { glossary } from './glossary';
import { psychologists } from './psychologists';
import { schools } from './schools';

export const listModules: ListModule[] = [concepts, glossary, psychologists, schools];

export const moduleById: Record<string, ListModule> = Object.fromEntries(
  listModules.map((m) => [m.id, m]),
);
