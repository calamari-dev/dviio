import { getPostPostIndex } from "./getPostPostIndex";

it("getPostPostIndex", async () => {
  const res = await fetch(`${location.origin}/assets/platex.dvi`);
  const blob = await res.blob();
  expect(await getPostPostIndex(blob)).toBe(730);
});
