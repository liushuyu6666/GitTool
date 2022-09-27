import { GitBlobObject } from "../interface/GitBlobObject";
import { ObjectInGit } from "./Object";

export class BlobObject extends ObjectInGit implements GitBlobObject{
  content: string;

  constructor(rootDir: string, hash: string) {
    super(rootDir, hash);

    this.content = super.bufChunks[1].toString();
  }
}