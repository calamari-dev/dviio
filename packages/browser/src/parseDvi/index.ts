import { Parser } from "../../../common/src/types";
import { getPostPostIndex } from "./getPostPostIndex";

export const parseDvi: Parser<Blob> = async function* (blob, plugin, page) {
  let index = await getPostPostIndex(blob);

  while (1) {
    yield { name: "NOP" };
  }

  return { name: "EOP" };
};
