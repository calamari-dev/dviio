import type { DviInstruction } from "../../../common/src";

export const parseDviInstruction = async (
  blob: Blob,
  index: number
): Promise<{ byteLength: number; inst: DviInstruction }> => {
  const buffer = await blob.slice(index, index + 1).arrayBuffer();
  const opcode = new DataView(buffer).getUint8(0);

  if (opcode <= 151) {
    return { byteLength: 1, inst: { name: "NOP" } };
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
      inst: { name: "X", movement: getUint(view, i) },
    };
  }

  // DOWN
  if (opcode <= 160) {
    const i = opcode - 156;
    const buffer = await blob.slice(index + 1, index + 1 + i).arrayBuffer();
    const view = new DataView(buffer);

    return {
      byteLength: i + 1,
      inst: { name: "DOWN", movement: getUint(view, i) },
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
      inst: { name: "Y", movement: getUint(view, i) },
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
      inst: { name: "Z", movement: getUint(view, i) },
    };
  }

  // FNT_NUM
  if (opcode <= 234) {
    const i = opcode - 234;
    const buffer = await blob.slice(index + 1, index + 1 + i).arrayBuffer();
    const view = new DataView(buffer);

    return {
      byteLength: i + 1,
      inst: { name: "FNT", fontIndex: getUint(view, i) },
    };
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
    // yet
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
        checksum: view.getUint32(i),
        scaleFactor: view.getUint32(i + 4),
        designSize: view.getUint32(i + 8),
        fontIndex: getUint(view, i),
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
        maxHeight: view.getUint32(16),
        maxWidth: view.getUint32(20),
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

const getUint = (
  view: DataView,
  byteLength: number,
  byteOffset = 0
): number => {
  switch (byteLength) {
    case 1:
      return view.getUint8(byteOffset);
    case 2:
      return view.getUint16(byteOffset);
    case 3:
      return 65536 * view.getUint8(byteOffset) + view.getUint16(byteOffset + 4);
    case 4:
      return view.getUint32(byteOffset);
  }

  return -1;
};
