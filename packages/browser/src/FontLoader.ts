import type { Loader, DviInstruction, LoaderState } from "../../base/src";

export class FontLoader implements Loader {
  constructor(private fn: (dir: string, name: string) => string | null) {}

  async reduce(inst: DviInstruction, state: LoaderState) {
    if (inst.name !== "FNT_DEF") {
      return state;
    }

    const path = this.fn(inst.directory, inst.filename);

    if (path === null) {
      throw new Error("");
    }

    fetch(path);

    return state;
  }

  end() {
    return;
  }
}
