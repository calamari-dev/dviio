import path from "path";
import type { FileHandle } from "fs/promises";
import { open } from "fs/promises";
import { parseDviInstruction } from "./parseDviInstruction";

let handle: FileHandle;

beforeAll(async () => {
  const dviPath = path.resolve(__dirname, "../__tests__/assets/platex.dvi");
  handle = await open(dviPath, "r");
});

describe("parseDviInstruction", () => {
  const buffer = Buffer.alloc(1024);

  it("SET_CHAR_#", async () => {
    expect(await parseDviInstruction(handle, 0x128, buffer)).toEqual({
      byteLength: 1,
      inst: { name: "SET", codePoint: 72 },
    });
  });

  it("SET", async () => {
    expect(await parseDviInstruction(handle, 0x241, buffer)).toEqual({
      byteLength: 3,
      inst: { name: "SET", codePoint: 9267 },
    });
  });

  it("SET_RULE", async () => {
    expect(await parseDviInstruction(handle, 0x1a8, buffer)).toEqual({
      byteLength: 9,
      inst: { name: "SET_RULE", height: 655360, width: 655360 },
    });
  });

  it("PUT_RULE", async () => {
    expect(await parseDviInstruction(handle, 0x1b8, buffer)).toEqual({
      byteLength: 9,
      inst: { name: "PUT_RULE", height: 26214, width: 11877477 },
    });
  });

  it("BOP", async () => {
    expect(await parseDviInstruction(handle, 0x2a, buffer)).toEqual({
      byteLength: 45,
      inst: {
        name: "BOP",
        bopPointer: -1,
        count: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    });
  });

  it("EOP", async () => {
    expect(await parseDviInstruction(handle, 0x26c, buffer)).toEqual({
      byteLength: 1,
      inst: { name: "EOP" },
    });
  });

  it("PUSH", async () => {
    expect(await parseDviInstruction(handle, 0x57, buffer)).toEqual({
      byteLength: 1,
      inst: { name: "PUSH" },
    });
  });

  it("POP", async () => {
    expect(await parseDviInstruction(handle, 0x74, buffer)).toEqual({
      byteLength: 1,
      inst: { name: "POP" },
    });
  });

  it("RIGHT", async () => {
    expect(await parseDviInstruction(handle, 0x133, buffer)).toEqual({
      byteLength: 4,
      inst: { name: "RIGHT", movement: -54614 },
    });
  });

  it("DOWN", async () => {
    expect(await parseDviInstruction(handle, 0x187, buffer)).toEqual({
      byteLength: 4,
      inst: { name: "DOWN", movement: -237825 },
    });
  });

  it("FNT", async () => {
    expect(await parseDviInstruction(handle, 0x127, buffer)).toEqual({
      byteLength: 1,
      inst: { name: "FNT", fontIndex: 18 },
    });
  });

  it("XXX", async () => {
    expect(await parseDviInstruction(handle, 0xed, buffer)).toEqual({
      byteLength: 37,
      inst: { name: "XXX", x: `html:<a href="http://example.org/">` },
    });
  });

  it("FNT_DEF", async () => {
    expect(await parseDviInstruction(handle, 0x28a, buffer)).toEqual({
      byteLength: 20,
      inst: {
        name: "FNT_DEF",
        fontIndex: 54,
        checksum: 3108069800,
        scaleFactor: 393216,
        designSize: 393216,
        directory: "",
        filename: "cmr6",
      },
    });
  });

  it("PRE", async () => {
    expect(await parseDviInstruction(handle, 0, buffer)).toEqual({
      byteLength: 42,
      inst: {
        name: "PRE",
        version: 2,
        numer: 25400000,
        denom: 473628672,
        mag: 1000,
        comment: " TeX output 2022.03.13:1754",
      },
    });
  });

  it("POST", async () => {
    expect(await parseDviInstruction(handle, 0x26d, buffer)).toEqual({
      byteLength: 29,
      inst: {
        name: "POST",
        bopPointer: 42,
        numer: 25400000,
        denom: 473628672,
        mag: 1000,
        maxHeight: 46252776,
        maxWidth: 29689925,
        stackDepth: 8,
        totalPages: 1,
      },
    });
  });

  it("POST_POST", async () => {
    expect(await parseDviInstruction(handle, 0x2da, buffer)).toEqual({
      byteLength: 6,
      inst: { name: "POST_POST", version: 2, postPointer: 621 },
    });
  });
});
