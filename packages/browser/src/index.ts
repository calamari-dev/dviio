import type { Root } from "xast";
import { x } from "xastscript";
import { Preset } from "@dviio/base";
import { SvgExt, dviSvgReducer, buildSvg } from "@dviio/common";
import { parseDvi } from "./parseDvi";
import { FontLoader } from "./FontLoader";

export { dviio } from "@dviio/base";

export const tex82: Preset<Blob, Root, string, SvgExt> = {
  initializer: () => {
    const draft = x();
    return { draft, extension: { current: draft, textMode: false } };
  },
  parser: parseDvi,
  loaders: [FontLoader],
  reducer: dviSvgReducer,
  builder: buildSvg,
};
