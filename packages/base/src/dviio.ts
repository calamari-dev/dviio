import type { Preset, Plugin, DviInstruction, PageSpec } from "./types";
import { createState } from "./createState";
import { combinePlugins } from "./combinePlugins";
import { combineLoaders } from "./combineLoaders";
import { normalizePages } from "./normalizePages";

export const dviio = <Input, Draft, Output, Ext, Inst extends DviInstruction>(
  preset: Preset<Input, Draft, Output, Ext, Inst>,
  plugins: Plugin[] = []
) => {
  const Loader = combineLoaders(...(preset.loaders ?? []));
  const plugin = combinePlugins(...plugins);

  return async (input: Input, pages: PageSpec = "*"): Promise<Output> => {
    const normalized = normalizePages(pages);

    if (normalized === null) {
      throw new Error("Given page is invalid.");
    }

    const parser = preset.parser(input, normalized, plugin);
    const loader = new Loader();
    let state = createState(preset.initializer);

    for await (const inst of parser) {
      const { fonts, extension } = state;
      Object.assign(state, await loader.reduce(inst, { fonts, extension }));
      state = preset.reducer(inst, state);
    }

    await loader.end?.();
    return preset.builder(state.draft);
  };
};
