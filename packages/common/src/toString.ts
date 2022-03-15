import { encoding } from "./encoding";

const toString = (
  codePoint: number,
  encname: "OT1" | "OML" | "OMS" | "OMX"
): string | string[] | undefined => {
  let x: number | number[] | undefined = undefined;

  switch (encname) {
    case "OT1":
      x = encoding.ot1[codePoint];
      break;

    case "OML":
      x = encoding.oml[codePoint];
      break;

    case "OMS":
      x = encoding.oms[codePoint];
      break;

    case "OMX":
      x = encoding.omx[codePoint];
      break;
  }

  switch (typeof x) {
    case "undefined":
      return undefined;

    case "number":
      return String.fromCodePoint(x);
  }

  return x.map((k) => String.fromCodePoint(k));
};
