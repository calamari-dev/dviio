import type { Loader } from "@dviio/base";
import { promisify } from "util";
import { execFile } from "child_process";
import path from "path";

export class TfmLoader implements Loader {
  reduce: Loader["reduce"] = async (inst, state) => {
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
  };
}

const execute = promisify(execFile);
