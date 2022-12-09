import { ManipulateBuffer } from "./ManipulateBuffer";

/**
 * 
 * @param buffer 
 * @param isBE BE if it is true, otherwise LE
 */
export function getFirstVariableLengthIntegerFromWithType(buffer: Buffer, isBE: boolean): [Buffer, number] {
  const manipulateBuffer = new ManipulateBuffer(isBE);

  let msb: boolean = buffer[0] >= 0b10000000;
  let index = 1;
  manipulateBuffer.fill(buffer[0], 4, 8);
  while (msb) {
    manipulateBuffer.fill(buffer[index], 1, 8);
    msb = buffer[index] >= 0b10000000
    index++;
  }
  manipulateBuffer.finish();

  return [manipulateBuffer.stock, index];
}

/**
 * 
 * @param buffer 
 * @param isBE 
 * @returns 
 */
export function getFirstVariableLengthIntegerFromWithoutType(buffer: Buffer, isBE: boolean): [number, number] {
  const manipulateBuffer = new ManipulateBuffer(isBE);

  let msb: boolean = buffer[0] >= 0b10000000;
  let index = 1;
  manipulateBuffer.fill(buffer[0], 1, 8);
  while (msb) {
    manipulateBuffer.fill(buffer[index], 1, 8);
    msb = buffer[index] >= 0b10000000
    index++;
  }
  manipulateBuffer.finish();

  return [manipulateBuffer.readIntBE(), index];
}