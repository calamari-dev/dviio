import type { FileHandle } from "fs/promises";

type TexFontMetrics = {
  encoding?: string;
  checksum: number;
  designSize: number;
  advanceWidths: { [T in number]?: number };
};

export const parseTfm = async (
  handle: FileHandle,
  buffer: Buffer
): Promise<TexFontMetrics> => {
  if (buffer.byteLength < 44) {
    throw new Error("Given buffer's size is not large enough.");
  }

  await handle.read({ buffer, length: 8, position: 2 });

  const headerLength = buffer.readInt16BE(0) * 4;
  const firstCodepoint = buffer.readInt16BE(2);
  const lastCodepoint = buffer.readInt16BE(4);
  const widthTableLength = buffer.readInt16BE(6) * 4;

  if (buffer.byteLength < widthTableLength) {
    throw new Error("Given buffer's size is not large enough.");
  }

  await handle.read({ buffer, length: 44, position: 24 });

  const checksum = buffer.readUint32BE(0);
  const designSize = buffer.readUint32BE(4);
  const encodingLength = buffer.readUint8(8);
  const encoding = buffer.slice(12, encodingLength + 12).toString("ascii");

  return 0 as unknown as TexFontMetrics;
};
