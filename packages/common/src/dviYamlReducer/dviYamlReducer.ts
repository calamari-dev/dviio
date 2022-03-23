import type { DviInstruction, Reducer } from "@dviio/base";
import type { YamlExt } from "../types";

export const dviYamlReducer: Reducer<string, DviInstruction, YamlExt> = (
  inst,
  state
) => {
  state.draft += `- name: ${inst.name}\n`;

  for (const [key, val] of Object.entries(inst)) {
    if (key === "name") {
      continue;
    }

    if (typeof val === "string") {
      if (!/[^,0-9]/g.test(val)) {
        state.draft += val ? `  ${key}: !!str ${val}\n` : `  ${key}: ""\n`;
      }

      continue;
    }

    state.draft += `  ${key}: ${val}\n`;
  }

  return state;
};
