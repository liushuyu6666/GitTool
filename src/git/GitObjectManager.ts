import { GitObject, GitObjectInput } from '../gitObject/GitObject';
import { GitOriginalObjectGenerator } from '../gitObject/GitOriginalObjectGenerator';
import { GitPackObjects, GitPackPair } from '../packFile/GitPackPair';
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
}

export interface GitAllObjects {
  allOriginalObjects: GitObject[];
  packDeltaObjects: GitObject[];
}

export class GitObjectManager implements GitObjectManagerInterface {
  originalObjectBriefs: GitObject[];

  packDeltaObjectBriefs: GitObject[];

  constructor({ inDirs, outDirs }: GitObjectManagerInput) {
    // out directory
    const { objectDir, packDir } = outDirs;

    // in directory
    const {
      objects: { independentOriginalObjectPaths, packPathsWithoutExtension },
    } = inDirs;

    const { allOriginalObjects, packDeltaObjects } =
      this.listAllObjectBriefsQuickly(
        independentOriginalObjectPaths,
        packPathsWithoutExtension,
        objectDir,
        packDir,
        true,
      );

    this.originalObjectBriefs = allOriginalObjects;
    this.packDeltaObjectBriefs = packDeltaObjects;
  }

  // list all objects brief under .git/objects/
  listAllObjectBriefsQuickly(
    independentOriginalObjectPaths: string[],
    packPathsWithoutExtension: string[],
    objectDir: string,
    packDir: string,
    updateOrNot: boolean,
  ): GitAllObjects {
    // TODO: should be configurable, and should be prepared by FileManager.
    const originalObjectBriefsPath = path.join(
      objectDir,
      'originalObjectBriefs.json',
    );
    const deltaObjectBriefsPath = path.join(
      objectDir,
      'deltaObjectBriefs.json',
    );

    const originalFileExists = fs.existsSync(originalObjectBriefsPath);
    const deltaFileExists = fs.existsSync(deltaObjectBriefsPath);

    if (originalFileExists && deltaFileExists && !updateOrNot) {
      // If both file paths exist and no need to update
      const allOriginalObjects = this.readBriefFromFile(
        originalObjectBriefsPath,
      );
      const packDeltaObjects = this.readBriefFromFile(deltaObjectBriefsPath);

      return {
        allOriginalObjects,
        packDeltaObjects,
      };
    } else if (originalFileExists && !deltaFileExists && !updateOrNot) {
      // If original file exists but delta file doesn't
      const allOriginalObjects = this.readBriefFromFile(
        originalObjectBriefsPath,
      );
      const { packDeltaObjects } = this.listPackObjectBriefs(
        packPathsWithoutExtension,
        packDir
      );
      storeDataInFile(deltaObjectBriefsPath, packDeltaObjects);

      return {
        allOriginalObjects,
        packDeltaObjects,
      };
    } else {
      // need to update both files
      const independentOriginalObjects =
        this.listIndependentOriginalObjectBriefs(
          independentOriginalObjectPaths,
        );
      const { packDeltaObjects, packOriginalObjects } =
        this.listPackObjectBriefs(packPathsWithoutExtension, packDir);

      const allOriginalObjects =
        independentOriginalObjects.concat(packOriginalObjects);

      storeDataInFile(originalObjectBriefsPath, allOriginalObjects);
      storeDataInFile(deltaObjectBriefsPath, packDeltaObjects);

      return {
        allOriginalObjects,
        packDeltaObjects,
      };
    }
  }

  // list all object briefs under .git/objects/ whose prefix are 1 byte hex.
  listIndependentOriginalObjectBriefs(
    independentOriginalObjectPaths: string[],
  ): GitObject[] {
    return independentOriginalObjectPaths.map((unpacked) =>
      new GitOriginalObjectGenerator(unpacked).generateGitOriginalObject(),
    );
  }

  // list all object briefs under .git/objects/pack/
  listPackObjectBriefs(
    packPathsWithoutExtension: string[],
    packDir: string,
  ): GitPackObjects {
    let gitPackOriginalObjects: GitObject[] = [];
    let gitPackDeltaObjects: GitObject[] = [];

    packPathsWithoutExtension.map((filePath) => {
      const packPair = new GitPackPair(
        `${filePath}.idx`,
        `${filePath}.pack`,
        packDir,
      );
      const { packOriginalObjects, packDeltaObjects } =
        packPair.generateGitPackObjects();
      gitPackOriginalObjects =
        gitPackOriginalObjects.concat(packOriginalObjects);
      gitPackDeltaObjects = gitPackDeltaObjects.concat(packDeltaObjects);
    });

    return {
      packOriginalObjects: gitPackOriginalObjects,
      packDeltaObjects: gitPackDeltaObjects,
    };
  }

  readBriefFromFile(path: string): GitObject[] {
    const briefs = JSON.parse(
      fs.readFileSync(path).toString(),
    ) as unknown as GitObjectInput[];
    return briefs.map(
      (brief) =>
        new GitObject({
          hash: brief.hash,
          type: brief.type,
          size: brief.size,
          filePath: brief.filePath,
          bodyOffsetStartIndex: brief.bodyOffsetStartIndex,
          bodyOffsetEndIndex: brief.bodyOffsetEndIndex,
        }),
    );
  }
}
