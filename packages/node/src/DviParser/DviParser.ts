import type { Parser, ParserConstructor } from "@dviio/base";
import { FileHandle, open } from "fs/promises";
import { getPostPostPointer } from "./getPostPostPointer";
import { parseDviInstruction } from "./parseDviInstruction";

export const DviParser: ParserConstructor<string, number> = class {
  private handle = null as unknown as FileHandle;
  private buffer = Buffer.alloc(2048);

  constructor(private path: string) {}

  async init() {
    this.handle = await open(this.path, "r");
  }

  finally() {
    return this.handle.close();
  }

  async getPrePointer() {
    return 0;
  }

  getPostPostPointer() {
    return getPostPostPointer(this.handle, this.buffer);
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
