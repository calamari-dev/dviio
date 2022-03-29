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

  return class CombinedLoader {
    private loaders = loaders.map((Loader) => new Loader());

    reduce: Loader<Ext, Inst>["reduce"] = async (inst, state) => {
      for (const loader of this.loaders) {
        state = await loader.reduce(inst, state);
      }

      return state;
    };

    end = () => Promise.all(this.loaders.map((loader) => loader.end?.()));
  };
};

class EmptyLoader implements Loader {
  reduce: Loader["reduce"] = (_, state) => Promise.resolve(state);
}
