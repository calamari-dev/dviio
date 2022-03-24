import { parseHtmlTag } from "./parseHtmlTag";

describe("parseHtmlTag", () => {
  it("<x-y>", () => {
    expect(parseHtmlTag("<x-y>")).toEqual({ type: "open", tagName: "x-y" });
  });

  it("<x_y>", () => {
    expect(parseHtmlTag("<x_y>")).toEqual({ type: "invalid" });
  });

  it("<a>", () => {
    expect(parseHtmlTag("<a>")).toEqual({ type: "open", tagName: "a" });
  });

  it("</a>", () => {
    expect(parseHtmlTag("</a>")).toEqual({ type: "close", tagName: "a" });
  });

  it("<A\\thref>", () => {
    expect(parseHtmlTag("<A\thref>")).toEqual({
      type: "open",
      tagName: "a",
      props: { href: "" },
    });
  });

  it("<a data-xyz=true>", () => {
    expect(parseHtmlTag("<a data-xyz=true>")).toEqual({
      type: "open",
      tagName: "a",
      props: { "data-xyz": "true" },
    });
  });

  it("<a HREF='http://example.org'>", () => {
    expect(parseHtmlTag("<a HREF='http://example.org'>")).toEqual({
      type: "open",
      tagName: "a",
      props: { href: "http://example.org" },
    });
  });

  it("<a  nAme=foo>", () => {
    expect(parseHtmlTag("<a  nAme=foo>")).toEqual({
      type: "open",
      tagName: "a",
      props: { name: "foo" },
    });
  });

  it('<a\\nHREF="http://example.org"\\tnAme=foo>', () => {
    expect(parseHtmlTag('<a\nHREF="http://example.org"\tnAme=foo>')).toEqual({
      type: "open",
      tagName: "a",
      props: { href: "http://example.org", name: "foo" },
    });
  });
});
