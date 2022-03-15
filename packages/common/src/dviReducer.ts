import type { Element, Root } from "xast";
import type { DviInstruction, Reducer } from "./types";
import { toEcmaScriptString } from "./encoding";

type Ext = {
  current: Element;
  textMode: boolean;
};

/**
 * 現在の State と DVI 命令から新たな State を計算する．
 */
export const dviReducer: Reducer<Root, DviInstruction, Ext> = (inst, state) => {
  const { register, stack, fonts } = state;

  switch (inst.name) {
    case "SET": {
      const font = fonts[register.f];

      if (!font) {
        throw new Error("");
      }

      return state;
    }

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
