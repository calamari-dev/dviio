import { decodeAscii85 } from "./decodeAscii85";

it("decodeAscii85", () => {
  expect(decodeAscii85("87cU\tRD_\n*#4DfTZ)+T")).toBe("Hello, World!");
  expect(decodeAscii85(`\r9Q+r_D'3P3F*2=BA8c:\n\t&EZfF;F<G"/ATR`)).toBe(
    "Lorem ipsum dolor sit amet"
  );
});
