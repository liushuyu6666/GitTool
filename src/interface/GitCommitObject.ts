import { GitObject } from "./GitObject";

export interface GitCommitObject extends GitObject {
  treeHash: string;

  parentHash: string;

  message: string;

  authorName: string;

  authorEmail: string;

  committerName: string;

  committerEmail: string;
}