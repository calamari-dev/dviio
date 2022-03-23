import type { DviInstruction } from "@dviio/base";

export const parseDviInstruction = async (
  blob: Blob,
  index: number
): Promise<{ byteLength: number; inst: DviInstruction }> => {
  const buffer = await blob.slice(index, index + 1).arrayBuffer();
  const opcode = new DataView(buffer).getUint8(0);

  // SET_CHAR_#
  if (opcode <= 127) {
    return { byteLength: 1, inst: { name: "SET", codePoint: opcode } };
  }

  // SET
  if (opcode <= 131) {
    const i = opcode - 127;
    const buffer = await blob.slice(index + 1, index + 1 + i).arrayBuffer();
    const view = new DataView(buffer);

    return {
      byteLength: i + 1,
      inst: { name: "SET", codePoint: getUint(view, i) },
    };
  }

  // SET_RULE
  if (opcode === 132) {
    const buffer = await blob.slice(index + 1, index + 9).arrayBuffer();
    const view = new DataView(buffer);

    return {
      byteLength: 9,
      inst: {
        name: "SET_RULE",
        height: view.getInt32(0),
        width: view.getInt32(4),
      },
    };
  }

  // PUT
  if (opcode <= 136) {
    const i = opcode - 132;
    const buffer = await blob.slice(index + 1, index + 1 + i).arrayBuffer();
    const view = new DataView(buffer);

    return {
      byteLength: i + 1,
      inst: { name: "PUT", codePoint: getUint(view, i) },
    };
  }

  // PUT_RULE
  if (opcode === 137) {
    const buffer = await blob.slice(index + 1, index + 9).arrayBuffer();
    const view = new DataView(buffer);

    return {
      byteLength: 9,
      inst: {
        name: "PUT_RULE",
        height: view.getInt32(0),
        width: view.getInt32(4),
      },
    };
  }

  // NOP
  if (opcode === 138) {
    return { byteLength: 1, inst: { name: "NOP" } };
  }

  // BOP
  if (opcode === 139) {
    const buffer = await blob.slice(index + 1, index + 45).arrayBuffer();
    const view = new DataView(buffer);
    const count = [] as unknown as (DviInstruction & { name: "BOP" })["count"];

    for (let i = 0; i < 10; i++) {
      count[i] = view.getInt32(4 * i);
    }

    return {
      byteLength: 45,
      inst: { name: "BOP", bopIndex: view.getInt32(40), count },
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
    const buffer = await blob.slice(index + 1, index + 1 + i).arrayBuffer();
    const view = new DataView(buffer);

    return {
      byteLength: i + 1,
      inst: { name: "RIGHT", movement: getInt(view, i) },
    };
  }

  // W0
  if (opcode === 147) {
    return { byteLength: 1, inst: { name: "W" } };
  }

  // W1, ..., W4
  if (opcode <= 151) {
    const i = opcode - 147;
    const buffer = await blob.slice(index + 1, index + 1 + i).arrayBuffer();
    const view = new DataView(buffer);

    return {
      byteLength: i + 1,
      inst: { name: "W", movement: getInt(view, i) },
    };
  }

  // X0
  if (opcode === 152) {
    return { byteLength: 1, inst: { name: "X" } };
  }

  // X1, ..., X4
  if (opcode <= 156) {
    const i = opcode - 152;
    const buffer = await blob.slice(index + 1, index + 1 + i).arrayBuffer();
    const view = new DataView(buffer);

    return {
      byteLength: i + 1,
      inst: { name: "X", movement: getInt(view, i) },
    };
  }

  // DOWN
  if (opcode <= 160) {
    const i = opcode - 156;
    const buffer = await blob.slice(index + 1, index + 1 + i).arrayBuffer();
    const view = new DataView(buffer);

    return {
      byteLength: i + 1,
      inst: { name: "DOWN", movement: getInt(view, i) },
    };
  }

  // Y0
  if (opcode === 161) {
    return { byteLength: 1, inst: { name: "Y" } };
  }

  // Y1, ..., Y4
  if (opcode <= 165) {
    const i = opcode - 161;
    const buffer = await blob.slice(index + 1, index + 1 + i).arrayBuffer();
    const view = new DataView(buffer);

    return {
      byteLength: i + 1,
      inst: { name: "Y", movement: getInt(view, i) },
    };
  }

  // Z0
  if (opcode === 166) {
    return { byteLength: 1, inst: { name: "Z" } };
  }

  // Z1, ..., Z4
  if (opcode <= 170) {
    const i = opcode - 166;
    const buffer = await blob.slice(index + 1, index + 1 + i).arrayBuffer();
    const view = new DataView(buffer);

    return {
      byteLength: i + 1,
      inst: { name: "Z", movement: getInt(view, i) },
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
    const buffer = await blob.slice(index + 1, index + 1 + i).arrayBuffer();
    const view = new DataView(buffer);

    return {
      byteLength: i + 1,
      inst: { name: "FNT", fontIndex: getUint(view, i) },
    };
  }

  // XXX
  if (opcode <= 242) {
    const i = opcode - 238;
    const buffer = await blob.slice(index + 1, index + 1 + i).arrayBuffer();
    const view = new DataView(buffer);
    const k = getUint(view, i);

    return {
      byteLength: i + k + 1,
      inst: {
        name: "XXX",
        x: await blob.slice(index + i + 1, index + i + k + 1).text(),
      },
    };
  }

  // FNT_DEF
  if (opcode <= 246) {
    const i = opcode - 242;
    const buffer = await blob.slice(index + 1, index + i + 15).arrayBuffer();
    const view = new DataView(buffer);
    const a = view.getUint8(i + 12);
    const l = view.getUint8(i + 13);
    const path = await blob
      .slice(index + i + 15, index + i + 15 + a + l)
      .text();

    return {
      byteLength: i + 15 + a + l,
      inst: {
        name: "FNT_DEF",
        fontIndex: getUint(view, i),
        checksum: view.getUint32(i),
        scaleFactor: view.getUint32(i + 4),
        designSize: view.getUint32(i + 8),
        directory: path.slice(0, a),
        filename: path.slice(a),
      },
    };
  }

  // PRE
  if (opcode === 247) {
    const buffer = await blob.slice(index + 1, index + 15).arrayBuffer();
    const view = new DataView(buffer);
    const k = view.getUint8(13);

    return {
      byteLength: k + 15,
      inst: {
        name: "PRE",
        version: view.getUint8(0),
        numer: view.getUint32(1),
        denom: view.getUint32(5),
        mag: view.getUint32(9),
        comment: await blob.slice(index + 15, index + 15 + k).text(),
      },
    };
  }

  // POST
  if (opcode === 248) {
    const buffer = await blob.slice(index + 1, index + 29).arrayBuffer();
    const view = new DataView(buffer);

    return {
      byteLength: 29,
      inst: {
        name: "POST",
        bopIndex: view.getUint32(0),
        numer: view.getUint32(4),
        denom: view.getUint32(8),
        mag: view.getUint32(12),
        maxHeight: view.getInt32(16),
        maxWidth: view.getInt32(20),
        stackDepth: view.getUint16(24),
        totalPages: view.getUint16(26),
      },
    };
  }

  // POST_POST
  if (opcode === 249) {
    const buffer = await blob.slice(index + 1, index + 6).arrayBuffer();
    const view = new DataView(buffer);

    return {
      byteLength: 6,
      inst: {
        name: "POST_POST",
        postIndex: view.getUint32(0),
        version: view.getUint8(4),
      },
    };
  }

  return { byteLength: 1, inst: { name: "UNDEFINED", opcode } };
};

const getInt = (view: DataView, byteLength: number): number => {
  switch (byteLength) {
    case 1:
      return view.getInt8(0);
    case 2:
      return view.getInt16(0);
    case 4:
      return view.getInt32(0);
  }

  if (byteLength === 3) {
    let k = view.getUint16(1);
    k += 0x10000 * view.getUint8(0);
    return k < 0x800000 ? k : k - 0x1000000;
  }

  return -1;
};

const getUint = (view: DataView, byteLength: number): number => {
  switch (byteLength) {
    case 1:
      return view.getUint8(0);
    case 2:
      return view.getUint16(0);
    case 4:
      return view.getUint32(0);
  }

  if (byteLength === 3) {
    let k = view.getUint16(1);
    k += 0x10000 * view.getUint8(0);
    return k;
  }

  return -1;
};
