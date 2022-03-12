import { assert } from "chai";
import { hyperTexPlugin } from "./hyperTexPlugin";

describe("hyperTexPlugin", () => {
  it("html:<a name=foo>", () => {
    assert.deepEqual(hyperTexPlugin({ name: "XXX", x: "html:<a name=foo>" }), {
      name: "$BEGIN_LINK_TARGET",
      label: "foo",
    });
  });

  it("html:<a href='x'>", () => {
    assert.deepEqual(hyperTexPlugin({ name: "XXX", x: "html:<a href='x'>" }), {
      name: "$BEGIN_EXTERNAL_LINK",
      href: "x",
    });
  });
});
