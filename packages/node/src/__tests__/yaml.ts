import path from "path";
import { dviio } from "@dviio/base";
import { yaml } from "../yaml";

const dviPath = path.resolve(__dirname, "assets/plain.dvi");

describe("yaml", () => {
  it("without plugin", async () => {
    const toYaml = dviio(yaml);
    console.log(await toYaml(dviPath, 1));
    expect(1).toBe(1);
  });
});
