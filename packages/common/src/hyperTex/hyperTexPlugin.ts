import { parseHtmlTag } from "./parseHtmlTag";
import { Plugin } from "../types";

export const hyperTexPlugin: Plugin = ({ x }) => {
  const result = parseHtmlTag(x.slice(5));

  if (result.type === "invalid") {
    return null;
  }

  if (result.type === "open" && result.tagName === "a") {
    const { attribute = {} } = result;

    if ("href" in attribute) {
      const { href = "" } = attribute;
      return { name: "$BEGIN_EXTERNAL_LINK", href };
    }

    if ("name" in attribute) {
      const { name = "" } = attribute;
      return { name: "$BEGIN_LINK_TARGET", htmlName: name };
    }
  }

  if (result.type === "close" && result.tagName === "a") {
    return { name: "$END_LINK" };
  }

  return null;
};
