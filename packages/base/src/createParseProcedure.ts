import type { ExtendedInstruction, ParserInstruction } from "./instruction";
import type { Parser, Plugin } from "./types";

export const createParseProcedure = async function* <
  Pointer,
  Inst extends ExtendedInstruction = never
>(
  parser: Parser<Pointer, Inst>,
  page: [number, ...number[]] | { start: number; end: number },
  plugin: Plugin
): AsyncGenerator<Inst | ParserInstruction> {
  const prePointer = await parser.getPrePointer();
  yield (await parser.parse(prePointer)).inst;

  let bopPointer = null as unknown as Pointer;
  let totalPages = 0;

  postamble: {
    let pointer: Pointer = await parser.getPostPostPointer();
    let hasPostPostVisited = false;

    while (1) {
      const { inst, next } = await parser.parse(pointer);

      switch (inst.name) {
        case "POST": {
          yield inst;
          bopPointer = inst.bopPointer;
          totalPages = inst.totalPages;
          pointer = next;
          continue;
        }

        case "POST_POST": {
          if (hasPostPostVisited) {
            pointer = inst.postPointer;
            break postamble;
          }

          yield inst;
          hasPostPostVisited = true;
          pointer = inst.postPointer;
          continue;
        }

        default: {
          yield inst;
          pointer = next;
        }
      }
    }
  }

  const bopPointers: Pointer[] = [];

  predocument: {
    let pointer = bopPointer;

    if (!Array.isArray(page)) {
      for (let p = totalPages; p >= page.start; p--) {
        const { inst } = await parser.parse(pointer);

        if (inst.name !== "BOP") {
          throw new Error("This input is illegal.");
        }

        if (p >= page.start && p <= page.end) {
          bopPointers.push(pointer);
        }

        pointer = inst.bopPointer;
      }

      break predocument;
    }

    const firstPage = page[0];
    page = [...page];

    for (let p = totalPages; p >= firstPage; p--) {
      const { inst } = await parser.parse(pointer);

      if (inst.name !== "BOP") {
        throw new Error("This input is illegal.");
      }

      if (p === page[page.length - 1]) {
        bopPointers.push(pointer);
      }

      pointer = inst.bopPointer;
    }
  }

  let pointer = bopPointers[bopPointers.length - 1];

  while (1) {
    const { inst, next } = await parser.parse(pointer);

    switch (inst.name) {
      case "EOP": {
        yield inst;

        if (bopPointers.length === 1) {
          return;
        }

        bopPointers.pop();
        pointer = bopPointers[bopPointers.length - 1];
        continue;
      }

      case "XXX": {
        yield plugin(inst) ?? inst;
        pointer = next;
        continue;
      }

      default: {
        yield inst;
        pointer = next;
      }
    }
  }
};
