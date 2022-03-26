import { hyperTexPlugin } from "./hyperTexPlugin";

describe("hyperTexPlugin", () => {
  it("hoge:<a name=foo>", () => {
    expect(hyperTexPlugin({ name: "XXX", x: "hoge:<a name=foo>" })).toBe(null);
  });

  it("html:<unknown>", () => {
    expect(hyperTexPlugin({ name: "XXX", x: "html:<unknown>" })).toBe(null);
  });

  it("html:<a name=foo>", () => {
    expect(hyperTexPlugin({ name: "XXX", x: "html:<a name=foo>" })).toEqual({
      name: "$BEGIN_ANCHOR_NAME",
      htmlName: "foo",
    });
  });

  it("html:<a hrEf='x'>", () => {
    expect(hyperTexPlugin({ name: "XXX", x: "html:<a hrEf='x'>" })).toEqual({
      name: "$BEGIN_ANCHOR_HREF",
      href: "x",
    });
  });

  it("html:</A>", () => {
    expect(hyperTexPlugin({ name: "XXX", x: "html:</A>" })).toEqual({
      name: "$END_ANCHOR",
    });
  });
});
