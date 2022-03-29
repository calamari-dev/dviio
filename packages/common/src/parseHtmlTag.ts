type HtmlTag =
  | { type: "open"; tagName: string; props?: { [T in string]?: string } }
  | { type: "close"; tagName: string }
  | { type: "invalid" };

export const parseHtmlTag = (x: string): HtmlTag => {
  if (x[0] !== "<" || x[x.length - 1] !== ">") {
    return { type: "invalid" };
  }

  if (x[1] === "/") {
    const tagName = x.slice(2, -1).toLowerCase();

    return /[^a-zA-Z-]/.test(tagName)
      ? { type: "invalid" }
      : { type: "close", tagName };
  }

  x = x.slice(1, -1);
  const tagName = /^[a-zA-Z-]+/.exec(x)?.[0].toLowerCase() || "";

  if (tagName === "") {
    return { type: "invalid" };
  }

  const props: { [T in string]?: string } = {};
  x = x.slice(tagName.length).trim();

  if (x === "") {
    return { type: "open", tagName };
  }

  while (x !== "") {
    const match = /^(?:[a-zA-Z-]+(?:="[^"]*"|='[^']*'|=[^"'=<>`]+)?)/.exec(x);

    if (!match) {
      return { type: "invalid" };
    }

    const attribute = match[0];
    const eqIndex = attribute.indexOf("=");
    x = x.slice(attribute.length).trim();

    if (eqIndex === -1) {
      props[attribute.toLowerCase()] = "";
      continue;
    }

    const key = attribute.slice(0, eqIndex).toLowerCase();
    props[key] =
      attribute.endsWith(`"`) || attribute.endsWith(`'`)
        ? attribute.slice(eqIndex + 2, -1)
        : attribute.slice(eqIndex + 1);
  }

  return { type: "open", tagName, props };
};
