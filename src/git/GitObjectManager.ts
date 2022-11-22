import { GitObjectType } from "../gitObject/GitObject";

export interface GitObjectBrief {
  hash: string;

  type: GitObjectType;

  size: number;
}

export interface GitObjectManagerInterface {
  objectBriefs: GitObjectBrief[]; // need to initialize at beginning.

  commitChain: string; // TODO: later, this level, just parse the commit

  treeOrchestration: string; // TODO: later, this level, just parse the tree

  blobContent: string; // TODO: this level, parse blob content, and maybe we need to print out and store in disk
}

export class GitObjectManager implements GitObjectManagerInterface {
  objectBriefs: GitObjectBrief[];


}