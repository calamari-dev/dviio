import type { Parser } from "../../../base/src";
import { getPostPostIndex } from "./getPostPostIndex";
import { parseDviInstruction } from "./parseDviInstruction";

export const parseDvi: Parser<Blob> = async function* (blob, plugins, page) {
  const fontSet = new Set<number>();
  let index = await getPostPostIndex(blob);
  let hasPostPostVisited = false;
  let bopIndex = 0;
  let totalPages = 0;
  let currentPage = 0;

  main: while (1) {
    const { byteLength, inst } = await parseDviInstruction(blob, index);

    switch (inst.name) {
      case "EOP":
        return inst;

      case "BOP": {
        if (currentPage !== page) {
          index = inst.bopIndex;
          currentPage--;
          continue;
        }

        yield inst;
        index += byteLength;
        continue;
      }

      case "XXX": {
        for (const plugin of plugins) {
          const special = plugin(inst);

          if (special !== null) {
            yield special;
            index += byteLength;
            continue main;
          }
        }

        yield inst;
        index += byteLength;
        continue;
      }

      case "POST": {
        yield inst;
        bopIndex = inst.bopIndex;
        totalPages = inst.totalPages;
        currentPage = totalPages;
        index += byteLength;
        continue;
      }

      case "FNT_DEF": {
        if (fontSet.has(inst.fontIndex)) {
          index += byteLength;
          continue;
        }

        yield inst;
        fontSet.add(inst.fontIndex);
        index += byteLength;
        continue;
      }

      case "POST_POST": {
        if (hasPostPostVisited) {
          index = bopIndex;
          continue;
        }

        yield inst;
        hasPostPostVisited = true;
        index = inst.postIndex;
        continue;
      }

      default: {
        yield inst;
        index += byteLength;
      }
    }
  }

  return { name: "EOP" };
};
