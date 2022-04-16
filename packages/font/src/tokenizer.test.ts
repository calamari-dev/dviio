import type { Token } from "./types";
import { tokenizer } from "./tokenizer";

const code = `
/font /Courier findfont 24 scalefont def
font setfont
100 100 moveto
(Hello World!) show
showpage
`;

it("tokenizer", async () => {
  const list: Token[] = [];

  for await (const token of tokenizer(code)) {
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
