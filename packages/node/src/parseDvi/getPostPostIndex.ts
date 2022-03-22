import type { FileHandle } from "fs/promises";

export const getPostPostIndex = async (handle: FileHandle): Promise<number> => {
  const buffer = Buffer.alloc(1);
  let index = (await handle.stat()).size;
  let opcode = 223;

  while (opcode === 223) {
    index--;
    await handle.read({ buffer, length: 1, position: index });
    opcode = buffer.readUint8(0);
  }

  return index - 5;
};
