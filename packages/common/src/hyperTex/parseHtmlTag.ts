type HtmlTag =
  | { type: "open"; tagName: string; attribute?: Record<string, string> }
  | { type: "close"; tagName: string }
  | { type: "invalid" };

export const parseHtmlTag = (x: string): HtmlTag => {
  if (x.slice(0, 2) === "</") {
    return { type: "close", tagName: x.slice(2, -1) };
  }

  if (x.slice(0, 1) !== "<") {
    return { type: "invalid" };
  }

  const match = x.match(openTag) || [];
  let [, tagName, name] = match;
  const value = (match[3] || "") + (match[4] || "") + (match[5] || "");

  if (!tagName) {
    return { type: "invalid" };
  }

  tagName = tagName.toLowerCase();

  if (!name) {
    return { type: "open", tagName };
  }

  name = name.toLowerCase();
  return { type: "open", tagName, attribute: { [name]: value } };
};

// https://html.spec.whatwg.org/multipage/syntax.html#start-tags
const openTag =
  /^(?:<([A-Za-z0-9]+)(?:[\t\n\f\r ]+([a-zA-Z]+)(?:(?:="([^"]*?)")|(?:='([^']*?)')|(?:=([^"'=<>`]+)))?)?>)/;
