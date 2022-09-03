import type { ExtendedInstruction, ParserInstruction } from "./instruction";
import type { Parser, Plugin } from "./types";

export const createParseProcedure = async function* <
  Position,
  Inst extends ExtendedInstruction = never
>(
  parser: Parser<Position, Inst>,
  pageSpec: (page: number) => boolean,
  plugin: Plugin
): AsyncGenerator<Inst | ParserInstruction> {
  const prePosition = await parser.getPrePosition();
  yield (await parser.parse(prePosition)).inst;

  let bopPosition = null as unknown as Position;
  let totalPages = 0;

  postamble: {
    const postPostPosition = await parser.getPostPostPosition();
    const { inst: postPostInst } = await parser.parse(postPostPosition);

    if (postPostInst.name !== "POST_POST") {
      throw new Error();
    }

    const { postPosition } = postPostInst;
    const { inst: postInst, next } = await parser.parse(postPosition);

    if (postInst.name !== "POST") {
      throw new Error();
    }

    let position = next;
    bopPosition = postInst.bopPosition;
    totalPages = postInst.totalPages;

    while (true) {
      const { inst, next } = await parser.parse(position);

      switch (inst.name) {
        case "POST_POST": {
          break postamble;
        }

        default: {
          yield inst;
          position = next;
        }
      }
    }
  }

  const bopPositions: Position[] = [];

  for (let p = totalPages; p > 0; p--) {
    const { inst } = await parser.parse(bopPosition);

    if (inst.name !== "BOP") {
      throw new Error("This input is illegal.");
    }

    if (pageSpec(p)) {
      bopPositions.push(bopPosition);
    }

    bopPosition = inst.bopPosition;
  }

  let position = bopPositions[bopPositions.length - 1];

  while (true) {
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
