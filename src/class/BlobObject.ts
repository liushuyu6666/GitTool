import path from "path";
import fs from "fs";
import { inflateSync } from "zlib";
import { GitBlobObject } from "../interface/GitBlobObject";
import splitBuffer from "../helper/splitBuffer";

export class BlobObject implements GitBlobObject {
  hash: string;

  prefix: string;

  suffix: string;

  /* absolute location of this object */
  objectLoc: string;

  // TODO: should be enum
  type: string;

  size: number;

  content: string;

  constructor(rootDir: string, hash: string) {
    this.hash = hash;
    
    this.prefix = hash.slice(0, 2);
    
    this.suffix = hash.slice(2, hash.length);
    
    this.objectLoc = path.join(rootDir, 'objects', this.prefix, this.suffix);
      
    const rawBuf = fs.readFileSync(this.objectLoc);
    const decryptedBuf = inflateSync(rawBuf);

    const bufChunks: Buffer[] = splitBuffer(decryptedBuf);

    // header
    const header = bufChunks[0];
    this.type = header.toString().split(' ')[0];
    this.size = parseInt(header.toString().split(' ')[1]);

    if (this.type !== 'blob') {
      throw new Error(`${this.hash} is not a blob tree`);
    }
    
    // content
    this.content = bufChunks[1].toString().split('\n')[0];
  }
}