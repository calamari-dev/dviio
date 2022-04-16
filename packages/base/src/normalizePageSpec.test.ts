import { normalizePageSpec } from "./normalizePageSpec";

it("normalizePages", () => {
  expect(normalizePageSpec(1)).toEqual([1]);
  expect(normalizePageSpec(0)).toBe(null);
  expect(normalizePageSpec(NaN)).toEqual(null);
  expect(normalizePageSpec(Infinity)).toEqual(null);

  expect(normalizePageSpec({})).toEqual({ start: 1, end: Infinity });
  expect(normalizePageSpec({ start: 2.5 })).toEqual({
    start: 3,
    end: Infinity,
  });
  expect(normalizePageSpec({ end: 9 })).toEqual({ start: 1, end: 9 });
  expect(normalizePageSpec({ start: -1, end: 1.5 })).toEqual([1]);
  expect(normalizePageSpec({ start: 1.3, end: 1.4 })).toEqual(null);
  expect(normalizePageSpec({ start: Infinity })).toEqual(null);
  expect(normalizePageSpec({ end: -Infinity })).toEqual(null);

  const x: number[] = [5, 3, 3];
  x[5] = 1;

  expect(normalizePageSpec(x)).toEqual([1, 3, 5]);
  expect(normalizePageSpec([5, 3, 5, 1])).toEqual([1, 3, 5]);
  expect(normalizePageSpec([5, 3, 4, 5, 2])).toEqual({ start: 2, end: 5 });
  expect(normalizePageSpec([0.1])).toBe(null);
  expect(normalizePageSpec([5, 3, NaN])).toEqual([3, 5]);
  expect(normalizePageSpec([1, -Infinity, 9])).toEqual([1, 9]);
  expect(normalizePageSpec([-1, 0, 1])).toEqual([1]);

  expect(normalizePageSpec(new Set(x))).toEqual([1, 3, 5]);
  expect(normalizePageSpec(new Set([4, 1, 1]))).toEqual([1, 4]);
  expect(normalizePageSpec(new Set([5, 3, NaN]))).toEqual([3, 5]);
});
