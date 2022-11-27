import { GitObject } from '../gitObject/GitObject';
import { GitOriginalObjectGenerator } from '../gitObject/GitOriginalObjectGenerator';
import { GitPackPair } from '../packFile/GitPackPair';
import fs from 'fs';
import { GitInDir, GitOutDir } from '../file/GitFile';
import path from 'path';
import { storeDataInFile } from '../utils/file/file';

export interface GitObjectManagerInput {
  inDirs: GitInDir;

  outDirs: GitOutDir;
}

export interface GitObjectManagerInterface {
  /**
   * Original objects consist of all unpacked objects that start with 1 byte hex and packed original objects from pack files.
   * Brief is the `GitObject` before running differentiating.
   */
  originalObjectBriefs: GitObject[]; // need to initialize at beginning.

  /**
   * Delta objects are all packed delta objects in the pack file under `.git/objects/pack`. They have the type `OBJ_OFS_DELTA` and `OBJ_REF_DELTA`.
   * Brief is the `GitObject` before running differentiating.
   *
   * Property:
   * 1. This variable will stay in the memory for a while before storing in a file.
   */
  packDeltaObjectBriefs: GitObject[];

  // commitChain: string; // TODO: later, this level, just parse the commit

  // treeOrchestration: string; // TODO: later, this level, just parse the tree

  // blobContent: string; // TODO: this level, parse blob content, and maybe we need to print out and store in disk
}

export class GitObjectManager implements GitObjectManagerInterface {
  // TODO: still need to think which value need to store here.
  // TODO: some variable can be get from the json file. if we set update = false, we should get it from the json file.
  originalObjectBriefs: GitObject[];

  packDeltaObjectBriefs: GitObject[];

  // commitChain: string;

  // treeOrchestration: string;

  // blobContent: string;

  constructor({ inDirs, outDirs }: GitObjectManagerInput) {
    // out directory
    const { objectDir } = outDirs;

    // in directory
    const {
      objects: { independentOriginalObjectPaths, packPathsWithoutExtension },
    } = inDirs;

    this.originalObjectBriefs = this.listAllOriginalObjectBriefs(
      independentOriginalObjectPaths,
      packPathsWithoutExtension,
    );

    this.packDeltaObjectBriefs = this.listPackDeltaObjectBriefsQuickly(
      packPathsWithoutExtension,
      objectDir,
      false,
    );
  }

  listIndependentOriginalObjectBriefs(
    independentOriginalObjectPaths: string[],
  ): GitObject[] {
    return independentOriginalObjectPaths.map((unpacked) =>
      new GitOriginalObjectGenerator(unpacked).generateGitOriginalObject(),
    );
  }

  listPackOriginalObjectBriefs(
    packPathsWithoutExtension: string[],
  ): GitObject[] {
    let objects: GitObject[] = [];

    packPathsWithoutExtension.forEach((filePath) => {
      const packPair = new GitPackPair(`${filePath}.idx`, `${filePath}.pack`);
      objects = objects.concat(packPair.generateGitOriginalObject());
    });

    return objects;
  }

  listAllOriginalObjectBriefs(
    independentOriginalObjectPaths: string[],
    packPathsWithoutExtension: string[],
  ): GitObject[] {
    const originalObjects = this.listIndependentOriginalObjectBriefs(
      independentOriginalObjectPaths,
    );
    const packObjects = this.listPackOriginalObjectBriefs(
      packPathsWithoutExtension,
    );
    return originalObjects.concat(packObjects);
  }

  listAllOriginalObjectBriefsQuickly(
    independentOriginalObjectPaths: string[],
    packPathsWithoutExtension: string[],
    objectDir: string,
    updateOrNot: boolean,
  ): GitObject[] {
    // TODO: should be configurable, and should be prepared by FileManager.
    const originalObjectBriefsPath = path.join(
      objectDir,
      'originalObjectBriefs.json',
    );
    const fileExists = fs.existsSync(originalObjectBriefsPath);

    // If file exists and no need to update, just read from the file.
    if (fileExists && !updateOrNot) {
      const deltaObjectBriefs = JSON.parse(
        fs.readFileSync(originalObjectBriefsPath).toString(),
      ) as unknown as GitObject[];
      return deltaObjectBriefs;
    }

    // Otherwise, generate a new one and save into file.
    const originalObjectBriefs = this.listAllOriginalObjectBriefs(
      independentOriginalObjectPaths,
      packPathsWithoutExtension,
    );
    storeDataInFile(originalObjectBriefsPath, originalObjectBriefs);
    return originalObjectBriefs;
  }

  listPackDeltaObjectBriefs(packPathsWithoutExtension: string[]): GitObject[] {
    let objects: GitObject[] = [];

    packPathsWithoutExtension.forEach((filePath) => {
      const packPair = new GitPackPair(`${filePath}.idx`, `${filePath}.pack`);
      objects = objects.concat(packPair.generateGitDeltaObject());
    });

    return objects;
  }

  listPackDeltaObjectBriefsQuickly(
    packPathsWithoutExtension: string[],
    objectDir: string,
    updateOrNot: boolean,
  ): GitObject[] {
    // TODO: should be configurable, and should be prepared by FileManager.
    const deltaObjectBriefsPath = path.join(
      objectDir,
      'deltaObjectBriefs.json',
    );
    const fileExists = fs.existsSync(deltaObjectBriefsPath);

    // If file exists and no need to update, just read from the file.
    if (fileExists && !updateOrNot) {
      const deltaObjectBriefs = JSON.parse(
        fs.readFileSync(deltaObjectBriefsPath).toString(),
      ) as unknown as GitObject[];
      return deltaObjectBriefs;
    }

    // Otherwise, generate a new one and save into file.
    const deltaObjectBriefs = this.listPackDeltaObjectBriefs(
      packPathsWithoutExtension,
    );
    storeDataInFile(deltaObjectBriefsPath, deltaObjectBriefs);
    return deltaObjectBriefs;
  }

  // getSizeInTotal(objectBriefs: GitObject[]): number {
  //   return objectBriefs.reduce(
  //     (accumulator, currentValue) => accumulator + currentValue.size,
  //     0,
  //   );
  // }
}
