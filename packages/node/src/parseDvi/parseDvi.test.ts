import type { FileHandle } from "fs/promises";
import type { DviInstruction } from "@dviio/base";
import path from "path";
import { open } from "fs/promises";
import { hyperTexPlugin } from "@dviio/common";
import { parseDvi } from "./parseDvi";

let handle: FileHandle;

beforeAll(async () => {
  const dviPath = path.resolve(__dirname, "../__tests__/assets/plain.dvi");
  handle = await open(dviPath, "r");
});

describe("parseDvi", () => {
  it("without plugin", async () => {
    const list: DviInstruction["name"][] = [];

    for await (const inst of parseDvi(handle, 1)) {
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
      "EOP",
    ]);
  });

  it("with hyperTexPlugin", async () => {
    const list: DviInstruction["name"][] = [];

    for await (const inst of parseDvi(handle, 1, hyperTexPlugin)) {
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
      "$BEGIN_LINK",
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
      "EOP",
    ]);
  });
});
