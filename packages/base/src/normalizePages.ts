type PageSpec = "*" | number | number[] | { start?: number; end?: number };

export const normalizePages = (
  pages: PageSpec
): { start: number; end: number } | [number, ...number[]] | null => {
  switch (typeof pages) {
    case "string":
      return { start: 1, end: Infinity };

    case "number":
      return isValidPage(pages) ? [pages] : null;
  }

  if (!Array.isArray(pages)) {
    let { start = 1, end = Infinity } = pages;
    start = Math.ceil(start);
    end = Math.floor(end);
    start < 1 && (start = 1);

    if (start > end || start === Infinity || end === -Infinity) {
      return null;
    }

    return start === end ? [start] : { start, end };
  }

  if (pages.length === 0) {
    return null;
  }

  const set = new Set(pages);
  set.delete(undefined as unknown as number);
  const result = [...set].sort(compare) as [number, ...number[]];

  if (!result.every(isValidPage)) {
    return null;
  }

  return result.length - 1 === result[result.length - 1] - result[0]
    ? { start: result[0], end: result[result.length - 1] }
    : result;
};

const isValidPage = (page: number) => page > 0 && Number.isSafeInteger(page);
const compare = (x: number, y: number) => x - y;
