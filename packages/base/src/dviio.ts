import type { ExtendedInstruction } from "./instruction";
import type { Preset, Plugin, PageSpec } from "./types";
import { combinePlugins } from "./combinePlugins";
import { normalizePageSpec } from "./normalizePageSpec";
import { createState } from "./createState";
import { createParseProcedure } from "./createParseProcedure";
import { structuredClone } from "./structuredClone";

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
    const { draft, extension } = structuredClone($preset.initializer);
    $preset.initializer = { draft, extension };
  }

  return async (input: Input, spec: PageSpec = "*"): Promise<Output> => {
    const pageSpec = normalizePageSpec(spec);

    if (pageSpec === null) {
      throw new Error("Given page spec is invalid.");
    }

    const parser = await $preset.parser.create(input);
    const loader = await $preset?.loader?.create();

    try {
      const procedure = createParseProcedure(parser, pageSpec, plugin);
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
