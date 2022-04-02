export type ExtendedInstruction = { name: `#${string}` };

export type ParserInstruction<Pointer = unknown> =
  | BasicParserInstruction<Pointer>
  | SpecialInstruction;

export type ReducerInstruction = BasicReducerInstruction | SpecialInstruction;

export type BasicParserInstruction<Pointer = unknown> =
  | Exclude<BasicReducerInstruction, { name: "BOP" | "POST" | "POST_POST" }>
  | (BasicReducerInstruction & { name: "BOP"; bopPointer: Pointer })
  | (BasicReducerInstruction & { name: "POST"; bopPointer: Pointer })
  | (BasicReducerInstruction & { name: "POST_POST"; postPointer: Pointer });

export type BasicReducerInstruction =
  | { name: "SET"; codePoint: number }
  | { name: "SET_RULE"; width: number; height: number }
  | { name: "PUT"; codePoint: number }
  | { name: "PUT_RULE"; width: number; height: number }
  | { name: "NOP" }
  | {
      name: "BOP";
      count: [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number
      ];
    }
  | { name: "EOP" }
  | { name: "PUSH" }
  | { name: "POP" }
  | { name: "RIGHT"; movement: number }
  | { name: "W"; movement?: number }
  | { name: "X"; movement?: number }
  | { name: "DOWN"; movement: number }
  | { name: "Y"; movement?: number }
  | { name: "Z"; movement?: number }
  | { name: "FNT"; fontIndex: number }
  | { name: "XXX"; x: string }
  | {
      name: "FNT_DEF";
      fontIndex: number;
      checksum: number;
      scaleFactor: number;
      designSize: number;
      directory: string;
      filename: string;
    }
  | {
      name: "PRE";
      version: number;
      numer: number;
      denom: number;
      mag: number;
      comment: string;
    }
  | {
      name: "POST";
      numer: number;
      denom: number;
      mag: number;
      maxHeight: number;
      maxWidth: number;
      stackDepth: number;
      totalPages: number;
    }
  | { name: "POST_POST"; version: number }
  | { name: "UNDEFINED"; opcode: number };

export type SpecialInstruction =
  | { name: "$BEGIN_ANCHOR_HREF"; href: string }
  | { name: "$BEGIN_ANCHOR_NAME"; htmlName: string }
  | { name: "$END_ANCHOR" }
  | { name: "$SET_BASE_URL"; href: string }
  | { name: "$COLOR"; color: string }
  | { name: "$COLOR_PUSH"; color: string }
  | { name: "$COLOR_POP" }
  | { name: "$BACKGROUND_COLOR"; color: string };
