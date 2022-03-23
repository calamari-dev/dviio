import type { Parser } from "@dviio/base";
import { getPostPostIndex } from "./getPostPostIndex";
import { parseDviInstruction } from "./parseDviInstruction";

export const parseDvi: Parser<Blob> = async function* (blob, page, plugin) {
  const fontSet = new Set<number>();
  let index = await getPostPostIndex(blob);
  let hasPostPostVisited = false;
  let bopIndex = 0;
  let totalPages = 0;
  let currentPage = 0;

  while (1) {
    const { byteLength, inst } = await parseDviInstruction(blob, index);

    switch (inst.name) {
      case "EOP": {
        yield { name: "EOP" };
        return;
      }

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
        const special = plugin && plugin(inst);
        yield special ? special : inst;
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
};
