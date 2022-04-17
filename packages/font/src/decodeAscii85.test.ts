import { decodeAscii85 } from "./decodeAscii85";

it("decodeAscii85", () => {
  expect(decodeAscii85("A7]?")).toBe("def");
  expect(decodeAscii85("87cURD_*#4DfTZ)+T")).toBe("Hello, World!");
});
