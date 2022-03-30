import type { DviInstruction } from "@dviio/base";
import { hyperTexPlugin } from "@dviio/common";
import { parseDvi } from "./parseDvi";

it("parseDvi", async () => {
  const res = await fetch(`${location.origin}/assets/plain.dvi`);
  const blob = await res.blob();
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
