import type { FileHandle } from "fs/promises";
import type { ParserInstruction } from "@dviio/base";
import { Buffer } from "buffer";

export const parseDviInstruction = async (
  handle: FileHandle,
  index: number,
  buffer: Buffer
): Promise<{ byteLength: number; inst: ParserInstruction<number> }> => {
  await handle.read({ buffer, length: 1, position: index });
  const opcode = buffer.readUint8(0);

  // SET_CHAR_#
  if (opcode <= 127) {
    return { byteLength: 1, inst: { name: "SET", codePoint: opcode } };
  }

  // SET
  if (opcode <= 131) {
    const i = opcode - 127;
    await handle.read({ buffer, length: i, position: index + 1 });

    return {
      byteLength: i + 1,
      inst: { name: "SET", codePoint: readUint(buffer, i) },
    };
  }

  // SET_RULE
  if (opcode === 132) {
    await handle.read({ buffer, length: 8, position: index + 1 });

    return {
      byteLength: 9,
      inst: {
        name: "SET_RULE",
        height: buffer.readInt32BE(0),
        width: buffer.readInt32BE(4),
      },
    };
  }

  // PUT
  if (opcode <= 136) {
    const i = opcode - 132;
    await handle.read({ buffer, length: i, position: index + 1 });

    return {
      byteLength: i + 1,
      inst: { name: "PUT", codePoint: readUint(buffer, i) },
    };
  }

  // PUT_RULE
  if (opcode === 137) {
    await handle.read({ buffer, length: 8, position: index + 1 });

    return {
      byteLength: 9,
      inst: {
        name: "PUT_RULE",
        height: buffer.readInt32BE(0),
        width: buffer.readInt32BE(4),
      },
    };
  }

  // NOP
  if (opcode === 138) {
    return { byteLength: 1, inst: { name: "NOP" } };
  }

  // BOP
  if (opcode === 139) {
    await handle.read({ buffer, length: 44, position: index + 1 });
    const count = [] as unknown as (ParserInstruction<number> & {
      name: "BOP";
    })["count"];

    for (let i = 0; i < 10; i++) {
      count[i] = buffer.readInt32BE(4 * i);
    }

    return {
      byteLength: 45,
      inst: { name: "BOP", bopPointer: buffer.readInt32BE(40), count },
    };
  }

  switch (opcode) {
    case 140: // EOP
      return { byteLength: 1, inst: { name: "EOP" } };

    case 141: // PUSH
      return { byteLength: 1, inst: { name: "PUSH" } };

    case 142: // POP
      return { byteLength: 1, inst: { name: "POP" } };
  }

  // RIGHT
  if (opcode <= 146) {
    const i = opcode - 142;
    await handle.read({ buffer, length: i, position: index + 1 });

    return {
      byteLength: i + 1,
      inst: { name: "RIGHT", movement: readInt(buffer, i) },
    };
  }

  // W0
  if (opcode === 147) {
    return { byteLength: 1, inst: { name: "W" } };
  }

  // W1, ..., W4
  if (opcode <= 151) {
    const i = opcode - 147;
    await handle.read({ buffer, length: i, position: index + 1 });

    return {
      byteLength: i + 1,
      inst: { name: "W", movement: readInt(buffer, i) },
    };
  }

  // X0
  if (opcode === 152) {
    return { byteLength: 1, inst: { name: "X" } };
  }

  // X1, ..., X4
  if (opcode <= 156) {
    const i = opcode - 152;
    await handle.read({ buffer, length: i, position: index + 1 });

    return {
      byteLength: i + 1,
      inst: { name: "X", movement: readInt(buffer, i) },
    };
  }

  // DOWN
  if (opcode <= 160) {
    const i = opcode - 156;
    await handle.read({ buffer, length: i, position: index + 1 });

    return {
      byteLength: i + 1,
      inst: { name: "DOWN", movement: readInt(buffer, i) },
    };
  }

  // Y0
  if (opcode === 161) {
    return { byteLength: 1, inst: { name: "Y" } };
  }

  // Y1, ..., Y4
  if (opcode <= 165) {
    const i = opcode - 161;
    await handle.read({ buffer, length: i, position: index + 1 });

    return {
      byteLength: i + 1,
      inst: { name: "Y", movement: readInt(buffer, i) },
    };
  }

  // Z0
  if (opcode === 166) {
    return { byteLength: 1, inst: { name: "Z" } };
  }

  // Z1, ..., Z4
  if (opcode <= 170) {
    const i = opcode - 166;
    await handle.read({ buffer, length: i, position: index + 1 });

    return {
      byteLength: i + 1,
      inst: { name: "Z", movement: readInt(buffer, i) },
    };
  }

  // FNT_NUM
  if (opcode <= 234) {
    const fontIndex = opcode - 171;
    return { byteLength: 1, inst: { name: "FNT", fontIndex } };
  }

  // FNT
  if (opcode <= 238) {
    const i = opcode - 234;
    await handle.read({ buffer, length: i, position: index + 1 });

    return {
      byteLength: i + 1,
      inst: { name: "FNT", fontIndex: readUint(buffer, i) },
    };
  }

  // XXX
  if (opcode <= 242) {
    const i = opcode - 238;
    await handle.read({ buffer, length: i, position: index + 1 });
    const k = readUint(buffer, i);

    if (k > buffer.byteLength) {
      throw new Error("Given buffer's size is not large enough.");
    }

    await handle.read({ buffer, length: k, position: index + i + 1 });

    return {
      byteLength: i + k + 1,
      inst: { name: "XXX", x: buffer.slice(0, k).toString("utf8") },
    };
  }

  // FNT_DEF
  if (opcode <= 246) {
    const i = opcode - 242;
    await handle.read({ buffer, length: i + 14, position: index + 1 });
    const a = buffer.readUint8(i + 12);
    const l = buffer.readUint8(i + 13);
    const part = {
      name: "FNT_DEF",
      fontIndex: readUint(buffer, i),
      checksum: buffer.readUint32BE(i),
      scaleFactor: buffer.readUint32BE(i + 4),
      designSize: buffer.readUint32BE(i + 8),
    } as const;

    if (a + l > buffer.byteLength) {
      throw new Error("Given buffer's size is not large enough.");
    }

    await handle.read({ buffer, length: a + l, position: index + i + 15 });
    const path = buffer.slice(0, a + l).toString("utf8");

    return {
      byteLength: i + 15 + a + l,
      inst: { ...part, directory: path.slice(0, a), filename: path.slice(a) },
    };
  }

  // PRE
  if (opcode === 247) {
    await handle.read({ buffer, length: 14, position: index + 1 });
    const k = buffer.readUint8(13);
    const part = {
      name: "PRE",
      version: buffer.readUint8(0),
      numer: buffer.readUint32BE(1),
      denom: buffer.readUint32BE(5),
      mag: buffer.readUint32BE(9),
    } as const;

    if (k > buffer.byteLength) {
      throw new Error("Given buffer's size is not large enough.");
    }

    await handle.read({ buffer, length: k, position: index + 15 });
    const comment = buffer.slice(0, k).toString("utf8");

    return {
      byteLength: k + 15,
      inst: { ...part, comment },
    };
  }

  // POST
  if (opcode === 248) {
    await handle.read({ buffer, length: 28, position: index + 1 });

    return {
      byteLength: 29,
      inst: {
        name: "POST",
        bopPointer: buffer.readUint32BE(0),
        numer: buffer.readUint32BE(4),
        denom: buffer.readUint32BE(8),
        mag: buffer.readUint32BE(12),
        maxHeight: buffer.readInt32BE(16),
        maxWidth: buffer.readInt32BE(20),
        stackDepth: buffer.readUint16BE(24),
        totalPages: buffer.readUint16BE(26),
      },
    };
  }

  // POST_POST
  if (opcode === 249) {
    await handle.read({ buffer, length: 5, position: index + 1 });

    return {
      byteLength: 6,
      inst: {
        name: "POST_POST",
        postPointer: buffer.readUint32BE(0),
        version: buffer.readUint8(4),
      },
    };
  }

  return { byteLength: 1, inst: { name: "UNDEFINED", opcode } };
};

const readInt = (buffer: Buffer, byteLength: number): number => {
  switch (byteLength) {
    case 1:
      return buffer.readInt8(0);
    case 2:
      return buffer.readInt16BE(0);
    case 4:
      return buffer.readInt32BE(0);
  }

  if (byteLength === 3) {
    let k = buffer.readUint16BE(1);
    k += 0x10000 * buffer.readUint8(0);
    return k < 0x800000 ? k : k - 0x1000000;
  }

  return NaN;
};

const readUint = (buffer: Buffer, byteLength: number): number => {
  switch (byteLength) {
    case 1:
      return buffer.readUint8(0);
    case 2:
      return buffer.readUint16BE(0);
    case 4:
      return buffer.readUint32BE(0);
  }

  if (byteLength === 3) {
    let k = buffer.readUint16BE(1);
    k += 0x10000 * buffer.readUint8(0);
    return k;
  }

  return NaN;
};
