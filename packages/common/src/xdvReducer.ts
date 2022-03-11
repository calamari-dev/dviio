import type { Root } from "xast";
import type { Reducer, XdvOnlyInstruction } from "./types";
import { dviReducer } from "./dviReducer";

/**
 * 現在の State と XDV 命令から新たな State を計算する．
 */
export const xdvReducer: Reducer<Root, XdvOnlyInstruction, "hoge"> = (
  inst,
  state
) => {
  const { register, stack, extension } = state;

  switch (inst.name) {
    case "DEFINE_NATIVE_FONT": {
      return state;
    }

    case "SET_GLYPHS": {
      return state;
    }

    case "SET_TEXT_AND_GLYPHS": {
      return state;
    }
  }

  Object.assign(state, dviReducer(inst, state));
  return state;
};
