import type { ListModule } from '../core/types';
import { concepts } from './concepts';
import { glossary } from './glossary';
import { psychologists } from './psychologists';
import { schools } from './schools';
import { biases } from './biases';
import { experiments } from './experiments';
import { everyday } from './everyday';
import { myths } from './myths';
import { compare } from './compare';
import { timeline } from './timeline';
import { quiz } from './quiz';

export const listModules: ListModule[] = [
  concepts,
  glossary,
  psychologists,
  schools,
  biases,
  experiments,
  everyday,
  myths,
  compare,
  timeline,
  quiz,
];

export const moduleById: Record<string, ListModule> = Object.fromEntries(
  listModules.map((m) => [m.id, m]),
);
