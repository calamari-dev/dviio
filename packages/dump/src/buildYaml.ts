import type { DumpDraft } from "./types";
import { dump } from "js-yaml";

export const buildYaml = async (draft: DumpDraft): Promise<string> => {
  return dump(draft);
};
