import { GitCommitObject } from "../interface/GitCommitObject";
import { ObjectInGit } from "./Object";

export class CommitObject extends ObjectInGit implements GitCommitObject {
  treeHash: string;

  parentHashes: string[];

  message: string;

  authorName: string;

  authorEmail: string;

  committerName: string;

  committerEmail: string;

  constructor(rootDir: string, hash: string) {
    super(rootDir, hash);

    const content = this.bufChunks[1].toString();

    // get tree object hash
    const treeHash = content.match(new RegExp('tree ([0-9a-f]{40})\n'));
    this.treeHash = treeHash ? treeHash[1] : '';
    
    // get parent hash
    const parentHashes = [...content.matchAll(new RegExp(/parent ([0-9a-f]{40})/g))];
    this.parentHashes = parentHashes.map((parentHash) => parentHash[1]);

    // get author name and email
    const authorName = content.match(new RegExp('author ([^<]+) <'));
    this.authorName = authorName ? authorName[1] : '';
    const authorEmail = content.match(new RegExp('<([a-zA-Z0-9@.]+)>'));
    this.authorEmail = authorEmail ? authorEmail[1] : '';

    // get author name and email
    const committerName = content.match(new RegExp('author ([^<]+) <'));
    this.committerName = committerName ? committerName[1] : '';
    const committerEmail = content.match(new RegExp('<([a-zA-Z0-9@.]+)>'));
    this.committerEmail = committerEmail ? committerEmail[1] : '';

    // message
    const message = content.match(new RegExp('\n\n(.+)\n'));
    this.message = message ? message[1] : '';
  }
}