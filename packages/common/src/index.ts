import type { SvgDraft } from "./dviSvgReducer";
import type { YamlDraft } from "./dviYamlReducer";
import { toXml } from "xast-util-to-xml";
import { dump } from "js-yaml";

export { SvgDraft, SvgExt, dviSvgReducer } from "./dviSvgReducer";
export { YamlDraft, YamlExt, dviYamlReducer } from "./dviYamlReducer";
export { hyperTexPlugin } from "./hyperTexPlugin";

export const buildSvg = (draft: SvgDraft): string => {
  return toXml(draft);
};

export const buildYaml = (draft: YamlDraft): string => {
  return dump(draft);
};
