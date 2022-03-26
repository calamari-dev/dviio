import type { Plugin } from "./types";

export const combinePlugins = (...plugins: Plugin[]): Plugin => {
  switch (plugins.length) {
    case 0:
      return emptyPlugin;

    case 1:
      return plugins[0];
  }

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

const emptyPlugin: Plugin = () => null;
