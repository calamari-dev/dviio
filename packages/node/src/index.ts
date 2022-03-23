import type { FileHandle } from "fs/promises";
import type { Root } from "xast";
import type { DviInstruction, Preset } from "@dviio/base";
import { x } from "xastscript";
import { toXml } from "xast-util-to-xml";
import { SvgExt, YamlExt, dviSvgReducer, dviYamlReducer } from "@dviio/common";
import { parseDvi } from "./parseDvi";
import { TfmLoader } from "./TfmLoader/TfmLoader";

export const tex82: Preset<FileHandle, Root, string, DviInstruction, SvgExt> = {
  initializer: () => {
    const draft = x();
    return { draft, extension: { current: draft, textMode: false } };
  },
  parser: parseDvi,
  loaders: [TfmLoader],
  reducer: dviSvgReducer,
  builder: toXml,
};

export const yaml: Preset<FileHandle, string, string, DviInstruction, YamlExt> =
  {
    initializer: () => ({ draft: "", extension: { level: 0 } }),
    parser: parseDvi,
    reducer: dviYamlReducer,
    builder: (x: string) => x,
  };
