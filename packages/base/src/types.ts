import type {
  ExtendedInstruction,
  ParserInstruction,
  ReducerInstruction,
  SpecialInstruction,
} from "./instruction";

export type PageSpec =
  | "*"
  | number
  | number[]
  | Set<number>
  | { start?: number; end?: number };

export type Preset<
  Input,
  Draft,
  Output = Draft,
  Ext = unknown,
  Asset = never,
  Inst extends ExtendedInstruction = never
> = [Asset] extends [never]
  ? {
      initializer: Initializer<Draft, Ext>;
      parser: ParserConstructor<Input, unknown, Inst>;
      loader?: LoaderConstructor<Ext, unknown, Inst>;
      reducer: Reducer<Draft, Ext, Inst>;
      builder: Builder<Draft, Output, Asset>;
    }
  : {
      initializer: Initializer<Draft, Ext>;
      parser: ParserConstructor<Input, unknown, Inst>;
      loader: LoaderConstructor<Ext, Asset, Inst>;
      reducer: Reducer<Draft, Ext, Inst>;
      builder: Builder<Draft, Output, Asset>;
    };

export type Plugin = (
  inst: ReducerInstruction & { name: "XXX" }
) => SpecialInstruction | null;

export type Initializer<Draft, Ext = unknown> =
  | { draft: Draft; extension: Ext }
  | (() => { draft: Draft; extension: Ext });

export type ParserConstructor<
  Input,
  Pointer,
  Inst extends ExtendedInstruction = never
> = { new (input: Input): Parser<Pointer, Inst> };

export type Parser<Pointer, Inst extends ExtendedInstruction = never> = {
  getPrePointer(): Promise<Pointer>;
  getPostPostPointer(): Promise<Pointer>;
  parse(pointer: Pointer): Promise<{
    inst: Inst | ParserInstruction<Pointer>;
    next: Pointer;
  }>;
  finally?(): Promise<void>;
};

export type LoaderConstructor<
  Ext = unknown,
  Asset = unknown,
  Inst extends ExtendedInstruction = never
> = { new (): Loader<Ext, Asset, Inst> };

export type Loader<
  Ext = unknown,
  Asset = unknown,
  Inst extends ExtendedInstruction = never
> = {
  reduce(
    inst: Inst | ReducerInstruction,
    state: LoaderState<Ext>
  ): Promise<LoaderState<Ext>>;
  getAsset(): Promise<Asset>;
  finally?(): Promise<unknown>;
};

export type Reducer<
  Draft,
  Ext = unknown,
  Inst extends ExtendedInstruction = never
> = (
  inst: Inst | ReducerInstruction,
  state: State<Draft, Ext>
) => State<Draft, Ext>;

export type Builder<Draft, Output, Asset = never> = (
  draft: Draft,
  asset: Asset
) => Promise<Output>;

export type LoaderState<Ext = unknown> = Pick<
  State<unknown, Ext>,
  "fonts" | "extension"
>;

export type State<Draft, Ext = unknown> = {
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
