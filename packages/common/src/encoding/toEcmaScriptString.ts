import { ot1 } from "./ot1";
import { oml } from "./oml";
import { oms } from "./oms";
import { omx } from "./omx";

export const toEcmaScriptString = (
  codePoint: number,
  encname: "OT1" | "OML" | "OMS" | "OMX"
): string | string[] | undefined => {
  let c: number | number[] | undefined = undefined;

  switch (encname) {
    case "OT1":
      c = ot1[codePoint];
      break;

    case "OML":
      c = oml[codePoint];
      break;

    case "OMS":
      c = oms[codePoint];
      break;

    case "OMX":
      c = omx[codePoint];
      break;
  }

  switch (typeof c) {
    case "undefined":
      return undefined;

    case "number":
      return String.fromCodePoint(c);
  }

  return c.map((k) => String.fromCodePoint(k));
};
