import type { DviInstruction } from "@dviio/base";
import path from "path";
import { open } from "fs/promises";
import { hyperTexPlugin } from "@dviio/common";
import { parseDvi } from "./parseDvi";

const dviPath = path.resolve(__dirname, "../__tests__/assets/plain.dvi");

describe("parseDvi", () => {
  it("without plugin", async () => {
    const handle = await open(dviPath, "r");
    const list: DviInstruction["name"][] = [];

    for await (const inst of parseDvi(handle, [1])) {
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
    const handle = await open(dviPath, "r");
    const list: DviInstruction["name"][] = [];

    for await (const inst of parseDvi(handle, [1], hyperTexPlugin)) {
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
      "$BEGIN_ANCHOR_HREF",
      "DOWN",
      "PUSH",
      "RIGHT",
      "FNT_DEF",
      "FNT",
      "SET",
      "$END_ANCHOR",
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
