import { useRef, useCallback } from "react";

export default function useRef2<T>(v: T) {
  const r = useRef(v);
  return useCallback(
    (v?: T) => {
      if (v === undefined) {
        return r.current;
      } else {
        r.current = v;
      }
    },
    [r]
  );
}
