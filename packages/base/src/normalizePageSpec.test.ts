/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { normalizePageSpec } from "./normalizePageSpec";

it("normalizePages", () => {
  const pages = [0, 1, 2, 3] as const;
  const T = true;
  const F = false;

  expect(pages.map(normalizePageSpec(1)!)).toEqual([F, T, F, F]);
  expect(normalizePageSpec(0)).toBe(null);
  expect(normalizePageSpec(NaN)).toEqual(null);
  expect(normalizePageSpec(Infinity)).toEqual(null);

  expect(pages.map(normalizePageSpec({})!)).toEqual([F, T, T, T]);
  expect(pages.map(normalizePageSpec({ start: 1.5 })!)).toEqual([F, F, T, T]);
  expect(pages.map(normalizePageSpec({ end: 2 })!)).toEqual([F, T, T, F]);
  expect(normalizePageSpec({ start: 1.3, end: 1.4 })).toEqual(null);
  expect(normalizePageSpec({ start: Infinity })).toEqual(null);
  expect(normalizePageSpec({ end: -Infinity })).toEqual(null);

  const x: number[] = [5, 3, 3];
  x[5] = 1;

  expect(pages.map(normalizePageSpec(x)!)).toEqual([F, T, F, T]);
  expect(normalizePageSpec([0.1])).toBe(null);
  expect(pages.map(normalizePageSpec(new Set(x))!)).toEqual([F, T, F, T]);
});
