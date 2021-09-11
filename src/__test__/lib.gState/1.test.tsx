/**
 * @jest-environment jsdom
 */
import { useEffect, memo, useRef } from "react";

import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { g, useKey } from "@/lib/gState";
import { sleep } from "@/lib";

test("access_by_g", async () => {
  function C1() {
    useKey("a", "c1");
    const mountTimes = useRef(0);
    mountTimes.current += 1;

    if (mountTimes.current === 1) {
      expect(g.a).toEqual("c1");
    } else if (mountTimes.current === 2) {
      expect(g.a).toEqual(3);
    }

    return <div>c1</div>;
  }

  function App({ expect }: { expect: jest.Expect }) {
    const mountTimes = useRef(0);
    mountTimes.current += 1;

    useKey("a", 2);
    if (mountTimes.current === 1) {
      expect(g.a).toEqual(2);
    } else if (mountTimes.current === 2) {
      expect(g.a).toEqual(3);
    }

    return (
      <div
        onClick={() => {
          g.a = 3;
        }}
      >
        22222
        <C1 />
      </div>
    );
  }

  const el = render(<App expect={expect} />);
  el.container.querySelector("div").click();
  // console.log(el.container.querySelector("div").innerHTML)
  await sleep(400);
  el.unmount();
});
