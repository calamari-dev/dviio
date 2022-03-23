import { produce, setAutoFreeze } from "immer";
import { x } from "xastscript";
import { toString } from "xast-util-to-string";
import { createState } from "@dviio/base";
import { dviReducer } from "./dviReducer";

setAutoFreeze(false);

const draft = x();
const baseState = {
  ...createState({
    draft,
    extension: {
      current: draft,
      textMode: false,
    },
  }),
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
} as const;

describe("dviReducer", () => {
  it("SET (OT1 encoding)", () => {
    const state = produce(baseState, (draft) => {
      draft.register.f = 0;
      draft.draft = x();
      draft.extension.current = draft.draft;
    });

    const { draft } = dviReducer({ name: "SET", codePoint: 0x06 }, state);
    expect(toString(draft)).toBe("Σ");
  });

  it("SET (OML encoding)", () => {
    const state = produce(baseState, (draft) => {
      draft.register.f = 1;
      draft.draft = x();
      draft.extension.current = draft.draft;
    });

    const { draft } = dviReducer({ name: "SET", codePoint: 0x06 }, state);
    expect(toString(draft)).toBe("𝛴");
  });

  it("SET (OMS encoding)", () => {
    const state = produce(baseState, (draft) => {
      draft.register.f = 2;
      draft.draft = x();
      draft.extension.current = draft.draft;
    });

    const { draft } = dviReducer({ name: "SET", codePoint: 0x06 }, state);
    expect(toString(draft)).toBe("±");
  });
});
