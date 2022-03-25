import type { FileHandle } from "fs/promises";
import type { Root } from "xast";
import { x } from "xastscript";
import { createState, DviInstruction, Preset } from "@dviio/base";
import {
  SvgExt,
  YamlExt,
  dviSvgReducer,
  dviYamlReducer,
  YamlDraft,
  buildSvg,
  buildYaml,
} from "@dviio/common";
import { parseDvi } from "./parseDvi";
import { TfmLoader } from "./TfmLoader";

export const tex82: Preset<FileHandle, Root, string, DviInstruction, SvgExt> = {
  initializer: () => {
    const draft = x();
    return { draft, extension: { current: draft, textMode: false } };
  },
  parser: parseDvi,
  loaders: [TfmLoader],
  reducer: dviSvgReducer,
  builder: buildSvg,
};

export const yaml: Preset<
  FileHandle,
  YamlDraft,
  string,
  DviInstruction,
  YamlExt
> = {
  initializer: () => {
    const document: YamlDraft["document"] = [];
    const { numer, denom, mag } = createState({ draft: 0, extension: 0 });

    return {
      draft: {
        preamble: { version: 2, comment: "", numer, denom, mag },
        postamble: { maxHeight: 0, maxWidth: 0, stackDepth: 1, totalPages: 1 },
        document,
      },
      extension: { parents: [document] },
    };
  },
  parser: parseDvi,
  reducer: dviYamlReducer,
  builder: buildYaml,
};
