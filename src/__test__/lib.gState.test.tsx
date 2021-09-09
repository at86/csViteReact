/**
 * @jest-environment jsdom
 */
import { useEffect, memo } from "react";
import ReactDOM from "react-dom";
import { g, useKey } from "@/lib/gState";
import { sleep } from "@/lib";

test(
  "abc",
  async () => {
    function C1() {
      useKey("a", "c1");
      useEffect(() => {
        console.log("C1 useEffect", g.a);
      }, [g.a]);
      return <div>c1</div>;
    }
    function App({ expect }: { expect: jest.Expect }) {
      useKey("a", 2);
      console.log("App", g.a);

      useEffect(() => {
        console.log("App useEffect", g.a);

        // - after line will redraw, like setState(g.a)
        g.a = 3;
      }, [g.a]); //, ...Array.from(g.stateMap.a)

      return (
        <div>
          <C1 />
        </div>
      );
    }
    const div = document.createElement("div");
    ReactDOM.render(<App expect={expect} />, div);
    await sleep(400);
    ReactDOM.unmountComponentAtNode(div);
    await sleep(600);
  },
  2 * 1000
);

test(
  "C1 memo",
  async () => {
    function C1() {
      useKey("a");

      if (g.a.f === "App") {
        console.log("C1M", g.a.v);
        expect("App 1").toEqual(g.a.v);
      } else if (g.a.f === "App2") {
        console.log("C1M", g.a.v);
        expect(3).toEqual(g.a.v);
      }

      return (
        <div>
          {JSON.stringify(g.a)}
          c1
        </div>
      );
    }
    const C1M = memo(C1);
    function App({ expect }: { expect: jest.Expect }) {
      const [st, setSt] = useKey("a", { f: "App", v: "App 1" });

      useEffect(() => {
        console.log("--- App begin set g.a");
        g.a = { f: "App2", v: 3 };
      }, [setSt]);

      if (g.a.f === "App") {
        console.log("App", g.a.v);
        expect("App 1").toEqual(g.a.v);
      } else if (g.a.f === "App2") {
        console.log("App", g.a.v);
        expect(3).toEqual(g.a.v);
      }

      return (
        <div>
          {JSON.stringify(g.a)}
          <C1M />
        </div>
      );
    }
    const div = document.createElement("div");
    ReactDOM.render(<App expect={expect} />, div);
    await sleep(600);

    // - Warning: An update to App inside a test was not wrapped in act(...).
    // - When testing, code that causes React state updates should be wrapped into act(...):
    // g.a = { f: "App", v: 3 };

    ReactDOM.unmountComponentAtNode(div);
    await sleep(600);
  },
  2 * 1000
);
