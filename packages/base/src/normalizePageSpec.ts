import type { PageSpec } from "./types";

export const normalizePageSpec = (
  spec: PageSpec
): ((page: number) => boolean) | null => {
  switch (typeof spec) {
    case "function":
      return spec;

    case "string":
      return isNatural;

    case "number":
      return !isNatural(spec) ? null : (x) => x === spec;
  }

  if (Array.isArray(spec) || spec instanceof Set) {
    const set = new Set<number>();

    for (const page of spec) {
      if (isNatural(page)) {
        set.add(page);
      }
    }

    return set.size === 0 ? null : (page) => set.has(page);
  }

  let { start = 1, end = Infinity } = spec;
  start = Math.max(Math.ceil(start), 1);
  end = Math.floor(end);

  if (start > end || start === Infinity || end === -Infinity) {
    return null;
  }

  return (page) => isNatural(page) && page >= start && page <= end;
};

const isNatural = (page: number) => page > 0 && Number.isInteger(page);
