import { Plugin } from "./types";

export const combinePlugins = (plugins: Plugin[]): Plugin => {
  return (inst) => {
    for (const plugin of plugins) {
      const special = plugin(inst);

      if (special !== null) {
        return special;
      }
    }

    return null;
  };
};
