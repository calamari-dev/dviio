import type { ExtendedInstruction } from "./instruction";
import type { Preset, Plugin, PageSpec } from "./types";
import { combinePlugins } from "./combinePlugins";
import { normalizePageSpec } from "./normalizePageSpec";
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
  preset:
    | Preset<Input, Draft, Output, Ext, Asset, Inst>
    | (() => Preset<Input, Draft, Output, Ext, Asset, Inst>),
  plugins: Plugin[] = []
) => {
  const $preset = { ...(typeof preset === "function" ? preset() : preset) };
  const plugin = combinePlugins(...plugins);

  if (typeof $preset.initializer !== "function") {
    const { draft, extension } = createState($preset.initializer);
    $preset.initializer = { draft, extension };
  }

  return async (input: Input, pages: PageSpec = "*"): Promise<Output> => {
    const normalized = normalizePageSpec(pages);

    if (normalized === null) {
      throw new Error("Given page is invalid.");
    }

    const parser = new $preset.parser(input);
    const loader = $preset?.loader && new $preset.loader();

    try {
      await Promise.all([parser.init?.(), loader?.init?.()]);
      const procedure = createParseProcedure(parser, normalized, plugin);
      let state = createState($preset.initializer);

      for await (const inst of procedure) {
        const { fonts, extension } = state;
        Object.assign(state, await loader?.reduce(inst, { fonts, extension }));
        state = $preset.reducer(inst, state);
      }

      const asset = await loader?.getAsset();
      return $preset.builder(state.draft, asset as Asset);
    } finally {
      await Promise.all([parser.finally?.(), loader?.finally?.()]);
    }
  };
};
