import { ManipulateBuffer } from "../manipulateBuffer/ManipulateBuffer";
import getGitObjectType, { GitObjectType } from "../utils/getGitObjectType";

export interface GitObjectEntryInterface {
  type: GitObjectType;

  size: number;

  bodyStartIndex: number;

  bodyEndIndex: number;

  getSize(chunk: Buffer): [number, number];
}

export class GitObjectEntry implements GitObjectEntryInterface {
  type: GitObjectType;

  size: number;

  bodyStartIndex: number;

  bodyEndIndex: number;

  constructor(content: Buffer, startIndex: number, endIndex: number) {
    const chunk = content.subarray(startIndex, endIndex);

    const typeNumber = (chunk[0] & 0b01110000) >> 4 & 0b00000111;

    this.type = getGitObjectType(typeNumber);

    [this.size, this.bodyStartIndex] = this.getSize(chunk);

    this.bodyEndIndex = endIndex;
  }

  // TODO: ManipulateBuffer should be recycled.
  getSize(chunk: Buffer): [number, number] {
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