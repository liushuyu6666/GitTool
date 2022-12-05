import { GitObject } from '../gitObject/GitObject';
import { isPackDeltaObject, isPackOriginalObject } from '../utils/getGitObjectType';
import { GitIdxFile } from './GitIdxFile';
import { GitPackFile } from './GitPackFile';

export interface GitPackPairInterface {
  pack: GitPackFile;

  idx: GitIdxFile;
}

export interface GitPackObjects {
  packOriginalObjects: GitObject[];
  packDeltaObjects: GitObject[];
}

export class GitPackPair implements GitPackPairInterface {
  pack: GitPackFile;

  idx: GitIdxFile;

  filePathIdx: string;

  filePathPack: string;

  constructor(filePathIdx: string, filePathPack: string, outPackPath: string) {
    this.filePathIdx = filePathIdx;
    this.filePathPack = filePathPack;
    this.idx = new GitIdxFile(filePathIdx, outPackPath);
    this.pack = new GitPackFile(filePathPack, this.idx.fanout.offsets);
  }

  generateGitPackObjects(): GitPackObjects {
    const packOriginalObjects: GitObject[] = [];
    const packDeltaObjects: GitObject[] = [];

    for (const [hash, gitObjectEntry] of Object.entries(this.pack.layer4)) {
      const type = gitObjectEntry.type;

      if (isPackOriginalObject(type)) {
        packOriginalObjects.push(
          new GitObject({
            hash,
            type,
            size: gitObjectEntry.size,
            filePath: this.filePathPack,
            bodyOffsetStartIndex: gitObjectEntry.bodyStartIndex,
            bodyOffsetEndIndex: gitObjectEntry.bodyEndIndex,
          }),
        );
      } else if (isPackDeltaObject(type)) {
        packDeltaObjects.push(
          new GitObject({
            hash,
            type,
            size: gitObjectEntry.size,
            filePath: this.filePathPack,
            bodyOffsetStartIndex: gitObjectEntry.bodyStartIndex,
            bodyOffsetEndIndex: gitObjectEntry.bodyEndIndex,
          }),
        );
      }
    }

    return {
      packOriginalObjects,
      packDeltaObjects,
    };
  }

  // generateGitOriginalObject(): GitObject[] {
  //   const gitObjects: GitObject[] = [];

  //   for (const [hash, gitObjectEntry] of Object.entries(this.pack.layer4)) {
  //     const type = gitObjectEntry.type;

  //     if (isOriginalDeltaObject(type)) {
  //       gitObjects.push(
  //         new GitObject({
  //           hash,
  //           type,
  //           size: gitObjectEntry.size,
  //           filePath: this.filePathPack,
  //           bodyOffsetStartIndex: gitObjectEntry.bodyStartIndex,
  //           bodyOffsetEndIndex: gitObjectEntry.bodyEndIndex,
  //         }),
  //       );
  //     }
  //   }

  //   return gitObjects;
  // }

  // TODO: maybe we can combine generateGitDeltaObject with generateGitOriginalObject
  // generateGitDeltaObject(): GitObject[] {
  //   const gitObjects: GitObject[] = [];

  //   for (const [hash, gitObjectEntry] of Object.entries(this.pack.layer4)) {
  //     const type = gitObjectEntry.type;

  //     if (isDeltaObject(type)) {
  //       gitObjects.push(
  //         new GitObject({
  //           hash,
  //           type,
  //           size: gitObjectEntry.size,
  //           filePath: this.filePathPack,
  //           bodyOffsetStartIndex: gitObjectEntry.bodyStartIndex,
  //           bodyOffsetEndIndex: gitObjectEntry.bodyEndIndex,
  //         }),
  //       );
  //     }
  //   }

  //   return gitObjects;
  // }
}
