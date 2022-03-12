import { assert } from "chai";
import { parseHtmlTag } from "./parseHtmlTag";

describe("parseHtmlTag", () => {
  it("<x-y>", () => {
    assert.deepEqual(parseHtmlTag("<x-y>"), { type: "invalid" });
  });

  it("<a>", () => {
    assert.deepEqual(parseHtmlTag("<a>"), { type: "open", tagName: "a" });
  });

  it("<a\thref>", () => {
    assert.deepEqual(parseHtmlTag("<a\thref>"), {
      type: "open",
      tagName: "a",
      attribute: { href: "" },
    });
  });

  it("<a href='http://example.org'>", () => {
    assert.deepEqual(parseHtmlTag("<a href='http://example.org'>"), {
      type: "open",
      tagName: "a",
      attribute: { href: "http://example.org" },
    });
  });

  it("<a  name=foo>", () => {
    assert.deepEqual(parseHtmlTag("<a  name=foo>"), {
      type: "open",
      tagName: "a",
      attribute: { name: "foo" },
    });
  });
});
