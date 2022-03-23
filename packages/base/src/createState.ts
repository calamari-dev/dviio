import type { State } from "./types";

export const createState = <Draft, Ext>(
  part: Pick<State<Draft, Ext>, "draft" | "extension">
): State<Draft, Ext> => {
  return {
    register: { h: 0, v: 0, w: 0, x: 0, y: 0, z: 0, f: 0 },
    stack: [],
    numer: 25400000,
    denom: 473628672,
    mag: 1000,
    fonts: {},
    ...part,
  };
};
