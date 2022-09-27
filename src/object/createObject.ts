import { BlobObject } from "../class/BlobObject";
import { CommitObject } from "../class/CommitObject";
import { ObjectInGit } from "../class/Object";
import { TreeObject } from "../class/TreeObject";

export default function (rootDir: string, hash: string): BlobObject | TreeObject | CommitObject {
  const objectInGit = new ObjectInGit(rootDir, hash);

  if (objectInGit.type === 'blob') {
    return new BlobObject(rootDir, hash);
  } else if (objectInGit.type === 'tree') {
    return new TreeObject(rootDir, hash);
  } else if (objectInGit.type === 'commit') {
    return new CommitObject(rootDir, hash);
  } else {
    throw new Error(`${hash} is not a git object`);
  }
}