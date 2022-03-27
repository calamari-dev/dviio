import path from "path";
import { open } from "fs/promises";
import { dviio } from "@dviio/base";
import { yaml } from "../yaml";

const dviPath = path.resolve(__dirname, "assets/plain.dvi");

describe("yaml", () => {
  it("without plugin", async () => {
    const handle = await open(dviPath, "r");
    const toYaml = dviio(yaml);
    console.log(await toYaml(handle, 1));
    expect(1).toBe(1);
  });
});
