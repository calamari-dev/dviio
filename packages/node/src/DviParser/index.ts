import type { Parser, ParserConstructor } from "@dviio/base";
import { FileHandle, open } from "fs/promises";
import { getPostPostPosition } from "./getPostPostPosition";
import { parseDviInstruction } from "./parseDviInstruction";

export const DviParser: ParserConstructor<string, number> = class {
  private buffer = Buffer.alloc(2048);

  constructor(private handle: FileHandle) {}

  static async create(path: string) {
    const handle = await open(path, "r");
    return new DviParser(handle);
  }

  finally() {
    return this.handle.close();
  }

  async getPrePosition() {
    return 0;
  }

  getPostPostPosition() {
    return getPostPostPosition(this.handle, this.buffer);
  }

  async parse(pointer: number): ReturnType<Parser<number>["parse"]> {
    const { byteLength, inst } = await parseDviInstruction(
      this.handle,
      pointer,
      this.buffer
    );

    return { next: pointer + byteLength, inst };
  }
};
