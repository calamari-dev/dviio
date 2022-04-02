import type { FileHandle } from "fs/promises";

export const getPostPostPointer = async (
  handle: FileHandle,
  buffer: Buffer
): Promise<number> => {
  let index = (await handle.stat()).size;
  let opcode = 223;

  while (opcode === 223) {
    index--;
    await handle.read({ buffer, length: 1, position: index });
    opcode = buffer.readUint8(0);
  }

  return index - 5;
};
