import type { Root } from "xast";
import { x } from "xastscript";
import { toXml } from "xast-util-to-xml";
import { Mode, dviReducer } from "../../common/src";
import { parseDvi } from "./parseDvi";
import { FontLoader } from "./FontLoader";

export { dviRenderer } from "../../common/src";

export const TeX82: Mode<Blob, Root, string> = {
  initializer: () => ({ extension: {}, page: x() }),
  parser: parseDvi,
  loader: FontLoader,
  reducer: dviReducer,
  builder: toXml,
};
