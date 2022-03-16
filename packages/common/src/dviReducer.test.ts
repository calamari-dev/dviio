import { assert } from "chai";
import { produce } from "immer";
import { x } from "xastscript";
import { toString } from "xast-util-to-string";
import { initialState } from "../../base/src";
import { dviReducer } from "./dviReducer";

const page = x();
const baseState = {
  ...initialState,
  page,
  fonts: [
    {
      encoding: "OT1",
      scaleFactor: 655360,
      designSize: 655360,
      metrics: { 0x00: 655360 },
    },
    {
      encoding: "OML",
      scaleFactor: 655360,
      designSize: 655360,
      metrics: { 0x00: 655360 },
    },
    {
      encoding: "OMS",
      scaleFactor: 655360,
      designSize: 655360,
      metrics: { 0x00: 655360 },
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
    });

    const { page } = dviReducer({ name: "SET", codePoint: 0x06 }, state);
    assert.equal(toString(page), "Σ");
  });

  it("SET (OML encoding)", () => {
    const state = produce(baseState, (draft) => {
      draft.register.f = 1;
    });

    const { page } = dviReducer({ name: "SET", codePoint: 0x06 }, state);
    assert.equal(toString(page), "𝛴");
  });

  it("SET (OMS encoding)", () => {
    const state = produce(baseState, (draft) => {
      draft.register.f = 2;
    });

    const { page } = dviReducer({ name: "SET", codePoint: 0x06 }, state);
    assert.equal(toString(page), "±");
  });
});
