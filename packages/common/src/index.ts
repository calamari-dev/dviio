import type { SvgDraft } from "./dviSvgReducer";
import { toXml } from "xast-util-to-xml";

export { SvgDraft, SvgExt, dviSvgReducer } from "./dviSvgReducer";
export { hyperTexPlugin } from "./hyperTexPlugin";

export const buildSvg = async (draft: SvgDraft): Promise<string> => {
  return toXml(draft);
};
