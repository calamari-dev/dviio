export const decodeAscii85 = (x: string): string => {
  let result = "";

  while (x.length > 0) {
    let k = 0;

    for (let i = 0; i < 5; i++) {
      k *= 85;
      k += (x.charCodeAt(0) || 33) - 33;
      x = x.slice(1);
    }

    let s = "";

    while (k > 0) {
      if ((k & 0xff) > 0) {
        s = String.fromCharCode(k & 0xff) + s;
      }

      k >>= 8;
    }

    result += s;
  }

  return result;
};
