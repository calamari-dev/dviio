import { assert } from "chai";
import { parseDviInstruction } from "./parseDviInstruction";

describe("parseDviInstruction", () => {
  it("RIGHT", async () => {
    const res = await fetch(`${location.origin}/assets/hyperref.dvi`);
    const blob = await res.blob();

    assert.deepEqual(await parseDviInstruction(blob, 234), {
      byteLength: 4,
      inst: { name: "RIGHT", movement: 983040 },
    });
  });

  it("FNT", async () => {
    const res = await fetch(`${location.origin}/assets/hyperref.dvi`);
    const blob = await res.blob();

    assert.deepEqual(await parseDviInstruction(blob, 346), {
      byteLength: 1,
      inst: { name: "FNT", fontIndex: 27 },
    });
  });

  it("XXX", async () => {
    const res = await fetch(`${location.origin}/assets/hyperref.dvi`);
    const blob = await res.blob();

    assert.deepEqual(await parseDviInstruction(blob, 238), {
      byteLength: 37,
      inst: { name: "XXX", x: `html:<a href="http://example.org/">` },
    });
  });

  it("FNT_DEF", async () => {
    const res = await fetch(`${location.origin}/assets/hyperref.dvi`);
    const blob = await res.blob();

    assert.deepEqual(await parseDviInstruction(blob, 406), {
      byteLength: 22,
      inst: {
        name: "FNT_DEF",
        fontIndex: 27,
        checksum: 1831058770,
        scaleFactor: 655360,
        designSize: 655360,
        directory: "",
        filename: "cmss10",
      },
    });
  });

  it("PRE", async () => {
    const res = await fetch(`${location.origin}/assets/hyperref.dvi`);
    const blob = await res.blob();

    assert.deepEqual(await parseDviInstruction(blob, 0), {
      byteLength: 42,
      inst: {
        name: "PRE",
        version: 2,
        numer: 25400000,
        denom: 473628672,
        mag: 1000,
        comment: " TeX output 2022.03.12:1717",
      },
    });
  });

  it("POST", async () => {
    const res = await fetch(`${location.origin}/assets/hyperref.dvi`);
    const blob = await res.blob();

    assert.deepEqual(await parseDviInstruction(blob, 377), {
      byteLength: 29,
      inst: {
        name: "POST",
        bopIndex: 42,
        numer: 25400000,
        denom: 473628672,
        mag: 1000,
        maxHeight: 41484288,
        maxWidth: 26673152,
        stackDepth: 4,
        totalPages: 1,
      },
    });
  });

  it("POST_POST", async () => {
    const res = await fetch(`${location.origin}/assets/hyperref.dvi`);
    const blob = await res.blob();

    assert.deepEqual(await parseDviInstruction(blob, 449), {
      byteLength: 6,
      inst: { name: "POST_POST", version: 2, postIndex: 377 },
    });
  });
});
