import { GitObject } from '../gitObject/GitObject';
import { GitOriginalObjectGenerator } from '../gitObject/GitOriginalObjectGenerator';
import { GitPackPair } from '../packFile/GitPackPair';

export interface GitObjectManagerInput {
  originalObjectFilePaths: string[];

  packPathsWithoutExtension: string[];
}

export interface GitObjectManagerInterface {
  objectBriefs: GitObject[]; // need to initialize at beginning.

  sizeInTotal: number;

  // commitChain: string; // TODO: later, this level, just parse the commit

  // treeOrchestration: string; // TODO: later, this level, just parse the tree

  // blobContent: string; // TODO: this level, parse blob content, and maybe we need to print out and store in disk
}

export class GitObjectManager implements GitObjectManagerInterface {
  objectBriefs: GitObject[];

  sizeInTotal: number;

  // commitChain: string;

  // treeOrchestration: string;

  // blobContent: string;

  constructor({
    originalObjectFilePaths,
    packPathsWithoutExtension,
  }: GitObjectManagerInput) {
    this.objectBriefs = this.listAllObjects(
      originalObjectFilePaths,
      packPathsWithoutExtension,
    );
    this.sizeInTotal = this.getSizeInTotal(this.objectBriefs);
  }

  listAllObjects(
    originalObjectFilePaths: string[],
    packPathsWithoutExtension: string[],
  ): GitObject[] {
    const originalObjects = this.listOriginalGitObjects(
      originalObjectFilePaths,
    );
    const packObjects = this.listPackGitObjects(packPathsWithoutExtension);
    return originalObjects.concat(packObjects);
  }

  listOriginalGitObjects(originalObjectFilePaths: string[]): GitObject[] {
    return originalObjectFilePaths.map((original) =>
      new GitOriginalObjectGenerator(original).generateGitOriginalObject(),
    );
  }

  listPackGitObjects(packPathsWithoutExtension: string[]): GitObject[] {
    let objects: GitObject[] = [];

    packPathsWithoutExtension.forEach((filePath) => {
      const packPair = new GitPackPair(`${filePath}.idx`, `${filePath}.pack`);
      objects = objects.concat(packPair.generateGitOriginalObject());
    });

    return objects;
  }

  getSizeInTotal(objectBriefs: GitObject[]) {
    return objectBriefs.reduce(
      (accumulator, currentValue) => accumulator + currentValue.size,
      0,
    );
  }
}
