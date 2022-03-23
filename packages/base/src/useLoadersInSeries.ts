import type { Instruction, DviInstruction, Loader, LoaderState } from "./types";

export const useLoadersInSeries = <
  Inst extends Instruction = DviInstruction,
  Ext = unknown
>(
  loaders: (new () => Loader<Inst, Ext>)[]
): Loader<Inst, Ext> => {
  const loadersMap = new WeakMap<Loader<Inst, Ext>, Loader<Inst, Ext>[]>();

  class CombinedLoader {
    constructor() {
      const x = loaders.map((Loader) => new Loader());
      loadersMap.set(this, x);
    }

    async reduce(
      inst: Inst | DviInstruction,
      state: LoaderState<Ext>
    ): Promise<LoaderState<Ext>> {
      for (const loader of loadersMap.get(this) || []) {
        state = await loader.reduce(inst, state);
      }

      return state;
    }

    async end() {
      await Promise.all(loadersMap.get(this)?.map((y) => y.end()) || []);
    }
  }

  return new CombinedLoader();
};
