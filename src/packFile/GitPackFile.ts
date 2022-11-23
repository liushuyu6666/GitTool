import { readFileSync } from 'fs';
import { Offset } from './GitFanout';
import { GitObjectEntry } from './GitObjectEntry';

// export interface PackInfo {
//   type: number;
//   info: string;
// }

export interface GitPackInterfaceFile {
  size: number;

  // 'PACK'
  layer1: string;

  // version
  layer2: number;

  // object hex list
  layer3: number;

  // data chunk
  layer4: Record<string, GitObjectEntry>;

  // checksum
  layer5: Buffer;

  // layer 1: [0, 4)
  parseLayer1(content: Buffer): string;
  // layer 2: [4, 8)
  parseLayer2(content: Buffer): number;

  // layer 3: [8, 12)
  parseLayer3(content: Buffer): number;

  parseLayer4(offsets: Record<string, number>, content: Buffer): Record<string, GitObjectEntry>;

  parseLayer5(content: Buffer): Buffer;
}

// TODO: need setter and getter
export class GitPackFile implements GitPackInterfaceFile {
  size: number;

  // 'PACK'
  layer1: string;

  // version
  layer2: number;

  // object hex list
  layer3: number;

  // data chunk
  layer4: Record<string, GitObjectEntry>;

  // checksum
  layer5: Buffer;

  constructor(filePath: string, offsets: Record<string, number>) {
    const content = readFileSync(filePath);
    this.size = content.length;
    this.layer1 = this.parseLayer1(content);
    this.layer2 = this.parseLayer2(content);
    this.layer3 = this.parseLayer3(content);
    this.layer4 = this.parseLayer4(offsets, content);
    this.layer5 = this.parseLayer5(content);
  }

  // layer 1: [0, 4)
  parseLayer1(content: Buffer): string {
    return content.subarray(0, 4).toString('utf-8');
  }

  // layer 2: [4, 8)
  parseLayer2(content: Buffer): number {
    return content.subarray(4, 8).readUInt32BE();
  }

  // layer 3: [8, 12)
  parseLayer3(content: Buffer): number {
    return content.subarray(8, 12).readUInt32BE();
  }

  parseLayer4(offsets: Record<string, number>, content: Buffer): Record<string, GitObjectEntry> {
    // create offsetArray
    const offsetArray: Offset[] = [];
    Object.entries(offsets).forEach(([hex, offset]) => {
      offsetArray.push({
        hex,
        offset
      })
    })

    // sort offsetArray ascending
    // offsetArray.length = offsets.length + 1
    offsetArray.sort((prev, next) => prev.offset - next.offset);
    offsetArray.push({
      hex: '',
      offset: content.length - 20 // this is the endIndex of the last object entry
    })

    const gitPackObjectEntry: Record<string, GitObjectEntry> = {};
    for (let i = 0; i < Object.keys(offsets).length; i++) {
      const startIndex = offsetArray[i].offset;
      const endIndex = offsetArray[i + 1].offset;
      const hex = offsetArray[i].hex;
      const entry = new GitObjectEntry(content, startIndex, endIndex);
      gitPackObjectEntry[hex] = entry;
    }
    return gitPackObjectEntry;
  }

  parseLayer5(content: Buffer): Buffer {
    return content.subarray(content.length - 20);
  }
}
