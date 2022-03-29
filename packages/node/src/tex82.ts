import type { FileHandle } from "fs/promises";
import type { Root } from "xast";
import type { Preset } from "@dviio/base";
import { x } from "xastscript";
import { SvgExt, dviSvgReducer, buildSvg } from "@dviio/common";
import { parseDvi } from "./parseDvi";
import { TfmLoader } from "./TfmLoader";

const draft = x();

export const tex82: Preset<FileHandle, Root, string, SvgExt> = {
  initializer: { draft, extension: { current: draft, textMode: false } },
  parser: parseDvi,
  loaders: [TfmLoader],
  reducer: dviSvgReducer,
  builder: buildSvg,
};
