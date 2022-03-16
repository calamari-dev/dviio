import { ot1 } from "./ot1";
import { oml } from "./oml";
import { oms } from "./oms";
import { omx } from "./omx";

export const toEcmaScriptString = (
  codePoint: number,
  encname: "OT1" | "OML" | "OMS" | "OMX"
): string | string[] | undefined => {
  const c = { ot1, oml, oms, omx }[encname.toLowerCase()]?.[codePoint];

  switch (typeof c) {
    case "undefined":
      return undefined;

    case "number":
      return String.fromCodePoint(c);
  }

  return c.map((k) => String.fromCodePoint(k));
};
