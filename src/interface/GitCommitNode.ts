export interface GitCommitNodeValues {
  prevHashes: string[];

  nextHashes: string[];

  treeHash: string;

  authorName: string;

  authorTimestamp: string;

  authorTimezone: string;

  message: string;
}

export interface GitCommitNode {
  [hash: string] : GitCommitNodeValues;
}