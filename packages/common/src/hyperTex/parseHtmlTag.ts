type HtmlTag =
  | { type: "open"; tagName: string; attribute?: { [T in string]?: string } }
  | { type: "close"; tagName: string }
  | { type: "invalid" };

export const parseHtmlTag = (x: string): HtmlTag => {
  if (x.slice(0, 1) !== "<" || x.slice(-1) !== ">") {
    return { type: "invalid" };
  }

  if (x.slice(0, 2) === "</") {
    const tagName = x.slice(2, -1).toLowerCase();

    if (/[^a-zA-Z-]/.test(tagName)) {
      return { type: "invalid" };
    }

    return { type: "close", tagName };
  }

  x = x.slice(1, x.length - 1);
  const tagName = (/^[a-zA-Z-]+/.exec(x) || [""])[0].toLowerCase();

  if (tagName === "") {
    return { type: "invalid" };
  }

  const attribute: { [T in string]?: string } = {};
  x = x.slice(tagName.length).trim();

  if (x === "") {
    return { type: "open", tagName };
  }

  while (x !== "") {
    const match = x.match(/^(?:[a-zA-Z-]+(?:="[^"]*"|='[^']*'|=[^"'=<>`]+)?)/);

    if (!match) {
      return { type: "invalid" };
    }

    const attr = match[0];
    const eqIdx = attr.indexOf("=");
    x = x.slice(attr.length).trim();

    if (eqIdx === -1) {
      attribute[attr.toLowerCase()] = "";
      continue;
    }

    const name = attr.slice(0, eqIdx).toLowerCase();
    attribute[name] = /["']/.test(attr.slice(-1))
      ? attr.slice(eqIdx + 2, attr.length - 1)
      : attr.slice(eqIdx + 1);
  }

  return { type: "open", tagName, attribute };
};
