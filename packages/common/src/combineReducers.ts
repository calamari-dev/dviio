/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Reducer } from "./types";

type CombinedReducer<T extends Record<string, Reducer<any, any, any>>> =
  Reducer<
    TypeParams<T>[keyof T][0],
    TypeParams<T>[keyof T][1],
    { [U in keyof TypeParams<T>]: TypeParams<T>[U][2] }
  >;

type TypeParams<T extends Record<string, Reducer<any, any, any>>> = {
  [U in keyof T]: T[U] extends Reducer<infer Page, infer Inst, infer Ext>
    ? [Page, Inst, Ext]
    : never;
};

/**
 * {@link Reducer} の組から合成された {@link Reducer} を計算する．
 */
export const combineReducers = <
  T extends Record<string, Reducer<any, any, any>>
>(
  reducers: T
): CombinedReducer<T> => {
  const entries = Object.entries(reducers);

  return (inst, state) => {
    for (const [key, reducer] of entries) {
      const tmp = reducer(inst, { ...state, extension: state.extension[key] });
      (state.extension as any)[key] = tmp.extension;
      state = { ...tmp, extension: state.extension };
    }

    return state;
  };
};
