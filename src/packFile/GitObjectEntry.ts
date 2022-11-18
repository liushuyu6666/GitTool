import { ManipulateBuffer } from "../ManipulateBuffer/ManipulateBuffer";

export interface GitObjectEntryInterface {
  type: number;

  variableLengthInteger: number;

  content: Buffer;

  getAndParseVariableLengthInteger(chunk: Buffer): [number, number];
}

export class GitObjectEntry implements GitObjectEntryInterface {
  
  type: number;

  variableLengthInteger: number;

  content: Buffer;

  constructor(chunk: Buffer) {
    this.type = (chunk[0] & 0b01110000) >> 4 & 0b00000111;

    let contentStartIndex = 0;

    [this.variableLengthInteger, contentStartIndex] = this.getAndParseVariableLengthInteger(chunk);

    this.content = chunk.subarray(contentStartIndex);
  }

  getAndParseVariableLengthInteger(chunk: Buffer): [number, number] {
    const manipulateBuffer = new ManipulateBuffer(false);
    let msb: boolean = chunk[0] > 0b10000000;
    let index = 1;
    manipulateBuffer.fill(chunk[0], 4, 8);
    while (msb) {
      manipulateBuffer.fill(chunk[index], 1, 8);
      msb = chunk[index] > 0b10000000
      index++;
    }
    manipulateBuffer.finish();

    return [manipulateBuffer.readIntBE(), index];
  }
}
