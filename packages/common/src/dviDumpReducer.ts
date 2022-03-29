import type { Reducer } from "@dviio/base";
import { DumpDraft } from "./types";

export const dviDumpReducer: Reducer<DumpDraft> = (inst, state) => {
  switch (inst.name) {
    case "PRE": {
      const { preamble } = state.draft;
      preamble.version = inst.version;
      preamble.numer = inst.numer;
      preamble.denom = inst.denom;
      preamble.mag = inst.mag;
      preamble.comment = inst.comment;
      return state;
    }

    case "POST": {
      const { postamble } = state.draft;
      postamble.maxHeight = inst.maxHeight;
      postamble.maxWidth = inst.maxWidth;
      return state;
    }

    case "POST_POST": {
      const { postamble } = state.draft;
      postamble.version = inst.version;
      return state;
    }

    case "BOP": {
      state.draft.document.push({ name: "BOP", count: inst.count });
      return state;
    }

    case "FNT_DEF": {
      state.draft.fonts[inst.fontIndex] = {
        checksum: inst.checksum,
        scaleFactor: inst.scaleFactor,
        designSize: inst.designSize,
        directory: inst.directory,
        filename: inst.filename,
      };

      return state;
    }

    default: {
      state.draft.document.push({ ...inst });
      return state;
    }
  }
};
