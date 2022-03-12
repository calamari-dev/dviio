import type { Plugin } from "./types";

export const hyperTexPlugin: Plugin = ({ x }) => {
  const [name, attr, value] = (x.slice(5).match(openTag) || []).map(
    toLowerCase
  );

  if (!name || !attr) {
    return null;
  }

  if (name === "a") {
    if (attr === "href") {
      if (value === undefined) {
        return null;
      }

      return { name: "$BEGIN_EXTERNAL_LINK", href: value };
    }

    if (attr === "name") {
      if (value === undefined) {
        return null;
      }
    }
  }

  return null;
};

const toLowerCase = (x: string) => x.toLowerCase();
