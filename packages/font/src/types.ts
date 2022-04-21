export type Tokenizer<Code> = (code: Code) => AsyncGenerator<Token, void>;

export type Token =
  | PrimitiveToken
  | DelimiterToken
  | { type: "COMMENT"; value: string };

export type PrimitiveToken =
  | { type: "NUMBER"; value: number }
  | { type: "STRING"; value: string }
  | { type: "LITERAL_NAME"; value: string }
  | { type: "EXECUTABLE_NAME"; value: string }
  | { type: "IMMEDIATELY_EVALUATED_NAME"; value: string };

export type DelimiterToken =
  | { type: `${"OPEN" | "CLOSE"}_DOUBLE_ANGLE_BRACKET` }
  | { type: `${"OPEN" | "CLOSE"}_SQUARE_BRACKET` }
  | { type: `${"OPEN" | "CLOSE"}_CURLY_BRACKET` };
