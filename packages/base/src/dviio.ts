import type { Instruction, Preset, Plugin } from "./types";
import { createState } from "./createState";
import { combinePlugins } from "./combinePlugins";
import { useLoadersInSeries } from "./useLoadersInSeries";
import { normalizePages } from "./normalizePages";

type PageSpec = "*" | number | number[] | { start?: number; end?: number };

export const dviio = <Input, Draft, Output, Inst extends Instruction, Ext>(
  preset: Preset<Input, Draft, Output, Inst, Ext>,
  plugins: Plugin[] = []
) => {
  return async (input: Input, pages: PageSpec = "*"): Promise<Output> => {
    const normalized = normalizePages(pages);

    if (normalized === null) {
      throw new Error("Given page is invalid.");
    }

    const parser = preset.parser(input, normalized, combinePlugins(plugins));
    const loader = useLoadersInSeries(preset.loaders || []);
    let state = createState(preset.initializer());

    for await (const inst of parser) {
      Object.assign(state, await loader.reduce(inst, state));
      state = preset.reducer(inst, state);
    }

    await loader.end();

    return preset.builder(state.draft);
  };
};
