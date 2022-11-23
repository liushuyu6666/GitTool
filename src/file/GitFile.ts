import path from 'path';
import { listAllSubordinatesDFS } from '../utils/file/file';

export interface GitFileInterface {
  rootDir: string;

  gitDir: string;

  objectsDir: string;

  originalGitObjectsPaths: string[];

  packPathsWithoutExtension: string[];

  infoPaths: string[];

  allObjectPaths: string[];
}

export class GitFile implements GitFileInterface {
  rootDir: string;

  gitDir: string;

  objectsDir: string;

  originalGitObjectsPaths: string[];

  packPathsWithoutExtension: string[];

  infoPaths: string[];

  allObjectPaths: string[];

  constructor(rootDir: string) {
    this.rootDir = rootDir;
    this.gitDir = path.join(this.rootDir, '.git');
    this.objectsDir = path.join(this.gitDir, 'objects');
    this.originalGitObjectsPaths = this.listAllOriginalGitObjects();
    this.packPathsWithoutExtension = this.listAllPacks();
    this.infoPaths = this.listAllInfos();
    this.allObjectPaths = this.listAllSubordinatesUnderObjects()
  }

  listAllOriginalGitObjects(): string[] {
    return listAllSubordinatesDFS(this.objectsDir, [], [/^info$/, /^pack$/]);
  }

  listAllPacks(): string[] {
    const files = listAllSubordinatesDFS(this.objectsDir, [], [/^info$/, /^[0-9a-z]{2}$/]);

    const noExtension = files.map((file) => {
      const lastIndex = file.lastIndexOf('.');
      return file.substring(0, lastIndex);
    });

    const set = new Set(noExtension);

    return Array.from(set.values());
  }

  listAllInfos(): string[] {
    return listAllSubordinatesDFS(this.objectsDir, [], [/^pack$/, /^[0-9a-z]{2}$/]);
  }

  listAllSubordinatesUnderObjects(): string[] {
    return listAllSubordinatesDFS(this.objectsDir, [], []);
  }
}