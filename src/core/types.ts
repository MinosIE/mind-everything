export type Lang = 'zh' | 'en';

export interface LObj {
  [k: string]: any;
}

export type LangFn = (o: LObj | null | undefined, key: string) => any;

export interface CardView {
  title: string;
  sub?: string;
  one?: string;
  plain?: string;
  tags?: string[];
  level?: number | string;
}

export interface DetailSection {
  labelKey: string;
  html: string;
}

export interface RefSource {
  label: string;
  year?: number;
  url?: string;
}

export interface ModuleDetail {
  title: string;
  sub?: string;
  sections: DetailSection[];
  relatedIds?: string[];
  sources?: RefSource[];
}

export interface DetailView {
  title: string;
  sub?: string;
  sections: DetailSection[];
  related?: { id: string; title: string }[];
  sources?: RefSource[];
}

export interface ListModule {
  id: string;
  file: string;
  titleKey: string;
  subKey: string;
  mode?: 'grid' | 'list' | 'timeline';
  filters?: { field: string; labelKey: string }[];
  inlineSearch?: string;
  card: (it: LObj, L: LangFn) => CardView;
  detail: (it: LObj, L: LangFn) => ModuleDetail;
}
