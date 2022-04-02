import type { ExtendedInstruction } from "./instruction";
import type { Preset, Plugin, PageSpec } from "./types";
import { combinePlugins } from "./combinePlugins";
import { normalizePages } from "./normalizePages";
import { createState } from "./createState";
import { createParseProcedure } from "./createParseProcedure";

export const dviio = <
  Input,
  Draft,
  Output,
  Ext,
  Asset,
  Inst extends ExtendedInstruction
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

    const parser = new preset.parser(input);
    const loader = preset?.loader && new preset.loader();
    let output: Output;

    try {
      await Promise.all([parser.init?.(), loader?.init?.()]);
      const procedure = createParseProcedure(parser, normalized, plugin);
      let state = createState(preset.initializer);

      for await (const inst of procedure) {
        const { fonts, extension } = state;
        Object.assign(state, await loader?.reduce(inst, { fonts, extension }));
        state = preset.reducer(inst, state);
      }

      const asset = await loader?.getAsset();
      output = await preset.builder(state.draft, asset as Asset);
    } finally {
      await Promise.all([parser.finally?.(), loader?.finally?.()]);
    }

    return output;
  };
};
