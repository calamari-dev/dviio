import type { Root } from "xast";
import { x } from "xastscript";
import { toXml } from "xast-util-to-xml";
import { DviInstruction, Preset } from "@dviio/base";
import { SvgExt, dviSvgReducer } from "@dviio/common";
import { parseDvi } from "./parseDvi";
import { FontLoader } from "./FontLoader";

export { dviio } from "@dviio/base";

export const tex82: Preset<Blob, Root, string, DviInstruction, SvgExt> = {
  initializer: () => {
    const draft = x();
    return { draft, extension: { current: draft, textMode: false } };
  },
  parser: parseDvi,
  loaders: [FontLoader],
  reducer: dviSvgReducer,
  builder: toXml,
};
