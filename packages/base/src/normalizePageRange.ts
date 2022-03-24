export const normalizePageRange = (
  pages: number | number[] | "*"
): null | [number, ...number[]] | "*" => {
  switch (typeof pages) {
    case "string":
      return "*";

    case "number":
      return pages > 0 && Number.isInteger(pages) ? [pages] : null;
  }

  if (pages.length === 0) {
    return null;
  }

  const result = pages.slice(0);

  for (let i = 0; i < result.length; ) {
    if (result[i] === undefined) {
      result.splice(i, 1);
      continue;
    }

    if (result[i] < 1 || !Number.isInteger(result[i])) {
      return null;
    }

    i++;
  }

  result.sort((x, y) => x - y);

  for (let i = 1; i < result.length; ) {
    if (result[i] === result[i - 1]) {
      result.splice(i, 1);
      continue;
    }

    i++;
  }

  return result as [number, ...number[]];
};
