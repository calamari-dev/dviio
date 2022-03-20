import type { DviInstruction } from "../../../base/src";
import { hyperTexPlugin } from "../../../common/src";
import { parseDvi } from "./parseDvi";

let blob: Blob;

beforeAll(async () => {
  const res = await fetch(`${location.origin}/assets/plain.dvi`);
  blob = await res.blob();
});

describe("parseDvi", () => {
  it("without plugin", async () => {
    const list: DviInstruction["name"][] = [];

    for await (const inst of parseDvi(blob, [], 1)) {
      list.push(inst.name);
    }

    expect(list).toEqual([
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
    ]);
  });

  it("with hyperTexPlugin", async () => {
    const list: DviInstruction["name"][] = [];

    for await (const inst of parseDvi(blob, [hyperTexPlugin], 1)) {
      list.push(inst.name);
    }

    expect(list).toEqual([
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
      "$BEGIN_EXTERNAL_LINK",
      "DOWN",
      "PUSH",
      "RIGHT",
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
    ]);
  });
});
