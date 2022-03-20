import type { Root } from "xast";
import type { DviInstruction, Reducer } from "../../../base/src";
import type { CommonExt } from "../types";
import { x } from "xastscript";
import { toEcmaScriptString } from "./encoding";

/**
 * 現在の State と DVI 命令から新たな State を計算する．
 */
export const dviReducer: Reducer<Root, DviInstruction, CommonExt> = (
  inst,
  state
) => {
  const { register, stack, fonts, extension } = state;

  switch (inst.name) {
    case "SET": {
      const { codePoint } = inst;
      const font = fonts[register.f];

      if (!font) {
        throw new Error("");
      }

      const { encoding } = font;
      const width = font.metrics[codePoint];

      if (!(encoding && isSupportedEncoding(encoding))) {
        throw new Error("");
      }

      if (width === undefined) {
        throw new Error("");
      }

      const str = toEcmaScriptString(codePoint, encoding);

      if (str === undefined) {
        throw new Error("");
      }

      extension.current.children.push(
        x("text", { x: register.h, y: register.v }, str)
      );

      register.h += width;
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

const isSupportedEncoding = (x: string): x is "OT1" | "OML" | "OMS" | "OMX" => {
  return ["OT1", "OML", "OMS", "OMX"].includes(x);
};
