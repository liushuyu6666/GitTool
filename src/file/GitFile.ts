import path from 'path';
import { listAllSubordinatesDFS } from '../utils/file/file';

export interface GitFileInterface {
  rootDir: string;

  gitDir: string;

  objectsDir: string;

  originalGitObjectsPaths: string[];

  packPaths: string[];

  infoPaths: string[];

  allObjectPaths: string[];
}

export class GitFile implements GitFileInterface {
  rootDir: string;

  gitDir: string;

  objectsDir: string;

  originalGitObjectsPaths: string[];

  packPaths: string[];

  infoPaths: string[];

  allObjectPaths: string[];

  constructor(rootDir: string) {
    this.rootDir = rootDir;
    this.gitDir = path.join(this.rootDir, '.git');
    this.objectsDir = path.join(this.gitDir, 'objects');
    this.originalGitObjectsPaths = this.listAllOriginalGitObjects();
    this.packPaths = this.listAllPacks();
    this.infoPaths = this.listAllInfos();
    this.allObjectPaths = this.listAllSubordinatesUnderObjects()
  }

  listAllOriginalGitObjects(): string[] {
    return listAllSubordinatesDFS(this.objectsDir, [], [/^info$/, /^pack$/]);
  }

  listAllPacks(): string[] {
    return listAllSubordinatesDFS(this.objectsDir, [], [/^info$/, /^[0-9a-z]{2}$/]);
  }

  listAllInfos(): string[] {
    return listAllSubordinatesDFS(this.objectsDir, [], [/^pack$/, /^[0-9a-z]{2}$/]);
  }

  listAllSubordinatesUnderObjects(): string[] {
    return listAllSubordinatesDFS(this.objectsDir, [], []);
  }
}