import path from 'path';
import { listAllSubordinatesDFS } from '../utils/file/file';
import fs from 'fs';

export interface GitFileInterface {
  rootDir: string;

  outDirs: GitOutDir;

  inDirs: GitInDir;

  listIndependentOriginalObjectPathsUnderObjectsFolder(objectsDir: string): string[];

  listPackPathsWithoutExtensionUnderObjectsFolder(objectsDir: string): string[];

  listInfoPathsUnderObjectsFolder(objectsDir: string): string[];

  createInDir(rootDir: string): GitInDir;

  createOutDir(outDir: string): GitOutDir;
}

export interface GitInDir {
  objects: GitInDirObjects;
}

export interface GitInDirObjects {
  objectsDir: string;

  /**
   * Paths of all unpacked objects that start with 1 byte hex. The are under `.git/objects/` but not exist in `.git/objects/info` or `.git/objects/pack`.
   * Should be relative path if the rootDir is the relative path; otherwise, absolute path.
   */
  independentOriginalObjectPaths: string[];

  /**
   * Paths of all pack object that start with `pack`. The are under `.git/objects/pack`.
   * Should be relative path if the rootDir is the relative path; otherwise, absolute path.
   * The `.idx` always pairs with `.pack`. So the path has no extension.
   */
  packPathsWithoutExtension: string[];

  /**
   * Paths of all pack object that start with `info`. The are under `.git/objects/info`.
   * Should be relative path if the rootDir is the relative path; otherwise, absolute path.
   */
  infoPaths: string[];
}

export interface GitOutDir {
  outDir: string;
  objectDir: string;
}

export class GitFile implements GitFileInterface {
  rootDir: string;

  outDirs: GitOutDir;

  inDirs: GitInDir;

  constructor(rootDir: string, outDir: string) {
    this.rootDir = rootDir;
    this.inDirs = this.createInDir(rootDir);
    this.outDirs = this.createOutDir(outDir);
  }

  listIndependentOriginalObjectPathsUnderObjectsFolder(objectsDir: string): string[] {
    return listAllSubordinatesDFS(objectsDir, [], [/^info$/, /^pack$/]);
  }

  listPackPathsWithoutExtensionUnderObjectsFolder(objectsDir: string): string[] {
    const files = listAllSubordinatesDFS(
      objectsDir,
      [],
      [/^info$/, /^[0-9a-z]{2}$/],
    );

    const noExtension = files.map((file) => {
      const lastIndex = file.lastIndexOf('.');
      return file.substring(0, lastIndex);
    });

    const set = new Set(noExtension);

    return Array.from(set.values());
  }

  listInfoPathsUnderObjectsFolder(objectsDir: string): string[] {
    return listAllSubordinatesDFS(
      objectsDir,
      [],
      [/^pack$/, /^[0-9a-z]{2}$/],
    );
  }

  listSubordinatesUnderObjects(objectsDir: string): string[] {
    return listAllSubordinatesDFS(objectsDir, [], []);
  }

  createInDir(rootDir: string): GitInDir {
    const gitDir = path.join(rootDir, '.git');
    const objectsDir = path.join(gitDir, 'objects');

    const independentOriginalObjectPaths = this.listIndependentOriginalObjectPathsUnderObjectsFolder(objectsDir);
    const packPathsWithoutExtension = this.listPackPathsWithoutExtensionUnderObjectsFolder(objectsDir);
    const infoPaths = this.listInfoPathsUnderObjectsFolder(objectsDir);

    const inDirObjects: GitInDirObjects = {
      objectsDir,
      independentOriginalObjectPaths,
      packPathsWithoutExtension,
      infoPaths
    }

    const inDir: GitInDir = {
      objects: inDirObjects,
    }

    return inDir;
  }

  createOutDir(outDir: string): GitOutDir {
    const outDirR = outDir.length > 0 ? outDir : './outDir';
    // TODO: configurable in the .env
    const objectDir = path.join(outDirR, 'objects');

    const outDirs = [outDirR, objectDir];

    outDirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    })

    return {
      'outDir': outDirR,
      'objectDir': objectDir,
    };
  }
}
