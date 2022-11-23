import { GitObject } from "../gitObject/GitObject";
import { GitIdxFile } from "./GitIdxFile";
import { GitPackFile } from "./GitPackFile";

export interface GitPackPairInterface {
  pack: GitPackFile;

  idx: GitIdxFile;
}

export class GitPackPair implements GitPackPairInterface{
  pack: GitPackFile;

  idx: GitIdxFile;

  filePathIdx: string;

  filePathPack: string;

  constructor(filePathIdx: string, filePathPack: string) {
    this.filePathIdx = filePathIdx;
    this.filePathPack = filePathPack;
    this.idx = new GitIdxFile(filePathIdx);
    this.pack = new GitPackFile(filePathPack, this.idx.fanout.offsets);
  }

  generateGitOriginalObject(): GitObject[] {
    const gitObjects: GitObject[] = [];

    for (const [hash, gitObjectEntry] of Object.entries(this.pack.layer4)) {
      const object = new GitObject({
        hash,
        type: gitObjectEntry.type,
        size: gitObjectEntry.size,
        filePath: this.filePathPack,
        bodyOffsetStartIndex: gitObjectEntry.bodyStartIndex,
        bodyOffsetEndIndex: gitObjectEntry.bodyEndIndex,
      })
      gitObjects.push(object);
    }

    return gitObjects;
  }
}