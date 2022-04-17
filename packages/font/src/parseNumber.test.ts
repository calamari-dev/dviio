import { parseNumber } from "./parseNumber";

it("parseNumber", () => {
  expect(parseNumber("123")).toBe(123);
  expect(parseNumber("-23")).toBe(-23);
  expect(parseNumber("+41")).toBe(41);

  expect(parseNumber("2.125")).toBe(2.125);
  expect(parseNumber("-2.")).toBe(-2);
  expect(parseNumber("-.0625")).toBe(-0.0625);
  expect(parseNumber("1e6")).toBe(1e6);
  expect(parseNumber("+0.1e-3")).toBe(0.1e-3);
  expect(parseNumber("-.1e-3")).toBe(-0.1e-3);

  expect(parseNumber("2#1010")).toBe(0b1010);
  expect(parseNumber("3#11")).toBe(4);
  expect(parseNumber("8#362")).toBe(0o0362);
  expect(parseNumber("16#41BDA")).toBe(0x41bda);

  expect(parseNumber("abc")).toBe(null);
});
