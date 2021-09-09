import React, { useState, memo, useEffect, useMemo } from "react";

interface gBasic {
  stateMap: Record<string, Set<React.Dispatch<React.SetStateAction<any>>>>;
  value: Record<string, React.SetStateAction<any>>;
}

// interface gType extends gBasic, Record<string, any> {}
// export var g: gType = {
// export var g: gBasic & Record<GKey, GKeyValue> = {
export var g: gBasic & Record<PropertyKey, any> = {
  stateMap: {},
  value: {},
};

// type GKey = Parameters<typeof useKey>[0];
// type GKeyValue = Parameters<typeof useKey>[1];

// @ts-ignore
window.g = g;

export function useKey<T>(
  key: string,
  v?: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [t, setT] = useState(v || (g.value[key] as T));
  //React.Dispatch<React.SetStateAction<T>>
  if (!g.stateMap[key]) {
    g.stateMap[key] = new Set();
  }

  const wrapSetT: React.Dispatch<React.SetStateAction<T>> = (v) => {
    g.stateMap[key].forEach((f: React.Dispatch<React.SetStateAction<T>>) => {
      g.value[key] = v;
      f(v);
    });
  };

  if (!g.stateMap[key].has(setT)) {
    // when record state, record value, not fire other states with `key`.
    g.value[key] = t;
    g.stateMap[key].add(setT);

    if (g[key] === undefined) {
      // Object.defineProperty(g, key, {
      defineProperty(g, key, {
        get: function (): T {
          return g.value[key];
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
        //- true: object.keys can get
        // enumerable: true,
        //- descriptor has both [value or writable] and [get or set] keys, an exception is thrown.
        // writable: true,
      });
    }
  }

  useEffect(() => {
    console.log(`g.stateMap set of ${key}`, g.stateMap[key].size);
    return () => {
      g.stateMap[key].delete(setT);
      console.log(`g.stateMap delete of ${key}`, g.stateMap[key].size);
    };
  }, [setT]);

  return [t, wrapSetT];
}

//https://fettblog.eu/typescript-assertion-signatures/
type InferValue<Prop extends PropertyKey, Desc> = Desc extends {
  get(): any;
  value: any;
}
  ? never
  : Desc extends { value: infer T }
  ? Record<Prop, T>
  : Desc extends { get(): infer T }
  ? Record<Prop, T>
  : never;

type DefineProperty<
  Prop extends PropertyKey,
  Desc extends PropertyDescriptor
> = Desc extends { writable: any; set(val: any): any }
  ? never
  : Desc extends { writable: any; get(): any }
  ? never
  : Desc extends { writable: false }
  ? Readonly<InferValue<Prop, Desc>>
  : Desc extends { writable: true }
  ? InferValue<Prop, Desc>
  : Readonly<InferValue<Prop, Desc>>;

function defineProperty<
  Obj extends object,
  Key extends PropertyKey,
  PDesc extends PropertyDescriptor
>(
  obj: Obj,
  prop: Key,
  val: PDesc
): asserts obj is Obj & DefineProperty<Key, PDesc> {
  Object.defineProperty(obj, prop, val);
}

// function aa(k: string) {
//   defineProperty(g, k, {
//     get: function (): string {
//       return g.value[k];
//     },
//     set: function (v: string) {
//       g.value[k] = v;
//     },
//     configurable: true,
//     //- true: object.keys can get
//     // enumerable: true,
//     //- descriptor has both [value or writable] and [get or set] keys, an exception is thrown.
//     // writable: true,
//   });
// }
// aa("b");
// g.b;
