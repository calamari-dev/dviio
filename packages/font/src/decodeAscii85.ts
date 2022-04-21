export const decodeAscii85 = (x: string): string | null => {
  x = x.replace(/\s/g, "");
  let result = "";

  for (let pos = 0; pos < x.length; pos += 5) {
    const m = Math.min(x.length, pos + 5);
    let k = 0;

    for (let i = pos; i < m; i++) {
      const c = x.charCodeAt(i);

      if (c < 33 || c > 117) {
        return null;
      }

      k = k * 85 + c - 33;
    }

    for (let i = m - pos; i < 5; i++) {
      k = k * 85 + 84;
    }

    for (let i = m - pos; i < 5; i++) {
      k >>= 8;
    }

    let s = "";

    while (k > 0) {
      const c = k & 0xff;

      if (c < 32) {
        return null;
      }

      s = String.fromCharCode(c) + s;
      k >>= 8;
    }

    result += s;
  }

  return result;
};
