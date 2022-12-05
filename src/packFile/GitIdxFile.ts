import { readFileSync } from 'fs';
import path from 'path';
import { GitFanout } from './GitFanout';

export interface GitIdxFileInterface {
  byteSize: number;

  header: number[];

  versionNumber: number;

  fanout: GitFanout;

  parseHeader(content: Buffer): [number, number, number, number];

  parseVersionNumber(content: Buffer): number

}

export class GitIdxFile implements GitIdxFileInterface {
  // size by bytes
  byteSize: number;

  header: number[];

  versionNumber: number;

  fanout: GitFanout;

  constructor(filePath: string, outDir: string) {
    const fileName = filePath.substring(filePath.lastIndexOf(path.sep));
    const outFile = path.join(outDir, fileName);
    const content = readFileSync(filePath);
    this.byteSize = content.length;
    this.header = this.parseHeader(content);
    this.versionNumber = this.parseVersionNumber(content);
    this.fanout = new GitFanout(content, outFile);
  }

  parseHeader(content: Buffer): [number, number, number, number] {
    // [0, 3] bytes
    return [
      content.readUInt8(0),
      content.readUInt8(1),
      content.readUInt8(2),
      content.readUInt8(3),
    ];
  }

  parseVersionNumber(content: Buffer): number {
    return content.readUInt32BE(4);
  }
}
