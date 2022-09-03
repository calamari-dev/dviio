import type { Parser, ParserConstructor } from "@dviio/base";
import { FileHandle, open } from "fs/promises";
import { getPostPostPosition } from "./getPostPostPosition";
import { parseDviInstruction } from "./parseDviInstruction";

export const DviParser: ParserConstructor<string, number> = class {
  private buffer = Buffer.alloc(2048);

  constructor(private handle: FileHandle) {}

  static async create(path: string) {
    return new DviParser(await open(path, "r"));
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

  async parse(position: number): ReturnType<Parser<number>["parse"]> {
    const { byteLength, inst } = await parseDviInstruction(
      this.handle,
      position,
      this.buffer
    );

    return { next: position + byteLength, inst };
  }
};
