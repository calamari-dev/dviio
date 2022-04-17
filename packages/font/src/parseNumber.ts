export const parseNumber = (x: string): number | null => {
  x = x.trim();

  if (/^[+-]?\d+$/.test(x)) {
    return parseInt(x, 10);
  }

  if (/^[+-]?(?:\d+(?:\.\d*)?|\d*\.\d+)$/.test(x)) {
    return parseFloat(x);
  }

  if (/^[+-]?(?:\d+(?:\.\d*)?|\d*\.\d+)[eE][+-]?\d+$/.test(x)) {
    return parseFloat(x);
  }

  if (x[1] === "#") {
    const radix = parseInt(x[0], 10);
    const tmp = x.slice(2);

    if (radix < 2 || !regExp[radix - 2].test(tmp)) {
      return null;
    }

    return parseInt(tmp, radix);
  }

  if (x[2] === "#") {
    const radix = parseInt(x.slice(0, 2), 10);
    const tmp = x.slice(3);

    if (radix < 10 || radix > 36 || !regExp[radix - 2].test(tmp)) {
      return null;
    }

    return parseInt(tmp, radix);
  }

  return null;
};

const regExp = [
  /^[01]+$/,
  /^[0-2]+$/,
  /^[0-3]+$/,
  /^[0-4]+$/,
  /^[0-5]+$/,
  /^[0-6]+$/,
  /^[0-7]+$/,
  /^[0-8]+$/,
  /^\d+$/,
  /^[\daA]+$/,
  /^[\dabAB]+$/,
  /^[\da-cA-C]+$/,
  /^[\da-dA-D]+$/,
  /^[\da-eA-E]+$/,
  /^[\da-fA-F]+$/,
  /^[\da-gA-G]+$/,
  /^[\da-hA-H]+$/,
  /^[\da-iA-I]+$/,
  /^[\da-jA-J]+$/,
  /^[\da-kA-K]+$/,
  /^[\da-lA-L]+$/,
  /^[\da-mA-M]+$/,
  /^[\da-nA-N]+$/,
  /^[\da-oA-O]+$/,
  /^[\da-pA-P]+$/,
  /^[\da-qA-Q]+$/,
  /^[\da-rA-R]+$/,
  /^[\da-sA-S]+$/,
  /^[\da-tA-T]+$/,
  /^[\da-uA-U]+$/,
  /^[\da-vA-V]+$/,
  /^[\da-wA-W]+$/,
  /^[\da-xA-X]+$/,
  /^[\da-yA-Y]+$/,
  /^[\da-zA-Z]+$/,
] as const;
