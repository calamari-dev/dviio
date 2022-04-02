import type { Preset } from "@dviio/base";
import { x } from "xastscript";
import { SvgDraft, SvgExt, dviSvgReducer, buildSvg } from "@dviio/common";
import { DviParser } from "./DviParser";

const draft = x();

export const tex82: Preset<string, SvgDraft, string, SvgExt> = {
  initializer: { draft, extension: { current: draft, textMode: false } },
  parser: DviParser,
  reducer: dviSvgReducer,
  builder: buildSvg,
};
