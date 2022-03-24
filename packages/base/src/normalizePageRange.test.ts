import { normalizePageRange } from "./normalizePageRange";

it("normalizePageRange", () => {
  expect(normalizePageRange(0)).toBe(null);
  expect(normalizePageRange([0.1])).toBe(null);
  expect(normalizePageRange(NaN)).toEqual(null);
  expect(normalizePageRange(Infinity)).toEqual(null);
  expect(normalizePageRange([5, 3, NaN])).toEqual(null);
  expect(normalizePageRange([1, -Infinity, 9])).toEqual(null);
  expect(normalizePageRange([-1, 0, 1])).toBe(null);
  expect(normalizePageRange(1)).toEqual([1]);
  expect(normalizePageRange([5, 3, 5, 1])).toEqual([1, 3, 5]);

  const x: number[] = [5, 3, 3];
  x[5] = 1;
  expect(normalizePageRange(x)).toEqual([1, 3, 5]);
});
