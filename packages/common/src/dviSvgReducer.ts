import type { Element, Root } from "xast";
import type { DviInstruction, Reducer } from "@dviio/base";
import { x } from "xastscript";
import { toEcmaScriptString } from "./encoding";

export type SvgExt = {
  current: Root | Element;
  textMode: boolean;
};

export const dviSvgReducer: Reducer<Root, DviInstruction, SvgExt> = (
  inst,
  state
) => {
  switch (inst.name) {
    case "SET":
    case "PUT": {
      const { register, fonts, extension } = state;
      const { codePoint } = inst;
      const font = fonts[register.f];

      if (!font) {
        throw new Error(`Font ${register.f} is unknown.`);
      }

      const { encoding } = font;
      const width = font.advanceWidths[codePoint];

      if (!(encoding && isSupportedEncoding(encoding))) {
        throw new Error(`The encoding of font ${register.f} is not supported.`);
      }

      if (width === undefined) {
        throw new Error(
          `The glyph (codepoint=${codePoint}) in font ${register.f} doesn't have advance width information.`
        );
      }

      const text = toEcmaScriptString(codePoint, encoding);

      if (text === undefined) {
        throw new Error(
          `${codePoint} is an invalid codepoint in ${encoding} encoding.`
        );
      }

      const unit = (state.numer / state.denom) * 1e-4;
      extension.current.children.push(
        x(
          "text",
          { x: `${register.h * unit}mm`, y: `${register.v * unit}mm` },
          text
        )
      );

      if (inst.name === "SET") {
        register.h += width;
      }

      return state;
    }

    case "SET_RULE":
    case "PUT_RULE": {
      const { register, extension } = state;
      const { width, height } = inst;
      const unit = (state.numer / state.denom) * 1e-4;

      extension.current.children.push(
        x("rect", {
          x: `${register.h * unit}mm`,
          y: `${(register.v - height) * unit}mm`,
          width: `${width * unit}mm`,
          height: `${height * unit}mm`,
        })
      );

      if (inst.name === "SET_RULE") {
        register.h += width;
      }

      return state;
    }

    case "PUSH": {
      const { stack, register } = state;
      stack.push({ ...register });
      return state;
    }

    case "POP": {
      state.stack.pop();
      return state;
    }

    case "RIGHT": {
      state.register.h += inst.movement;
      return state;
    }
  }

  return state;
};

const supportedEncoding = ["OT1", "OML", "OMS", "OMX"];

const isSupportedEncoding = (x: string): x is "OT1" | "OML" | "OMS" | "OMX" => {
  return supportedEncoding.includes(x);
};
