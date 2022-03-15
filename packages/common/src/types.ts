type Empty = { [T in string | number | symbol]: never };

export type Mode<
  Input,
  Page,
  Output,
  Inst extends Instruction = DviInstruction,
  Ext = Empty
> = {
  initializer: () => { extension: Ext; page: Page };
  parser: Parser<Input, Inst>;
  loader: { new (): Loader<Inst, Ext> };
  reducer: Reducer<Page, Inst, Ext>;
  builder: Builder<Page, Output>;
};

export type Plugin = (
  inst: DviInstruction & { name: "XXX" }
) => SpecialInstruction | null;

export type Parser<Input, Inst extends Instruction = DviInstruction> = (
  input: Input,
  plugins: Plugin[],
  page: number
) => AsyncGenerator<DviInstruction | Inst, DviInstruction | Inst>;

export abstract class Loader<
  Inst extends Instruction = DviInstruction,
  Ext = Empty
> {
  abstract reduce(
    inst: DviInstruction | Inst,
    state: LoaderState<Ext>
  ): Promise<LoaderState<Ext>>;
  abstract end(): void;
}

export type Reducer<
  Page,
  Inst extends Instruction = DviInstruction,
  Ext = Empty
> = (inst: DviInstruction | Inst, state: State<Page, Ext>) => State<Page, Ext>;

export type Builder<Page, Output> = (page: Page) => Output;

export type LoaderState<Ext = Empty> = Pick<
  State<unknown, Ext>,
  "fonts" | "extension"
>;

export type State<Page, Ext = Empty> = {
  register: { [T in "h" | "v" | "w" | "x" | "y" | "z" | "f"]: number };
  stack: Omit<State<unknown>["register"], "f">[];
  numer: number;
  denom: number;
  mag: number;
  page: Page;
  extension: Ext;
  fonts: {
    [T in number]?: {
      encoding?: string;
      scaleFactor: number;
      designSize: number;
      metric: { [U in number]?: number };
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
  | {
      name: "$BEGIN_EXTERNAL_LINK";
      href: string;
    }
  | {
      name: "$BEGIN_LINK_TARGET";
      htmlName: string;
    }
  | {
      name: "$END_LINK";
    };

export type XdvOnlyInstruction =
  | {
      name: "DEFINE_NATIVE_FONT";
    }
  | {
      name: "SET_GLYPHS";
    }
  | {
      name: "SET_TEXT_AND_GLYPHS";
    };
