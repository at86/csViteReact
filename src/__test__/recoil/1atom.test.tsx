import { render, fireEvent } from "@testing-library/react";
import { useRef } from "react";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";

test("recoil state change all rerender", () => {
  const aState = atom({
    key: "a",
    default: 0,
  });

  function App() {
    return (
      <RecoilRoot>
        <Child1 />
        <Child2 />
        <Child3 />
      </RecoilRoot>
    );
  }

  function Child1() {
    const [a, set_a] = useRecoilState(aState);
    console.log("Child1", a);

    return (
      <div id="Child1" onClick={() => set_a(a + 1)}>
        {a}
      </div>
    );
  }

  function Child2() {
    const r = useRef(0);
    console.log("Child2", r.current);

    r.current += 1;
    return <div id="Child2">ddd</div>;
  }

  function Child3() {
    const r = useRef(0);
    console.log("Child3", r.current);

    r.current += 1;
    return <div id="Child3">ddd</div>;
  }

  const el = render(<App />);
  fireEvent.click(el.container.querySelector("#Child1"));
});
