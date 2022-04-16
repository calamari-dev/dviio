import type { Builder } from "@dviio/base";
import type { DumpDraft } from "./types";
import { dump } from "js-yaml";

export type { DumpDraft } from "./types";
export { dviDumpReducer } from "./dviDumpReducer";

export const buildYaml: Builder<DumpDraft, string> = async (draft) => {
  return dump(draft);
};
