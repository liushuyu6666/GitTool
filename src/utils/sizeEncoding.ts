import { ManipulateBuffer } from "../manipulateBuffer/ManipulateBuffer";

export function parseSizeEncoding(chunk: Buffer, startIndex: number): [ManipulateBuffer, number] {
  const targetBuffer = chunk.subarray(startIndex);

  const manipulateBuffer = new ManipulateBuffer(false);
  let currIndex = -1;
  do {
    currIndex++;
    manipulateBuffer.fill(targetBuffer[currIndex], 1, 8);
  } while (targetBuffer[currIndex] > 0b10000000);
  manipulateBuffer.finish();

  return [manipulateBuffer, currIndex + 1];
}