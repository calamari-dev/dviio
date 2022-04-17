export const decodeAscii85 = (x: string): string | null => {
  x = x.replace(/\s/g, "");
  let result = "";

  while (x.length > 0) {
    if (x[0] === "z") {
      x = "!!!!!" + x.slice(1);
    }

    let k = 0;

    for (let i = 0; i < x.length && i < 5; i++) {
      const c = x[i].charCodeAt(0);

      if (c < 33 || c > 117) {
        return null;
      }

      k = k * 85 + c - 33;
    }

    for (let i = x.length; i < 5; i++) {
      k = k * 85 + 84;
    }

    for (let i = x.length; i < 5; i++) {
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
    x = x.slice(5);
  }

  return result;
};
