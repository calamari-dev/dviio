// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import _structuredClone from "core-js-pure/actual/structured-clone";

export const structuredClone: <T>(x: T) => T = _structuredClone;
