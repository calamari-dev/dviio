import type { Loader } from "@dviio/base";
import type { SvgExt } from "@dviio/common";

export class FontLoader implements Loader<SvgExt> {
  reduce: Loader<SvgExt>["reduce"] = async (_, state) => {
    return state;
  };
}
