import type { Root } from "xast";
import type { Reducer } from "./types";

/**
 * 現在の State と DVI 命令から新たな State を計算する．
 */
export const dviReducer: Reducer<Root> = (inst, state) => {
  const { register, stack } = state;

  switch (inst.name) {
    case "PUSH": {
      stack.push({ ...register });
      return state;
    }

    case "POP": {
      stack.pop();
      return state;
    }

    case "RIGHT": {
      register.h += inst.movement;
      return state;
    }
  }

  return state;
};
