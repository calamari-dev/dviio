export type Preset<
  Input,
  Draft,
  Output = Draft,
  Ext = unknown,
  Inst extends DviInstruction = DviInstruction
> = {
  initializer: () => { extension: Ext; draft: Draft };
  parser: Parser<Input, Inst>;
  loaders?: { new (): Loader<Ext, Inst> }[];
  reducer: Reducer<Draft, Ext, Inst>;
  builder: Builder<Draft, Output>;
};

export type Plugin = (
  inst: DviInstruction & { name: "XXX" }
) => SpecialInstruction | null;

export type Parser<Input, Inst extends DviInstruction = DviInstruction> = (
  input: Input,
  page: [number, ...number[]] | { start: number; end: number },
  plugin?: Plugin
) => AsyncGenerator<Inst, void>;

export abstract class Loader<
  Ext = unknown,
  Inst extends DviInstruction = DviInstruction
> {
  abstract reduce<T extends Inst, U extends LoaderState<Ext>>(
    inst: T,
    state: U
  ): Promise<U>;

  abstract end?(): Promise<unknown>;
}

export type Reducer<
  Draft,
  Ext = unknown,
  Inst extends DviInstruction = DviInstruction
> = (inst: Inst, state: State<Draft, Ext>) => State<Draft, Ext>;

export type Builder<Draft, Output> = (draft: Draft) => Output;

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
  | { name: "$BEGIN_ANCHOR_HREF"; href: string }
  | { name: "$BEGIN_ANCHOR_NAME"; htmlName: string }
  | { name: "$END_ANCHOR" }
  | { name: "$SET_BASE_URL"; href: string }
  | { name: "$COLOR"; color: string }
  | { name: "$COLOR_PUSH"; color: string }
  | { name: "$COLOR_POP" }
  | { name: "$BACKGROUND_COLOR" };
