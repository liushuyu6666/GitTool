import { GitObject } from "./GitObject";

export interface GitCommitObject extends GitObject {
  treeHash: string;

  parentHashes: string[];

  message: string;

  authorName: string;

  authorEmail: string;

  committerName: string;

  committerEmail: string;
}