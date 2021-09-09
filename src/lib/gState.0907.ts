import React, { useState, memo, useEffect, useMemo } from "react";

export var g: Record<string, any> = {
  stateMap: {},
  value: {},
};

export function useKey<T>(key: string, v?: T) {
  const st = useState(v || (g.value[key] as T));

  if (!g.stateMap[key]) {
    g.stateMap[key] = new Set();
  }

  if (!g.stateMap[key].has(st[1])) {
    // when record state, record value, not fire other states with `key`.
    g.value[key] = st[0];
    g.stateMap[key].add(st[1]);

    if (g[key] === undefined) {
      Object.defineProperty(g, key, {
        get: function () {
          return g.value[key] as T;
        },
        set: function (v: T) {
          g.value[key] = v;
          g.stateMap[key].forEach(
            (f: React.Dispatch<React.SetStateAction<T>>) => {
              f(v);
            }
          );
        },
        configurable: true,
      });
    }
  }

  useEffect(() => {
    return () => {
      g.stateMap[key].delete(st[1]);
    };
  }, [st[1]]);

  return st;
}
