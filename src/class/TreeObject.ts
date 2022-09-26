import path from "path";
import fs from "fs";
import { inflateSync } from "zlib";
import { GitTreeObject } from "../interface/GitTreeObject";
import { FileEntry } from "../interface/FileEntry";
import splitBuffer from "../helper/splitBuffer";

export class TreeObject implements GitTreeObject {
  hash: string;

  prefix: string;

  suffix: string;

  /* absolute location of this object */
  objectLoc: string;

  type: string;

  size: number;

  fileEntries: FileEntry[];

  constructor(rootDir: string, hash: string) {
    this.hash = hash;
    
    this.prefix = hash.slice(0, 2);
    
    this.suffix = hash.slice(2, hash.length);
    
    this.objectLoc = path.join(rootDir, 'objects', this.prefix, this.suffix);
      
    const rawBuf = fs.readFileSync(this.objectLoc);
    const decryptedBuf = inflateSync(rawBuf);

    // process tree content
    const bufChunks = splitBuffer(decryptedBuf);
    
    if (bufChunks.length < 3) {
      throw new Error(`chunks in ${this.hash} less than 3`);
    }

    // header
    const header = bufChunks[0];
    this.type = header.toString().split(' ')[0];
    this.size = parseInt(header.toString().split(' ')[1]);
    if (this.type !== 'tree') {
      throw new Error(`${this.hash} is not a tree object`);
    }

    let modeAndFile = bufChunks[1].toString();
    let i = 2;
    this.fileEntries = [];
    while (modeAndFile.length > 0) {
      const hash = bufChunks[i].slice(0, 20).toString('hex');
      const fileEntry: FileEntry = {
        'pointer': modeAndFile.split(' ')[1],
        'mode': modeAndFile.split(' ')[0],
        'hash': hash
      }
      this.fileEntries.push(fileEntry);
      modeAndFile = bufChunks[i].slice(20).toString();
      i++;
    }
  }
}

/*
250
73
176
119
151
35
145
173
88
3
112
80
242
167
95
116
227
103
30
146
49
48
48
54
52
52
32
116
101
115
116
46
116
120
116 
*/