import type { DviInstruction, Reducer } from "@dviio/base";

type Element =
  | Exclude<DviInstruction, { name: "PUSH" }>
  | { name: "PUSH"; then: Element[] };

export type YamlDraft = {
  preamble: Omit<{ name: "PRE" } & DviInstruction, "name">;
  postamble: Omit<
    { name: "POST" } & DviInstruction,
    "bopIndex" | keyof ({ name: "PRE" } & DviInstruction)
  >;
  document: Element[];
};

export type YamlExt = {
  parents: [Element[], ...Element[][]];
};

export const dviYamlReducer: Reducer<YamlDraft, YamlExt> = (inst, state) => {
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
      postamble.stackDepth = inst.stackDepth;
      postamble.totalPages = inst.totalPages;
      return state;
    }

    case "PUSH": {
      const { parents } = state.extension;
      const current: YamlDraft["document"] = [];
      parents[parents.length - 1].push({ name: "PUSH", then: current });
      parents.push(current);
      return state;
    }

    case "POP": {
      const { parents } = state.extension;
      parents[parents.length - 1].push({ name: "POP" });
      parents.length > 1 && parents.pop();
      return state;
    }

    default: {
      const { parents } = state.extension;
      parents[parents.length - 1].push(inst);
      return state;
    }
  }
};
