import { GitObject } from './gitObject/GitObject';
import { GitOriginalObjectGenerator } from './gitObjectGenerator/GitOriginalObjectGenerator';
import { GitInDir } from '../file/GitFile';
import { GitObjectType } from '../utils/getGitObjectType';
import createOrAppend from '../utils/createOrAppend';
import path from 'path';
import { GitPackedObjectGenerator } from './gitObjectGenerator/gitPackedObjectGenerator/GitPackedObjectGenerator';

/**
 * GitObjectManager:
 * Manager all git objects.
 * 
 * 1. Initialization:
 *   1) Store hashes of all Blobs, Trees and Commits in the memory. TODO: need to convert hash to hex, not string;
 *   2) Store the {outRootDirs} in the memory.
 *   2) Store all ObjectBriefs in a csv file under {outRootDir}/objects/briefs.csv.
 *   3) Parse all Blob objects and store it under {outRootDir}/objects/blobs.
 *   4) Parse all Tree objects and store it under {outRootDir}/objects/trees.
 *   5) Parse all Commit objects and store it under {outRootDir}/objects/commits.
 */
export interface GitObjectManagerInput {
  inDirs: GitInDir;

  outDir: string;
}

export interface GitObjectManagerInterface {
  /**
   * Original objects consist of all unpacked objects that start with 1 byte hex and packed original objects from pack files.
   * Brief is the `GitObject` before running differentiating.
   */
  // originalObjectBriefs: GitObject[]; // need to initialize at beginning.

  /**
   * Delta objects are all packed delta objects in the pack file under `.git/objects/pack`. They have the type `OBJ_OFS_DELTA` and `OBJ_REF_DELTA`.
   * Brief is the `GitObject` before running differentiating.
   *
   * Property:
   * 1. This variable will stay in the memory for a while before storing in a file.
   */
  // packDeltaObjectBriefs: GitObject[];

  book: Record<GitObjectType, string[]>;

  outObjectDir: string;
}

export interface GitAllObjects {
  allOriginalObjects: GitObject[];
  packDeltaObjects: GitObject[];
}

export class GitObjectManager implements GitObjectManagerInterface {
  book: Record<GitObjectType, string[]>;

  outObjectDir: string;

  constructor({ inDirs, outDir }: GitObjectManagerInput) {
    this.book = {} as unknown as Record<GitObjectType, string[]>;
    // in directory
    const {
      objects: { independentOriginalObjectPaths, packPathsWithoutExtension },
    } = inDirs;

    this.outObjectDir = path.join(outDir, 'objects');

    this.parseAndStoreAllIndependentOriginalObjects(independentOriginalObjectPaths);
    this.parseAndStoreAllPackObjects(packPathsWithoutExtension);
  }

  parseAndStoreAllIndependentOriginalObjects(independentOriginalObjectPaths: string[]): void {
    for (const independent of independentOriginalObjectPaths) {
      const generator = new GitOriginalObjectGenerator(independent, this.outObjectDir);
      const [hash, type] = generator.parseAndStoreIndependentOriginalObject();
      createOrAppend(this.book, type, hash);
    }
  }

  parseAndStoreAllPackObjects(packPathsWithoutExtension: string[]): void {
    for (const pack of packPathsWithoutExtension) {
      const generator = new GitPackedObjectGenerator(pack, this.outObjectDir);
      const arrays = generator.parseAndStorePackObjects();
      arrays.map((arr) => {
        const [hash, type] = arr;
        createOrAppend(this.book, type, hash);
      })
    }
  } 
}
