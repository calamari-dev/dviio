import { assert } from "chai";
import { parseDviInstruction } from "./parseDviInstruction";

describe("parseDviInstruction", () => {
  it("FNT_DEF", async () => {
    const res = await fetch(`${location.origin}/assets/hello_world.dvi`);
    const blob = await res.blob();

    assert.deepEqual(await parseDviInstruction(blob, 195), {
      byteLength: 21,
      inst: {
        name: "FNT_DEF",
        fontIndex: 0,
        checksum: 1274110073,
        scaleFactor: 655360,
        designSize: 655360,
        directory: "",
        filename: "cmr10",
      },
    });
  });

  it("PRE", async () => {
    const res = await fetch(`${location.origin}/assets/hello_world.dvi`);
    const blob = await res.blob();

    assert.deepEqual(await parseDviInstruction(blob, 0), {
      byteLength: 42,
      inst: {
        name: "PRE",
        version: 2,
        numer: 25400000,
        denom: 473628672,
        mag: 1000,
        comment: " TeX output 2022.03.06:1116",
      },
    });
  });

  it("POST", async () => {
    const res = await fetch(`${location.origin}/assets/hello_world.dvi`);
    const blob = await res.blob();

    assert.deepEqual(await parseDviInstruction(blob, 166), {
      byteLength: 29,
      inst: {
        name: "POST",
        bopIndex: 42,
        numer: 25400000,
        denom: 473628672,
        mag: 1000,
        maxHeight: 43725786,
        maxWidth: 30785863,
        stackDepth: 2,
        totalPages: 1,
      },
    });
  });

  it("POST_POST", async () => {
    const res = await fetch(`${location.origin}/assets/hello_world.dvi`);
    const blob = await res.blob();

    assert.deepEqual(await parseDviInstruction(blob, 216), {
      byteLength: 6,
      inst: {
        name: "POST_POST",
        version: 2,
        postIndex: 166,
      },
    });
  });
});
