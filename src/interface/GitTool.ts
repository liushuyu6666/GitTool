import { GitBlobObject } from "./GitBlobObject";
import { GitCommitObject } from "./GitCommitObject";
import { GitTreeObject } from "./GitTreeObject";

export interface GitTool {
  rootDir: string;

  objectDir: string;

  blobObjects: GitBlobObject[];

  treeObjects: GitTreeObject[];

  commitObjects: GitCommitObject[];

}