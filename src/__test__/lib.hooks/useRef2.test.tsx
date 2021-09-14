/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react";
import { useRef2, gState, useGState, useGRef } from "@/lib";
import { useState } from "react";

type RefNumber = (v?: number) => number;
test("useRef2", () => {
  var mountTimes = 0;
  function C() {
    mountTimes += 1;
    const r = useGRef("r", 0);
    if (mountTimes === 1) {
      expect(r()).toEqual(0);
    } else if (mountTimes === 2) {
      expect(r()).toEqual(2);
    } else if (mountTimes === 3) {
      expect(r()).toEqual(4);
    }
    r(r() + 1);
    return <div>c</div>;
  }
  function App() {
    const [st, setSt] = useState(0);

    return (
      <div
        onClick={() => {
          const r: RefNumber = useGRef("r");
          r(r() + 1);
          if (st < 3) {
            expect(r()).toEqual(clickIdx * 2 + 2);
          } else {
            expect(r()).toEqual(clickIdx + 4);
          }
          // console.log(clickIdx, r());
          setSt(st + 1);
        }}
      >
        {st < 3 ? <C /> : null}
      </div>
    );
  }
  const el = render(<App />);
  var clickIdx = 0;
  for (; clickIdx < 6; clickIdx++) {
    el.container.querySelector("div").click();
  }
});
