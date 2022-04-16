import type { Reducer } from "@dviio/base";
import type { DumpDraft } from "./types";

export const dviDumpReducer: Reducer<DumpDraft> = (inst, state) => {
  switch (inst.name) {
    case "PRE": {
      state.draft.preamble = getOmitted(inst, "name");
      state.numer = inst.numer;
      state.denom = inst.denom;
      state.mag = inst.mag;
      return state;
    }

    case "POST": {
      const { postamble } = state.draft;
      postamble.maxHeight = inst.maxHeight;
      postamble.maxWidth = inst.maxWidth;
      return state;
    }

    case "POST_POST": {
      state.draft.postamble.version = inst.version;
      return state;
    }

    case "BOP": {
      state.draft.document.push({ name: "BOP", count: inst.count });
      return state;
    }

    case "FNT_DEF": {
      state.draft.fonts[inst.fontIndex] = getOmitted(inst, "name");
      return state;
    }

    default: {
      state.draft.document.push({ ...inst });
      return state;
    }
  }
};

const getOmitted = <
  T extends { [U in string | number | symbol]?: unknown },
  U extends keyof T
>(
  target: T,
  key: U
): Omit<T, U> => {
  const result: Partial<T> = { ...target };
  delete result[key];
  return result as T;
};
