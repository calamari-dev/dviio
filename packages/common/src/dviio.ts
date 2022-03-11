import type { Instruction, Mode, Plugin, State } from "./types";
import { initialState } from "./constants";

type Config<Input, Page, Output, Inst extends Instruction, Ext> = {
  mode: Mode<Input, Page, Output, Inst, Ext>;
  page: number;
  plugin?: Plugin[];
};

export const dviio = async <Input, Page, Output, Inst extends Instruction, Ext>(
  input: Input,
  { mode, page, plugin = [] }: Config<Input, Page, Output, Inst, Ext>
): Promise<Output> => {
  const parser = mode.parser(input, plugin, page);
  const loader = new mode.loader();
  let state: State<Page, Ext> = { ...initialState, ...mode.initializer() };

  const loaders = [new mode.loader()];

  for await (const inst of parser) {
    Object.assign(state, await loader.reduce(inst, state));
    state = mode.reducer(inst, state);
  }

  return mode.builder(state.page);
};
