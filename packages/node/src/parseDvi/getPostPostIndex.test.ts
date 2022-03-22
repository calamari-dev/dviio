import path from "path";
import { open } from "fs/promises";
import { getPostPostIndex } from "./getPostPostIndex";

it("getPostPostIndex", async () => {
  const dviPath = path.resolve(__dirname, "../__tests__/assets/platex.dvi");
  const handle = await open(dviPath, "r");
  expect(await getPostPostIndex(handle)).toBe(730);
});
