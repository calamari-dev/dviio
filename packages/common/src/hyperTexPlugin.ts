import { parseHtmlTag } from "./parseHtmlTag";
import { Plugin } from "@dviio/base";

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
        return { name: "$END_ANCHOR" };
      }

      const { props = {} } = result;

      if ("href" in props) {
        const { href = "" } = props;
        return { name: "$BEGIN_ANCHOR_HREF", href };
      }

      if ("name" in props) {
        const { name = "" } = props;
        return { name: "$BEGIN_ANCHOR_NAME", htmlName: name };
      }

      return null;
    }

    case "base": {
      if (result.type === "close") {
        return null;
      }

      const { href = "" } = result.props || {};
      return { name: "$SET_BASE_URL", href };
    }
  }
};

const isKnownTagName = (x: string): x is "a" | "base" => {
  return x === "a" || x === "base";
};
