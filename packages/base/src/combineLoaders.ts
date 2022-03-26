import { DviInstruction, Loader } from "./types";

export const combineLoaders = <Ext, Inst extends DviInstruction>(
  ...loaders: { new (): Loader<Ext, Inst> }[]
): { new (): Loader<Ext, Inst> } => {
  switch (loaders.length) {
    case 0:
      return EmptyLoader;

    case 1:
      return loaders[0];
  }

  const loadersMap = new WeakMap<Loader<Ext, Inst>, Loader<Ext, Inst>[]>();

  return class CombinedLoader {
    constructor() {
      const instances = loaders.map((Loader) => new Loader());
      loadersMap.set(this, instances);
    }

    reduce: Loader<Ext, Inst>["reduce"] = async (inst, state) => {
      for (const loader of loadersMap.get(this) || []) {
        state = await loader.reduce(inst, state);
      }

      return state;
    };

    end = () => Promise.all(loadersMap.get(this)?.map((x) => x?.end?.()) || []);
  };
};

class EmptyLoader implements Loader {
  reduce: Loader["reduce"] = (_, state) => Promise.resolve(state);
}
