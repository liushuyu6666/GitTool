import { GitTreeObject } from "../interface/GitTreeObject";
import { FileEntry } from "../interface/FileEntry";
import { ObjectInGit } from "./Object";

export class TreeObject extends ObjectInGit implements GitTreeObject {
  fileEntries: FileEntry[];

  constructor(rootDir: string, hash: string) {
    super(rootDir, hash);
    
    if (super.bufChunks.length < 3) {
      throw new Error(`chunks in ${super.hash} less than 3`);
    }

    let modeAndFile = super.bufChunks[1].toString();
    let i = 2;
    this.fileEntries = [];
    while (modeAndFile.length > 0) {
      const hash = super.bufChunks[i].slice(0, 20).toString('hex');
      const fileEntry: FileEntry = {
        'pointer': modeAndFile.split(' ')[1],
        'mode': modeAndFile.split(' ')[0],
        'hash': hash
      }
      this.fileEntries.push(fileEntry);
      modeAndFile = super.bufChunks[i].slice(20).toString();
      i++;
    }
  }
}