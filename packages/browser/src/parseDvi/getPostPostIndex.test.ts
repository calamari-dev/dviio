import { assert } from "chai";
import { getPostPostIndex } from "./getPostPostIndex";

it("getPostPostIndex", async () => {
  const res = await fetch(`${location.origin}/assets/hello_world.dvi`);
  const blob = await res.blob();
  assert.equal(await getPostPostIndex(blob), 216);
});
