import { createI18n } from 'vue-i18n';
import vi from './vi-VN';

export const LOCALE_OPTIONS = [
  { label: 'Tiếng Việt', value: 'vi-VN' },
];
const defaultLocale = localStorage.getItem('arco-locale') || 'vi-VN';

const i18n = createI18n({
  locale: defaultLocale,
  fallbackLocale: 'vi-VN',
  legacy: false,
  allowComposition: true,
  messages: {
    'vi-VN': vi,
  },
});

export default i18n;
