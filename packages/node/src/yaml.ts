import { Preset, createState } from "@dviio/base";
import { DumpDraft, dviDumpReducer, buildYaml } from "@dviio/common";
import { DviParser } from "./DviParser";

const { numer, denom, mag } = createState({ draft: 0, extension: 0 });

export const yaml: Preset<string, DumpDraft, string> = {
  initializer: {
    draft: {
      preamble: { version: 2, comment: "", numer, denom, mag },
      postamble: { version: 2, maxHeight: 0, maxWidth: 0 },
      fonts: {},
      document: [],
    },
    extension: null,
  },
  parser: DviParser,
  reducer: dviDumpReducer,
  builder: buildYaml,
};
