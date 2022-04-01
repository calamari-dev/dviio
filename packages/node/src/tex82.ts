import type { FileHandle } from "fs/promises";
import type { Preset } from "@dviio/base";
import { x } from "xastscript";
import { SvgDraft, SvgExt, dviSvgReducer, buildSvg } from "@dviio/common";
import { parseDvi } from "./parseDvi";

const draft = x();

export const tex82: Preset<FileHandle, SvgDraft, string, SvgExt> = {
  initializer: { draft, extension: { current: draft, textMode: false } },
  parser: parseDvi,
  reducer: dviSvgReducer,
  builder: buildSvg,
};
