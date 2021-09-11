import { useMemo } from "react";
import { useTranslation, TFuncKey, Namespace } from "react-i18next";

export default function useTrans<T extends TFuncKey<Namespace>>(
  key: T,
  ns?: Namespace,
  returnObjects: boolean = true
) {
  const { t } = useTranslation(ns);
  const data = useMemo(() => {
    return t(key, { returnObjects });
  }, [t, key, returnObjects]);
  return data;
}
