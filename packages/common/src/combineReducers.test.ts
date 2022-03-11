import { assert } from "chai";
import type { Instruction, Reducer, State } from "./types";
import { combineReducers } from "./combineReducers";
import { initialState } from "./constants";

const createState = (x: number, y: string) => {
  const state: State<null, { x: number; y: string }> = {
    ...initialState,
    page: null,
    extension: { x, y },
  };

  return state;
};

const a: Reducer<null, Instruction, number> = (_, state) => {
  return { ...state, extension: state.extension + 1 };
};

const b: Reducer<null, Instruction, string> = (_, state) => {
  return { ...state, extension: state.extension + "b" };
};

it("combineReducers", () => {
  assert.deepEqual(
    combineReducers({ x: a, y: b })({ name: "NOP" }, createState(0, "a")),
    createState(1, "ab")
  );
});
