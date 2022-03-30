import type { DviInstruction } from "@dviio/base";
import path from "path";
import { open } from "fs/promises";
import { hyperTexPlugin } from "@dviio/common";
import { parseDvi } from "./parseDvi";

it("parseDvi", async () => {
  const dviPath = path.resolve(__dirname, "../__tests__/assets/plain.dvi");
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
