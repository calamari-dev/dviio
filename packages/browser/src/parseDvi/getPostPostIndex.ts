export const getPostPostIndex = async (blob: Blob): Promise<number> => {
  let index = blob.size;
  let opcode = 223;

  while (opcode === 223) {
    index--;
    const buffer = await blob.slice(index, index + 1).arrayBuffer();
    opcode = new DataView(buffer).getUint8(0);
  }

  return index - 5;
};
