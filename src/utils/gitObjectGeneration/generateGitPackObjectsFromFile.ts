import { GitObject } from '../../object/gitObject/GitObject';
import { GitIdxFile } from '../../object/gitObjectGenerator/gitPackedObjectGenerator/GitIdxFile';
import { GitPackFile } from '../../object/gitObjectGenerator/gitPackedObjectGenerator/GitPackFile';
import { isPackDeltaObject, isPackOriginalObject } from '../getGitObjectType';
import swapKeyAndValueInRecords from '../records/swapKeyAndValueInRecords';

export interface GitPackObjects {
  packOriginalObjects: GitObject[];
  packDeltaObjects: GitObject[];
}

export interface GitOffsetPair {
  offsets: Record<string, number>;
  swapOffsets: Record<number, string>;
}

export default function (
  filePathIdx: string,
  filePathPack: string,
  outObjectDir: string,
): GitPackObjects & GitOffsetPair {
  const idx = new GitIdxFile(filePathIdx, outObjectDir);
  const pack = new GitPackFile(filePathPack, idx.fanout.offsets);

  const offsets = idx.fanout.offsets;
  const swapOffsets = swapKeyAndValueInRecords(offsets);

  const packOriginalObjects: GitObject[] = [];
  const packDeltaObjects: GitObject[] = [];

  for (const [hash, gitObjectEntry] of Object.entries(pack.layer4)) {
    const type = gitObjectEntry.type;

    if (isPackOriginalObject(type)) {
      packOriginalObjects.push(
        new GitObject({
          hash,
          type,
          size: gitObjectEntry.size,
          filePath: filePathPack,
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
          filePath: filePathPack,
          bodyOffsetStartIndex: gitObjectEntry.bodyStartIndex,
          bodyOffsetEndIndex: gitObjectEntry.bodyEndIndex,
        }),
      );
    } else {
      throw new Error(
        `[Type error]: ${hash} in ${filePathPack} is neither delta nor original type.`,
      );
    }
  }

  return {
    packOriginalObjects,
    packDeltaObjects,
    offsets,
    swapOffsets
  };
}
