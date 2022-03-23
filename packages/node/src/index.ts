import type { FileHandle } from "fs/promises";
import type { Root } from "xast";
import type { DviInstruction, Preset } from "@dviio/base";
import { x } from "xastscript";
import { toXml } from "xast-util-to-xml";
import { CommonExt, dviReducer } from "@dviio/common";
import { parseDvi } from "./parseDvi";
import { TfmLoader } from "./TfmLoader/TfmLoader";

export const tex82: Preset<
  FileHandle,
  Root,
  string,
  DviInstruction,
  CommonExt
> = {
  initializer: () => {
    const draft = x();
    return { draft, extension: { current: draft, textMode: false } };
  },
  parser: parseDvi,
  loaders: [TfmLoader],
  reducer: dviReducer,
  builder: toXml,
};
