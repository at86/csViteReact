/**
 * @jest-environment jsdom
 */
import { useEffect, memo } from "react";
import { gState, useGState } from "@/lib/hooks/gState";
import { sleep, useRef2 } from "@/lib";

import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

var ex: jest.Expect;
test(
  "C1 memo",
  async () => {
    type Val = { f: string; v: string };
    function C1() {
      const [st, setSt] = useGState<Val>("a");
      const r = useRef2(0);
      if (r() === 0) {
        expect(st.f).toEqual("App");
      } else if (r() === 1) {
        expect(st.v).toEqual("22");
      }
      return (
        <div>
          {JSON.stringify(gState.a)}
          c1
        </div>
      );
    }
    const C1M = memo(C1);
    function App() {
      const [st, setSt] = useGState<Val>("a", { f: "App", v: "App 1" });

      return (
        <div onClick={() => setSt({ ...st, v: "22" })}>
          {JSON.stringify(gState.a)}
          <C1M />
        </div>
      );
    }
    const el = render(<App />);

    el.container.querySelector("div").click();

    // await sleep(600);

    // - Warning: An update to App inside a test was not wrapped in act(...).
    // - When testing, code that causes React state updates should be wrapped into act(...):
    // g.a = { f: "App", v: 3 };
  },
  2 * 1000
);
