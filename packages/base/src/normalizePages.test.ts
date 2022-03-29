import { normalizePages } from "./normalizePages";

it("normalizePages", () => {
  expect(normalizePages(1)).toEqual([1]);
  expect(normalizePages(0)).toBe(null);
  expect(normalizePages(NaN)).toEqual(null);
  expect(normalizePages(Infinity)).toEqual(null);

  expect(normalizePages({})).toEqual({ start: 1, end: Infinity });
  expect(normalizePages({ start: 2.5 })).toEqual({ start: 3, end: Infinity });
  expect(normalizePages({ end: 9 })).toEqual({ start: 1, end: 9 });
  expect(normalizePages({ start: -1, end: 1.5 })).toEqual([1]);
  expect(normalizePages({ start: 1.3, end: 1.4 })).toEqual(null);
  expect(normalizePages({ start: Infinity })).toEqual(null);
  expect(normalizePages({ end: -Infinity })).toEqual(null);

  const x: number[] = [5, 3, 3];
  x[5] = 1;

  expect(normalizePages(x)).toEqual([1, 3, 5]);
  expect(normalizePages([5, 3, 5, 1])).toEqual([1, 3, 5]);
  expect(normalizePages([5, 3, 4, 5, 2])).toEqual({ start: 2, end: 5 });
  expect(normalizePages([0.1])).toBe(null);
  expect(normalizePages([5, 3, NaN])).toEqual([3, 5]);
  expect(normalizePages([1, -Infinity, 9])).toEqual([1, 9]);
  expect(normalizePages([-1, 0, 1])).toEqual([1]);

  expect(normalizePages(new Set(x))).toEqual([1, 3, 5]);
  expect(normalizePages(new Set([4, 1, 1]))).toEqual([1, 4]);
  expect(normalizePages(new Set([5, 3, NaN]))).toEqual([3, 5]);
});
