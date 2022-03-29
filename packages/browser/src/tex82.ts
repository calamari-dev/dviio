import type { Root } from "xast";
import type { Preset } from "@dviio/base";
import { x } from "xastscript";
import { SvgExt, dviSvgReducer, buildSvg } from "@dviio/common";
import { parseDvi } from "./parseDvi";
import { FontLoader } from "./FontLoader";

const draft = x();

export const tex82: Preset<Blob, Root, string, SvgExt> = {
  initializer: { draft, extension: { current: draft, textMode: false } },
  parser: parseDvi,
  loaders: [FontLoader],
  reducer: dviSvgReducer,
  builder: buildSvg,
};
