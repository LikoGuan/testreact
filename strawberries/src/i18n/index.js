import { addLocaleData } from "react-intl";
import enLocaleData from "react-intl/locale-data/en";
import zhLocaleData from "react-intl/locale-data/zh";
import zh from "./locales/zh";
import en from "./locales/en";

addLocaleData(enLocaleData);
addLocaleData(zhLocaleData);

export const messages = {
  zh,
  en
};

let [locale, ,] = navigator.language.split("-");

if (locale !== 'zh' && locale !== 'en') {
  locale = 'en'
}

export { locale };
