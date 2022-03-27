import { FileHandle } from "fs/promises";
import { createState, dviio, Preset } from "@dviio/base";
import { YamlExt, dviYamlReducer, YamlDraft, buildYaml } from "@dviio/common";
import { parseDvi } from "./parseDvi";

const document: YamlDraft["document"] = [];
const { numer, denom, mag } = createState({ draft: 0, extension: 0 });

export const yaml: Preset<FileHandle, YamlDraft, string, YamlExt> = {
  initializer: {
    draft: {
      preamble: { version: 2, comment: "", numer, denom, mag },
      postamble: { maxHeight: 0, maxWidth: 0, stackDepth: 1, totalPages: 1 },
      document,
    },
    extension: { parents: [document] },
  },
  parser: parseDvi,
  reducer: dviYamlReducer,
  builder: buildYaml,
};

const c = dviio(yaml);
