import { parseHtmlTag } from "./parseHtmlTag";
import { Plugin } from "../../../base/src";

export const hyperTexPlugin: Plugin = ({ x }) => {
  if (x.slice(0, 5) !== "html:") {
    return null;
  }

  const result = parseHtmlTag(x.slice(5));

  if (result.type === "invalid" || !isKnownTagName(result.tagName)) {
    return null;
  }

  switch (result.tagName) {
    case "a": {
      if (result.type === "close") {
        return { name: "$END_LINK" };
      }

      const { props = {} } = result;

      if ("href" in props) {
        const { href = "" } = props;
        return { name: "$BEGIN_EXTERNAL_LINK", href };
      }

      if ("name" in props) {
        const { name = "" } = props;
        return { name: "$BEGIN_LINK_TARGET", htmlName: name };
      }

      return null;
    }

    case "img": {
      if (result.type === "close") {
        return null;
      }

      return null;
    }

    case "base": {
      if (result.type === "close") {
        return null;
      }

      return null;
    }
  }
};

const isKnownTagName = (x: string): x is "a" | "img" | "base" => {
  return x === "a" || x === "img" || x === "base";
};
