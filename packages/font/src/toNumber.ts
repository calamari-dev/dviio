export const toNumber = (x: string): number | null => {
  x = x.trim();

  if (/^[+-]?[0-9]{1,}\.?$/.test(x)) {
    return parseInt(x[x.length - 1] === "." ? x.slice(-1) : x, 10);
  }

  if (/^[+-]?[0-9]*\.[0-9]+(?:[eE][+-]?[0-9]+)?$/.test(x)) {
    return parseFloat(x);
  }

  if (/^(?:2|8|16)#[0-9a-fA-F]{4}$/.test(x)) {
    const radix = x[0] === "1" ? x.slice(0, 2) : x[0];
    return parseInt(x.slice(radix.length + 1), parseInt(radix, 10));
  }

  return null;
};
