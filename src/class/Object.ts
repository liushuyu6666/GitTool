import path from "path";
import fs from "fs";
import { inflateSync } from "zlib";
import splitBuffer from "../helper/splitBuffer";

export class ObjectInGit {
  hash: string;

  prefix: string;

  suffix: string;

  objectLoc: string;

  bufChunks: Buffer[];

  type: string;

  size: number;

  constructor(rootDir: string, hash: string) {
    this.hash = hash;
    
    this.prefix = hash.slice(0, 2);
    
    this.suffix = hash.slice(2, hash.length);
    
    this.objectLoc = path.join(rootDir, '.git', 'objects', this.prefix, this.suffix);
      
    const decryptedBuf = inflateSync(fs.readFileSync(this.objectLoc));

    this.bufChunks = splitBuffer(decryptedBuf);

    const header = splitBuffer(this.bufChunks[0])[0].toString();

    this.type = header.split(' ')[0];
    this.size = parseInt(header.split(' ')[1]);
  }
}