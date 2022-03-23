import type { Loader, DviInstruction, LoaderState } from "@dviio/base";
import type { CommonExt } from "@dviio/common";

export class FontLoader implements Loader<DviInstruction, CommonExt> {
  async reduce(inst: DviInstruction, state: LoaderState<CommonExt>) {
    return state;
  }

  async end() {
    return;
  }
}
