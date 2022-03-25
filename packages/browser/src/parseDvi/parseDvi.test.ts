import type { DviInstruction } from "@dviio/base";
import { hyperTexPlugin } from "@dviio/common";
import { parseDvi } from "./parseDvi";

let blob: Blob;

beforeAll(async () => {
  const res = await fetch(`${location.origin}/assets/plain.dvi`);
  blob = await res.blob();
});

describe("parseDvi", () => {
  it("without plugin", async () => {
    const list: DviInstruction["name"][] = [];

    for await (const inst of parseDvi(blob, [1])) {
      list.push(inst.name);
    }

    expect(list).toEqual([
      "PRE",
      "POST_POST",
      "POST",
      "FNT_DEF",
      "BOP",
      "PUSH",
      "DOWN",
      "POP",
      "DOWN",
      "PUSH",
      "DOWN",
      "XXX",
      "DOWN",
      "PUSH",
      "RIGHT",
      "FNT_DEF",
      "FNT",
      "SET",
      "XXX",
      "SET",
      "POP",
      "POP",
      "DOWN",
      "PUSH",
      "RIGHT",
      "SET",
      "POP",
      "EOP",
    ]);
  });

  it("with hyperTexPlugin", async () => {
    const list: DviInstruction["name"][] = [];

    for await (const inst of parseDvi(blob, [1], hyperTexPlugin)) {
      list.push(inst.name);
    }

    expect(list).toEqual([
      "PRE",
      "POST_POST",
      "POST",
      "FNT_DEF",
      "BOP",
      "PUSH",
      "DOWN",
      "POP",
      "DOWN",
      "PUSH",
      "DOWN",
      "$BEGIN_LINK",
      "DOWN",
      "PUSH",
      "RIGHT",
      "FNT_DEF",
      "FNT",
      "SET",
      "$END_LINK",
      "SET",
      "POP",
      "POP",
      "DOWN",
      "PUSH",
      "RIGHT",
      "SET",
      "POP",
      "EOP",
    ]);
  });
});
