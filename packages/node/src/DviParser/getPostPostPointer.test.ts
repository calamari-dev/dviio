import path from "path";
import { open } from "fs/promises";
import { getPostPostPointer } from "./getPostPostPointer";

it("getPostPostPointer", async () => {
  const dviPath = path.resolve(__dirname, "../__tests__/assets/platex.dvi");
  const handle = await open(dviPath, "r");
  expect(await getPostPostPointer(handle, Buffer.alloc(1))).toBe(730);
});
