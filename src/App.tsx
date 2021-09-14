import React, { useState, memo, useEffect, useMemo } from "react";
import { useGState, gState } from "@/lib/hooks/gState";

function Abc() {
  console.log("Abc Redraw");
  const [ga, setGa] = useGState("a");
  return (
    <div>
      <div>a:{JSON.stringify(ga)}</div>
      <div>
        g.b:{gState.b}; Date: {Date.now()}
      </div>
      <button onClick={() => setGa({ ...gState.a, yyyyy: Math.random() })}>
        set g.a
      </button>
      <button onClick={() => (gState.a.random = Math.random())}>
        set g.a.random
      </button>
    </div>
  );
}

const AbcMemo = memo(Abc);

export default function App() {
  console.log("App Redraw");
  const [ga, setGa] = useGState("a", { k: 1 });
  const [gb, setGb] = useGState("b", 22);
  const [a, set_a] = useState(true);
  const [b, set_b] = useState(true);

  return (
    <div className="App">
      <div>a:{JSON.stringify(ga)}</div>
      <div>
        b:{gb}; Date: {Date.now()}
      </div>
      <button onClick={() => setGa({ ...gState.a, random: Math.random() })}>
        setA
      </button>
      <button onClick={() => setGb(Date.now())}>setB</button>
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
