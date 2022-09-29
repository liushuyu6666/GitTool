import { GitBlobObject } from "./GitBlobObject";
import { GitCommitNode } from "./GitCommitNode";
import { GitCommitObject } from "./GitCommitObject";
import { GitTreeObject } from "./GitTreeObject";

export interface GitTool {
  rootDir: string;

  objectDir: string;

  allObjects: string[];

  blobObjects: GitBlobObject[];

  treeObjects: GitTreeObject[];

  rootTreeObjects: GitTreeObject[];

  rootTreeHashes: string[];

  commitObjects: GitCommitObject[];

  commitNodes: GitCommitNode;

}