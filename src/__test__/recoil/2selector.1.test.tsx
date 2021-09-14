import { useRef2 } from "@/lib";
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
    key: "aState",
    default: 0,
  });
  const aSelector = selector({
    key: "aSelector",
    get: ({ get }) => get(aState) * 100,
  });

  function App() {
    return (
      <RecoilRoot>
        <Child1 />
      </RecoilRoot>
    );
  }

  function Child1() {
    const [a, set_a] = useRecoilState(aState);
    const aSel = useRecoilValue(aSelector);
    if (a === 0) {
      console.log(expect(0).toEqual(aSel));
    } else if (a === 1) {
      console.log(expect(100).toEqual(aSel));
    }

    return <div id="Child1" onClick={() => set_a(a + 1)}></div>;
  }

  const el = render(<App />);
  fireEvent.click(el.container.querySelector("#Child1"));
});
