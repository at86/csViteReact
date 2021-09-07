import React, { useState, memo, useEffect, useMemo } from "react";
import { useKey, g } from "@/lib/gState";

function Abc() {
  useKey("a", { k: 1 });
  return (
    <div>
      <div>a:{JSON.stringify(g.a)}</div>
      <div>
        g.b:{g.b}; Date: {Date.now()}
      </div>
      <button onClick={() => (g.a = { ...g.a, random: Math.random() })}>set g.a</button>
      <button onClick={() => (g.a.random = Math.random())}>set g.a.random</button>
      <button onClick={() => (g.b = Date.now())}>set g.b</button>
    </div>
  );
}

const AbcMemo = memo(Abc);

export default function App() {
  useKey("a", { k: 1 });
  useKey("b", 22);

  const [a, set_a] = useState(true);
  const [b, set_b] = useState(true);

  return (
    <div className="App">
      <div>a:{JSON.stringify(g.a)}</div>
      <div>
        b:{g.b}; Date: {Date.now()}
      </div>
      <button onClick={() => (g.a = { ...g.a, random: Math.random() })}>setA</button>
      <button onClick={() => (g.b = Date.now())}>setB</button>
      <button onClick={() => set_a(!a)}>toggle Abc</button>
      <button onClick={() => set_b(!b)}>toggle AbcMemo</button>
      {a ? (
        <>
          <h2>Abc</h2>
          <Abc />
        </>
      ) : null}
      {b ? (
        <>
          <h2>AbcMemo</h2>
          <AbcMemo />
        </>
      ) : null}
    </div>
  );
}
