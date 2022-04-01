import type { Preset, Plugin, PageSpec } from "./types";
import { createState } from "./createState";
import { combinePlugins } from "./combinePlugins";
import { normalizePages } from "./normalizePages";

export const dviio = <
  Input,
  Draft,
  Output,
  Ext,
  Asset,
  Inst extends { name: string }
>(
  preset: Preset<Input, Draft, Output, Ext, Asset, Inst>,
  plugins: Plugin[] = []
) => {
  const plugin = combinePlugins(...plugins);
  preset = { ...preset };

  if (typeof preset.initializer !== "function") {
    const { draft, extension } = createState(preset.initializer);
    preset.initializer = { draft, extension };
  }

  return async (input: Input, pages: PageSpec = "*"): Promise<Output> => {
    const normalized = normalizePages(pages);

    if (normalized === null) {
      throw new Error("Given page is invalid.");
    }

    const parser = preset.parser(input, normalized, plugin);
    const loader = preset?.loader && new preset.loader();
    let state = createState(preset.initializer);

    for await (const inst of parser) {
      const { fonts, extension } = state;
      Object.assign(state, await loader?.reduce(inst, { fonts, extension }));
      state = preset.reducer(inst, state);
    }

    const asset = await loader?.getAsset();
    await loader?.end?.();
    return preset.builder(state.draft, asset as Asset);
  };
};
