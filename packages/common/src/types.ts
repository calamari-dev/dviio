import { DviInstruction } from "@dviio/base";

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
    | Omit<{ name: "BOP" } & DviInstruction, "bopIndex">
    | Exclude<
        DviInstruction,
        { name: "PRE" | "POST" | "POST_POST" | "BOP" | "FNT_DEF" }
      >
  >;
};
