import type { Parser } from "@dviio/base";
import { getPostPostIndex } from "./getPostPostIndex";
import { parseDviInstruction } from "./parseDviInstruction";

export const parseDvi: Parser<Blob> = async function* (blob, page, plugin) {
  yield (await parseDviInstruction(blob, 0)).inst;

  let bopIndex = 0;
  let totalPages = 0;

  postamble: {
    let index = await getPostPostIndex(blob);
    let hasPostPostVisited = false;

    while (1) {
      const { byteLength, inst } = await parseDviInstruction(blob, index);

      switch (inst.name) {
        case "POST": {
          yield inst;
          bopIndex = inst.bopIndex;
          totalPages = inst.totalPages;
          index += byteLength;
          continue;
        }

        case "POST_POST": {
          if (hasPostPostVisited) {
            index = bopIndex;
            break postamble;
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
  }

  const bopIndices: number[] = [];

  predocument: {
    let index = bopIndex;

    if (!Array.isArray(page)) {
      for (let p = totalPages; p >= page.start; p--) {
        const { inst } = await parseDviInstruction(blob, index);

        if (inst.name !== "BOP") {
          throw new Error("This input is illegal.");
        }

        p >= page.start && p <= page.end && bopIndices.push(index);
        index = inst.bopIndex;
      }

      break predocument;
    }

    const firstPage = page[0];
    page = [...page];

    for (let p = totalPages; p >= firstPage; p--) {
      const { inst } = await parseDviInstruction(blob, index);

      if (inst.name !== "BOP") {
        throw new Error("This input is illegal.");
      }

      p === page[page.length - 1] && bopIndices.push(index);
      index = inst.bopIndex;
    }
  }

  let index = bopIndices[bopIndices.length - 1];

  while (1) {
    const { byteLength, inst } = await parseDviInstruction(blob, index);

    switch (inst.name) {
      case "EOP": {
        yield inst;

        if (bopIndices.length === 1) {
          return;
        }

        bopIndices.pop();
        index = bopIndices[bopIndices.length - 1];
        continue;
      }

      case "XXX": {
        const special = plugin && plugin(inst);
        yield special ? special : inst;
        index += byteLength;
        continue;
      }

      default: {
        yield inst;
        index += byteLength;
      }
    }
  }
};
