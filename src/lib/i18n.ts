import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as loadMore from "@/comp/LoadMore/i18n";

const cn = {
  translation: {
    hello: "你好",
    loadMore: loadMore.cn,
  },
};

const en = {
  translation: {
    hell: "Hello",
    loadMore: loadMore.en,
  },
};

export const initI18n = () => {
  i18n.use(initReactI18next).init({
    // 语言码 统一使用 i18n 标准语言定义
    resources: {
      "zh-CN": cn,
      "en-US": en,
    },
    lng: "zh-CN",
    fallbackLng: "zh-CN",
    // ns,
    defaultNS: "translation",
  });
};
initI18n();
export default i18n;
