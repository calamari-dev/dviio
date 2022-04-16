import type { Token } from "./types";
import { tokenizer } from "./tokenizer";

const factrion = `
/fact { %def
  dup 1 gt { %if
    dup 1 sub fact mul
  } if
} def
`;

const helloWorld = `
/font /Courier findfont 24 scalefont def
font setfont
100 100 moveto
(Hello World!) show
showpage
`;

it("tokenizer", async () => {
  const list: Token[] = [];

  for await (const token of tokenizer(factrion)) {
    list.push(token);
  }

  expect(list).toEqual([
    { type: "LITERAL_NAME", value: "fact" },
    { type: "OPEN_CURLY_BRACKET" },
    { type: "COMMENT", value: "def" },
    { type: "EXECUTABLE_NAME", value: "dup" },
    { type: "NUMBER", value: 1 },
    { type: "EXECUTABLE_NAME", value: "gt" },
    { type: "OPEN_CURLY_BRACKET" },
    { type: "COMMENT", value: "if" },
    { type: "EXECUTABLE_NAME", value: "dup" },
    { type: "NUMBER", value: 1 },
    { type: "EXECUTABLE_NAME", value: "sub" },
    { type: "EXECUTABLE_NAME", value: "fact" },
    { type: "EXECUTABLE_NAME", value: "mul" },
    { type: "CLOSE_CURLY_BRACKET" },
    { type: "EXECUTABLE_NAME", value: "if" },
    { type: "CLOSE_CURLY_BRACKET" },
    { type: "EXECUTABLE_NAME", value: "def" },
  ]);

  list.length = 0;

  for await (const token of tokenizer(helloWorld)) {
    list.push(token);
  }

  expect(list).toEqual([
    { type: "LITERAL_NAME", value: "font" },
    { type: "LITERAL_NAME", value: "Courier" },
    { type: "EXECUTABLE_NAME", value: "findfont" },
    { type: "NUMBER", value: 24 },
    { type: "EXECUTABLE_NAME", value: "scalefont" },
    { type: "EXECUTABLE_NAME", value: "def" },
    { type: "EXECUTABLE_NAME", value: "font" },
    { type: "EXECUTABLE_NAME", value: "setfont" },
    { type: "NUMBER", value: 100 },
    { type: "NUMBER", value: 100 },
    { type: "EXECUTABLE_NAME", value: "moveto" },
    { type: "STRING", value: "Hello World!" },
    { type: "EXECUTABLE_NAME", value: "show" },
    { type: "EXECUTABLE_NAME", value: "showpage" },
  ]);
});
