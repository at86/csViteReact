import React, { useState, memo, useEffect, useMemo } from "react";

interface gBasic {
  stateMap: Record<string, Set<React.Dispatch<React.SetStateAction<any>>>>;
  value: Record<string, React.SetStateAction<any>>;
}

// interface gType extends gBasic, Record<string, any> {}
// export var gState: gType = {
// export var gState: gBasic & Record<GKey, GKeyValue> = {
export var gState: gBasic & Record<PropertyKey, any> = {
  stateMap: {},
  value: {},
};

// type GKey = Parameters<typeof useGState>[0];
// type GKeyValue = Parameters<typeof useGState>[1];

// @ts-ignore
window.gState = gState;

export function useGState<T>(
  key: string,
  v?: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [t, setT] = useState(v || (gState.value[key] as T));
  console.log("useGState()", t, v);
  //React.Dispatch<React.SetStateAction<T>>
  if (!gState.stateMap[key]) {
    gState.stateMap[key] = new Set();
  }

  const wrapSetT: React.Dispatch<React.SetStateAction<T>> = (v) => {
    gState.stateMap[key].forEach(
      (f: React.Dispatch<React.SetStateAction<T>>) => {
        gState.value[key] = v;
        f(v);
      }
    );
  };

  if (!gState.stateMap[key].has(setT)) {
    // when record state, record value, not fire other states with `key`.
    gState.value[key] = t;
    console.log("useGState()", t, "000");
    gState.stateMap[key].add(setT);

    if (gState[key] === undefined) {
      // Object.defineProperty(gState, key, {
      defineProperty(gState, key, {
        get: function (): T {
          return gState.value[key];
        },
        set: function (v: T) {
          gState.value[key] = v;
          gState.stateMap[key].forEach(
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
    // console.log(`gState.stateMap set of ${key}`, gState.stateMap[key].size);
    return () => {
      gState.stateMap[key].delete(setT);
      // console.log(`gState.stateMap delete of ${key}`, gState.stateMap[key].size);
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
//   defineProperty(gState, k, {
//     get: function (): string {
//       return gState.value[k];
//     },
//     set: function (v: string) {
//       gState.value[k] = v;
//     },
//     configurable: true,
//     //- true: object.keys can get
//     // enumerable: true,
//     //- descriptor has both [value or writable] and [get or set] keys, an exception is thrown.
//     // writable: true,
//   });
// }
// aa("b");
// gState.b;
