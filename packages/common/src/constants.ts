import type { State } from "./types";

export const initialState: Omit<State<unknown>, "page" | "extension"> = {
  register: { h: 0, v: 0, w: 0, x: 0, y: 0, z: 0, f: 0 },
  stack: [],
  numer: 25400000,
  denom: 473628672,
  mag: 1000,
  fonts: {},
};
