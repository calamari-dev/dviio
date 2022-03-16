import type { Root } from "xast";
import { x } from "xastscript";
import { toXml } from "xast-util-to-xml";
import type { DviInstruction, Mode } from "../../base/src";
import { CommonExt, dviReducer } from "../../common/src";
import { parseDvi } from "./parseDvi";
import { FontLoader } from "./FontLoader";

export { dviio } from "../../base/src";

export const tex82: Mode<Blob, Root, string, DviInstruction, CommonExt> = {
  initializer: () => {
    const page = x();
    return { page, extension: { current: page, textMode: false } };
  },
  parser: parseDvi,
  loader: FontLoader,
  reducer: dviReducer,
  builder: toXml,
};
