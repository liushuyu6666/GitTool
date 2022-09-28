export interface GitCommitNodeValues {
  prevHash: string;

  nextHash: string[];

  treeHash: string;
}

export interface GitCommitNode {
  [hash: string] : GitCommitNodeValues;
}