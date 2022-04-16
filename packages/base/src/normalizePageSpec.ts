import type { PageSpec } from "./types";

export const normalizePageSpec = (
  pages: PageSpec
): { start: number; end: number } | [number, ...number[]] | null => {
  switch (typeof pages) {
    case "string":
      return { start: 1, end: Infinity };

    case "number":
      return isNatural(pages) ? [pages] : null;
  }

  if (Array.isArray(pages) || pages instanceof Set) {
    const set = new Set(pages);
    set.delete(undefined as unknown as number);
    const result = [...set].filter(isNatural).sort(subtract);

    switch (result.length) {
      case 0:
        return null;

      case 1:
        return result as [number];
    }

    return result.length - 1 === result[result.length - 1] - result[0]
      ? { start: result[0], end: result[result.length - 1] }
      : (result as [number, ...number[]]);
  }

  let { start = 1, end = Infinity } = pages;
  start = Math.max(Math.ceil(start), 1);
  end = Math.floor(end);

  if (start > end || start === Infinity || end === -Infinity) {
    return null;
  }

  return start === end ? [start] : { start, end };
};

const isNatural = (page: number) => page > 0 && Number.isSafeInteger(page);
const subtract = (x: number, y: number) => x - y;
