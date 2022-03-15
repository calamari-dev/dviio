import { assert } from "chai";
import { hyperTexPlugin } from "./hyperTexPlugin";

describe("hyperTexPlugin", () => {
  it("hoge:<a name=foo>", () => {
    assert.deepEqual(
      hyperTexPlugin({ name: "XXX", x: "hoge:<a name=foo>" }),
      null
    );
  });

  it("html:<unknown>", () => {
    assert.deepEqual(
      hyperTexPlugin({ name: "XXX", x: "html:<unknown>" }),
      null
    );
  });

  it("html:<a name=foo>", () => {
    assert.deepEqual(hyperTexPlugin({ name: "XXX", x: "html:<a name=foo>" }), {
      name: "$BEGIN_LINK_TARGET",
      htmlName: "foo",
    });
  });

  it("html:<a hrEf='x'>", () => {
    assert.deepEqual(hyperTexPlugin({ name: "XXX", x: "html:<a hrEf='x'>" }), {
      name: "$BEGIN_EXTERNAL_LINK",
      href: "x",
    });
  });

  it("html:</A>", () => {
    assert.deepEqual(hyperTexPlugin({ name: "XXX", x: "html:</A>" }), {
      name: "$END_LINK",
    });
  });
});
