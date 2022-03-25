import type { Loader, DviInstruction, LoaderState } from "@dviio/base";
import type { SvgExt } from "@dviio/common";

export class FontLoader implements Loader<DviInstruction, SvgExt> {
  async reduce(inst: DviInstruction, state: LoaderState<SvgExt>) {
    return state;
  }

  async end() {
    return;
  }
}
