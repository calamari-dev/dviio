import type { Initializer, State } from "./types";

import { structuredClone } from "./structuredClone";

export const createState = <Draft, Ext>(
  init: Initializer<Draft, Ext>
): State<Draft, Ext> => {
  return {
    ...(typeof init === "function" ? init() : structuredClone(init)),
    register: { h: 0, v: 0, w: 0, x: 0, y: 0, z: 0, f: 0 },
    stack: [],
    numer: 25400000,
    denom: 473628672,
    mag: 1000,
    fonts: {},
  };
};
