import type { annotationSymbol, commentSymbol } from "./symbols";
import { ReducerInstruction } from "@dviio/base";

export type DumpDraft = {
  preamble: {
    version: number;
    numer: number;
    denom: number;
    mag: number;
    comment: string;
  };
  postamble: {
    version: number;
    maxHeight: number;
    maxWidth: number;
  };
  fonts: {
    [T in number]?: {
      checksum: number;
      scaleFactor: number;
      designSize: number;
      directory: string;
      filename: string;
    };
  };
  document: Array<
    | Element
    | { name: typeof commentSymbol; comment: string }
    | {
        name: typeof annotationSymbol;
        inst: Element;
        annotation?: { [T in string]?: string };
      }
  >;
};

type Element = Exclude<
  ReducerInstruction,
  { name: "PRE" | "POST" | "POST_POST" | "FNT_DEF" }
>;
