export type Preset<
  Input,
  Draft,
  Output = Draft,
  Inst extends Instruction = DviInstruction,
  Ext = unknown
> = {
  initializer: () => { extension: Ext; draft: Draft };
  parser: Parser<Input, Inst>;
  loaders?: (new () => Loader<Inst, Ext>)[];
  reducer: Reducer<Draft, Inst, Ext>;
  builder: Builder<Draft, Output>;
};

export type Plugin = (
  inst: DviInstruction & { name: "XXX" }
) => SpecialInstruction | null;

export type Parser<Input, Inst extends Instruction = DviInstruction> = (
  input: Input,
  page: [number, ...number[]] | { start: number; end: number },
  plugin?: Plugin
) => AsyncGenerator<DviInstruction | Inst, void>;

export abstract class Loader<
  Inst extends Instruction = DviInstruction,
  Ext = unknown
> {
  abstract reduce(
    inst: DviInstruction | Inst,
    state: LoaderState<Ext>
  ): Promise<LoaderState<Ext>>;
  abstract end(): Promise<void>;
}

export type Reducer<
  Draft,
  Inst extends Instruction = DviInstruction,
  Ext = unknown
> = (
  inst: DviInstruction | Inst,
  state: State<Draft, Ext>
) => State<Draft, Ext>;

export type Builder<Draft, Output> = (Draft: Draft) => Output;

export type LoaderState<Ext = never> = Pick<
  State<unknown, Ext>,
  "fonts" | "extension"
>;

export type State<Draft, Ext = never> = {
  register: { [T in "h" | "v" | "w" | "x" | "y" | "z" | "f"]: number };
  stack: Omit<State<unknown>["register"], "f">[];
  numer: number;
  denom: number;
  mag: number;
  draft: Draft;
  extension: Ext;
  fonts: {
    [T in number]?: {
      encoding?: string;
      scaleFactor: number;
      designSize: number;
      advanceWidths: { [U in number]?: number };
    };
  };
};

export type Instruction = { name: string };

export type DviInstruction =
  | SpecialInstruction
  | { name: "SET"; codePoint: number }
  | { name: "SET_RULE"; width: number; height: number }
  | { name: "PUT"; codePoint: number }
  | { name: "PUT_RULE"; width: number; height: number }
  | { name: "NOP" }
  | {
      name: "BOP";
      bopIndex: number;
      count: [
        number,
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
      bopIndex: number;
      numer: number;
      denom: number;
      mag: number;
      maxHeight: number;
      maxWidth: number;
      stackDepth: number;
      totalPages: number;
    }
  | {
      name: "POST_POST";
      version: number;
      postIndex: number;
    }
  | { name: "UNDEFINED"; opcode: number };

export type SpecialInstruction =
  | { name: "$BEGIN_LINK"; href: string }
  | { name: "$BEGIN_REFERENCE"; htmlName: string }
  | { name: "$END_LINK" }
  | { name: "$COLOR"; color: string }
  | { name: "$COLOR_PUSH"; color: string }
  | { name: "$COLOR_POP" }
  | { name: "$BACKGROUND_COLOR" };
