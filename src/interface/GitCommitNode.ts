export interface GitCommitNodeValues {
  prevHashes: string[];

  nextHashes: string[];

  treeHash: string;
}

export interface GitCommitNode {
  [hash: string] : GitCommitNodeValues;
}