import { Loader, DviInstruction, LoaderState } from "../../common/src";

export class FontLoader extends Loader {
  async reduce(inst: DviInstruction, state: LoaderState) {
    return 0 as unknown as LoaderState;
  }

  end() {
    return 0;
  }
}
