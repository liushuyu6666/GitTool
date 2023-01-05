import { ManipulateBuffer } from '../../manipulateBuffer/ManipulateBuffer';

export interface GitCopyInstruction {
  offset: number;
  size: number;
}

/**
 * This function only parse the first available chunk as copy instruction from `startIndex`.
 *
 * @param instructions The whole instructions to parse.
 * @param startIndex The start index of the available chunk to be parsed.
 * @returns An array where the first element is a `GitCopyInstruction` and the third one is the `startIndex` of the next chunk if available.
 */
export default function (
  instructions: Buffer,
  startIndex: number,
): [GitCopyInstruction, number] {
  const header = instructions.subarray(startIndex, startIndex + 1).readUInt8();
  let bodyPointer = startIndex + 1;

  // offset
  const offsetsBuffer = new ManipulateBuffer(false);
  for (let i = 0; i < 4; i++) {
    const flag = (header >> i) & 0x01;
    const currBody =
      instructions.subarray(bodyPointer, bodyPointer + 1).readUInt8() & 0xff;
    if (flag === 0x00) {
      offsetsBuffer.fill(0b00000000, 0, 8);
    } else if (flag === 0x01) {
      offsetsBuffer.fill(currBody, 0, 8);
      bodyPointer++;
    } else {
      throw new Error(
        `[parse copy instruction error]: the flag should only be 0 or 1.`,
      );
    }
  }
  const offset = offsetsBuffer.stock.readUint32BE();

  // size
  const sizeBuffer = new ManipulateBuffer(false);
  for (let i = 4; i < 7; i++) {
    const flag = (header >> i) & 0x01;
    const currBody =
      instructions.subarray(bodyPointer, bodyPointer + 1).readUInt8() & 0xff;
    if (flag === 0x00) {
      sizeBuffer.fill(0b00000000, 0, 8);
    } else if (flag === 0x01) {
      sizeBuffer.fill(currBody, 0, 8);
      bodyPointer++;
    } else {
      throw new Error(
        `[parse add instruction error]: the flag should only be 0 or 1.`,
      );
    }
  }
  sizeBuffer.finish();
  const sizeTemp = sizeBuffer.stock.readUint32BE();
  const size = sizeTemp == 0 ? 0x10000 : sizeTemp;

  return [{ offset, size }, bodyPointer];
}
