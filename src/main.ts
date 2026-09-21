import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';

import { initLang, applyStaticLang } from './core/i18n';
import { boot } from './core/app';

initLang();
applyStaticLang();
boot();
