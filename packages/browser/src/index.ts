import type { Root } from "xast";
import { x } from "xastscript";
import { toXml } from "xast-util-to-xml";
import { DviInstruction, Preset } from "@dviio/base";
import { CommonExt, dviReducer } from "@dviio/common";
import { parseDvi } from "./parseDvi";
import { FontLoader } from "./FontLoader";

export { dviio } from "@dviio/base";

export const tex82: Preset<Blob, Root, string, DviInstruction, CommonExt> = {
  initializer: () => {
    const draft = x();
    return { draft, extension: { current: draft, textMode: false } };
  },
  parser: parseDvi,
  loaders: [FontLoader],
  reducer: dviReducer,
  builder: toXml,
};
