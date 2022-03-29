import type { FileHandle } from "fs/promises";
import { Preset, createState } from "@dviio/base";
import { DumpDraft, dviDumpReducer, buildYaml } from "@dviio/common";
import { parseDvi } from "./parseDvi";

const { numer, denom, mag } = createState({ draft: 0, extension: 0 });

export const yaml: Preset<FileHandle, DumpDraft, string> = {
  initializer: {
    draft: {
      preamble: { version: 2, comment: "", numer, denom, mag },
      postamble: { version: 2, maxHeight: 0, maxWidth: 0 },
      fonts: {},
      document: [],
    },
    extension: null,
  },
  parser: parseDvi,
  reducer: dviDumpReducer,
  builder: buildYaml,
};
