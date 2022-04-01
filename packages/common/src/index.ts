import type { SvgDraft } from "./dviSvgReducer";
import type { DumpDraft } from "./types";
import { toXml } from "xast-util-to-xml";
import { dump } from "js-yaml";

export type { DumpDraft } from "./types";
export { SvgDraft, SvgExt, dviSvgReducer } from "./dviSvgReducer";
export { dviDumpReducer } from "./dviDumpReducer";
export { hyperTexPlugin } from "./hyperTexPlugin";

export const buildSvg = async (draft: SvgDraft): Promise<string> => {
  return toXml(draft);
};

export const buildYaml = async (draft: DumpDraft): Promise<string> => {
  return dump(draft);
};
