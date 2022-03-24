import { ot1 } from "./ot1";
import { oml } from "./oml";
import { oms } from "./oms";
import { omx } from "./omx";

export const toEcmaScriptString = (
  codePoint: number,
  encname: "OT1" | "OML" | "OMS" | "OMX"
): string | undefined => {
  const x = { ot1, oml, oms, omx }[encname.toLowerCase()]?.[codePoint];

  switch (typeof x) {
    case "undefined":
      return undefined;

    case "number":
      return fromCodePoint(x);
  }

  return x.map(fromCodePoint).join("");
};

const fromCodePoint = (x: number) => {
  return String.fromCodePoint(x);
};
