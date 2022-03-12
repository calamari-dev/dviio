import { assert } from "chai";
import { parseHtmlTag } from "./parseHtmlTag";

describe("parseHtmlTag", () => {
  it("<x-y>", () => {
    assert.deepEqual(parseHtmlTag("<x-y>"), { type: "open", tagName: "x-y" });
  });

  it("<x_y>", () => {
    assert.deepEqual(parseHtmlTag("<x_y>"), { type: "invalid" });
  });

  it("<a>", () => {
    assert.deepEqual(parseHtmlTag("<a>"), { type: "open", tagName: "a" });
  });

  it("</a>", () => {
    assert.deepEqual(parseHtmlTag("</a>"), { type: "close", tagName: "a" });
  });

  it("<A\\thref>", () => {
    assert.deepEqual(parseHtmlTag("<A\thref>"), {
      type: "open",
      tagName: "a",
      attribute: { href: "" },
    });
  });

  it("<a data-xyz=true>", () => {
    assert.deepEqual(parseHtmlTag("<a data-xyz=true>"), {
      type: "open",
      tagName: "a",
      attribute: { "data-xyz": "true" },
    });
  });

  it("<a HREF='http://example.org'>", () => {
    assert.deepEqual(parseHtmlTag("<a HREF='http://example.org'>"), {
      type: "open",
      tagName: "a",
      attribute: { href: "http://example.org" },
    });
  });

  it("<a  nAme=foo>", () => {
    assert.deepEqual(parseHtmlTag("<a  nAme=foo>"), {
      type: "open",
      tagName: "a",
      attribute: { name: "foo" },
    });
  });

  it('<a\\nHREF="http://example.org"\\tnAme=foo>', () => {
    assert.deepEqual(parseHtmlTag('<a\nHREF="http://example.org"\tnAme=foo>'), {
      type: "open",
      tagName: "a",
      attribute: { href: "http://example.org", name: "foo" },
    });
  });
});
