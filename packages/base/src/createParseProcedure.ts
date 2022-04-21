import type { ExtendedInstruction, ParserInstruction } from "./instruction";
import type { Parser, Plugin } from "./types";

export const createParseProcedure = async function* <
  Position,
  Inst extends ExtendedInstruction = never
>(
  parser: Parser<Position, Inst>,
  page: [number, ...number[]] | { start: number; end: number },
  plugin: Plugin
): AsyncGenerator<Inst | ParserInstruction> {
  const prePosition = await parser.getPrePosition();
  yield (await parser.parse(prePosition)).inst;

  let bopPosition = null as unknown as Position;
  let totalPages = 0;

  postamble: {
    let position: Position = await parser.getPostPostPosition();
    let hasPostPostVisited = false;

    while (1) {
      const { inst, next } = await parser.parse(position);

      switch (inst.name) {
        case "POST": {
          yield inst;
          bopPosition = inst.bopPosition;
          totalPages = inst.totalPages;
          position = next;
          continue;
        }

        case "POST_POST": {
          if (hasPostPostVisited) {
            position = inst.postPosition;
            break postamble;
          }

          yield inst;
          hasPostPostVisited = true;
          position = inst.postPosition;
          continue;
        }

        default: {
          yield inst;
          position = next;
        }
      }
    }
  }

  const bopPositions: Position[] = [];

  predocument: {
    let position = bopPosition;

    if (!Array.isArray(page)) {
      for (let p = totalPages; p >= page.start; p--) {
        const { inst } = await parser.parse(position);

        if (inst.name !== "BOP") {
          throw new Error("This input is illegal.");
        }

        if (p >= page.start && p <= page.end) {
          bopPositions.push(position);
        }

        position = inst.bopPosition;
      }

      break predocument;
    }

    const firstPage = page[0];
    page = [...page];

    for (let p = totalPages; p >= firstPage; p--) {
      const { inst } = await parser.parse(position);

      if (inst.name !== "BOP") {
        throw new Error("This input is illegal.");
      }

      if (p === page[page.length - 1]) {
        bopPositions.push(position);
      }

      position = inst.bopPosition;
    }
  }

  let position = bopPositions[bopPositions.length - 1];

  while (1) {
    const { inst, next } = await parser.parse(position);

    switch (inst.name) {
      case "EOP": {
        yield inst;

        if (bopPositions.length === 1) {
          return;
        }

        bopPositions.pop();
        position = bopPositions[bopPositions.length - 1];
        continue;
      }

      case "XXX": {
        yield plugin(inst) ?? inst;
        position = next;
        continue;
      }

      default: {
        yield inst;
        position = next;
      }
    }
  }
};
