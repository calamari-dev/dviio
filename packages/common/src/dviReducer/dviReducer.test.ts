import { produce, setAutoFreeze } from "immer";
import { x } from "xastscript";
import { toString } from "xast-util-to-string";
import { initialState } from "../../../base/src";
import { dviReducer } from "./dviReducer";

setAutoFreeze(false);

const page = x();
const baseState = {
  ...initialState,
  page,
  fonts: [
    {
      encoding: "OT1",
      scaleFactor: 655360,
      designSize: 655360,
      advanceWidths: { 0x06: 655360 },
    },
    {
      encoding: "OML",
      scaleFactor: 655360,
      designSize: 655360,
      advanceWidths: { 0x06: 655360 },
    },
    {
      encoding: "OMS",
      scaleFactor: 655360,
      designSize: 655360,
      advanceWidths: { 0x06: 655360 },
    },
  ],
  extension: {
    current: page,
    textMode: false,
  },
} as const;

describe("dviReducer", () => {
  it("SET (OT1 encoding)", () => {
    const state = produce(baseState, (draft) => {
      draft.register.f = 0;
      draft.page = x();
      draft.extension.current = draft.page;
    });

    const { page } = dviReducer({ name: "SET", codePoint: 0x06 }, state);
    expect(toString(page)).toBe("Σ");
  });

  it("SET (OML encoding)", () => {
    const state = produce(baseState, (draft) => {
      draft.register.f = 1;
      draft.page = x();
      draft.extension.current = draft.page;
    });

    const { page } = dviReducer({ name: "SET", codePoint: 0x06 }, state);
    expect(toString(page)).toBe("𝛴");
  });

  it("SET (OMS encoding)", () => {
    const state = produce(baseState, (draft) => {
      draft.register.f = 2;
      draft.page = x();
      draft.extension.current = draft.page;
    });

    const { page } = dviReducer({ name: "SET", codePoint: 0x06 }, state);
    expect(toString(page)).toBe("±");
  });
});
