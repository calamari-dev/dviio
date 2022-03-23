import path from "path";
import { FileHandle, open } from "fs/promises";
import { dviio } from "@dviio/base";
import { yaml } from "../index";

const toYaml = dviio(yaml);
let handle: FileHandle;

beforeAll(async () => {
  const dviPath = path.resolve(__dirname, "assets/plain.dvi");
  handle = await open(dviPath, "r");
});

describe("yaml", () => {
  it("without plugin", async () => {
    console.log(await toYaml(handle, 1));
    expect(1).toBe(1);
  });
});
