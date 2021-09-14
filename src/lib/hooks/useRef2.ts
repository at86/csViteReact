import { useRef, useCallback } from "react";

/** return same ref instance in Component */
export function useRef2<T>(v: T) {
  const r = useRef(v);
  // const a = Date.now();
  return useCallback(
    (v?: T) => {
      // console.log("---- useRef2.ts", a);
      if (v === undefined) {
        return r.current;
      } else {
        r.current = v;
      }
    },
    [r]
  );
}

var gRef = {};
export function useGRef<T>(key: string, v?: T) {
  if (v !== undefined) {
    gRef[key] = useRef2(v);
  }
  return gRef[key];
}

// export function useGRef
