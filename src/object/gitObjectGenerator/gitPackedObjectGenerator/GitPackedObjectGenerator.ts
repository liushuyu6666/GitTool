import { GitObjectType } from '../../../utils/getGitObjectType';
import generateGitPackObjectsFromFile from '../../../utils/gitObjectGeneration/generateGitPackObjectsFromFile';
import parseAndStoreObject from '../../../utils/gitObjectGeneration/parseAndStoreObject';

export interface GitPackedObjectGeneratorInterface {
  filePathIdx: string;

  filePathPack: string;

  objectPath: string;
}

// TODO: change GitPackPair to GitPackedObjectGenerator
export class GitPackedObjectGenerator
  implements GitPackedObjectGeneratorInterface
{
  filePathIdx: string;

  filePathPack: string;

  objectPath: string;

  constructor(filePathWithoutExtension: string, outObjectDir: string) {
    this.filePathIdx = `${filePathWithoutExtension}.idx`;
    this.filePathPack = `${filePathWithoutExtension}.pack`;
    // TODO: configurable in .env.
    this.objectPath = outObjectDir;
  }

  parseAndStorePackObjects(): Array<[string, GitObjectType]> {
    // This is a BriefObject without extended data
    const gitObjectsAndOffsets = generateGitPackObjectsFromFile(
      this.filePathIdx,
      this.filePathPack,
      this.objectPath,
    );

    const { packOriginalObjects, packDeltaObjects, offsets, swapOffsets } =
      gitObjectsAndOffsets;
    const allPackObjects = packOriginalObjects.concat(packDeltaObjects);

    const arr: Array<[string, GitObjectType]> = [];
    for (const gitObject of allPackObjects) {
      arr.push(parseAndStoreObject(this.objectPath, gitObject, offsets, swapOffsets));
    }

    return arr;
  }
}
