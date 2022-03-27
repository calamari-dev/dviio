import { FileHandle } from "fs/promises";
import { Root } from "xast";
import { x } from "xastscript";
import { Preset } from "@dviio/base";
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
