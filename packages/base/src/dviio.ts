import type { Instruction, Preset, Plugin } from "./types";
import { createState } from "./createState";
import { combinePlugins } from "./combinePlugins";
import { useLoadersInSeries } from "./useLoadersInSeries";

export const dviio = <Input, Draft, Output, Inst extends Instruction, Ext>(
  preset: Preset<Input, Draft, Output, Inst, Ext>,
  plugins: Plugin[] = []
) => {
  return async (input: Input, page: number): Promise<Output> => {
    const parser = preset.parser(input, page, combinePlugins(plugins));
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
