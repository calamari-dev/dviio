import { promisify } from "util";
import { execFile } from "child_process";
import path from "path";
import { DviInstruction, Loader, LoaderState } from "@dviio/base";

export class TfmLoader implements Loader<DviInstruction> {
  async reduce(inst: DviInstruction, state: LoaderState) {
    if (inst.name !== "FNT_DEF") {
      return state;
    }

    const tfmPath = path.join(inst.directory, `${inst.filename}.tfm`);
    const { stdout, stderr } = await execute("kpsewhich", [tfmPath]);

    if (stderr) {
      throw new Error(`kpsewhich says "${stderr}".`);
    }

    if (!stdout) {
      throw new Error(`"${tfmPath}" is not found.`);
    }

    return state;
  }

  async end() {
    return;
  }
}

const execute = promisify(execFile);
