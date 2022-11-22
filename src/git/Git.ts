import { GitFile } from "../file/GitFile";
import { GitObjectManager } from "./GitObjectManager";

export interface GitInterface {
  gitFileManager: GitFile;

  gitObjectManager: GitObjectManager;

}

export class Git implements GitInterface {
  gitFileManager: GitFile;

  gitObjectManager: GitObjectManager;

  constructor(rootDir: string) {
    this.gitFileManager = new GitFile(rootDir);
  }

}