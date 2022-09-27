import path from "path";
import fs from "fs";
import { inflateSync } from "zlib";
import { GitCommitObject } from "../interface/GitCommitObject";
import { FileEntry } from "../interface/FileEntry";
import splitBuffer from "../helper/splitBuffer";

export class CommitObject implements GitCommitObject {
  hash: string;

  prefix: string;

  suffix: string;

  /* absolute location of this object */
  objectLoc: string;

  type: string;

  size: number;

  treeHash: string;

  parentHash: string;

  message: string;

  authorName: string;

  authorEmail: string;

  committerName: string;

  committerEmail: string;

  constructor(rootDir: string, hash: string) {
    this.hash = hash;
    
    this.prefix = hash.slice(0, 2);
    
    this.suffix = hash.slice(2, hash.length);
    
    this.objectLoc = path.join(rootDir, 'objects', this.prefix, this.suffix);
      
    const rawBuf = fs.readFileSync(this.objectLoc);
    const decryptedBuf = inflateSync(rawBuf);

    // process tree content
    const bufChunks: Buffer[] = splitBuffer(decryptedBuf, '\n');

    // line 1, type, size and tree hash
    const header = splitBuffer(bufChunks[0])[0].toString();
    const treeHash = splitBuffer(bufChunks[0])[1].toString();
    this.type = header.split(' ')[0];
    this.size = parseInt(header.split(' ')[1]);
    this.treeHash = treeHash.split(' ')[1];

    // line 2, parent commit hash
    const parentHash = bufChunks[1].toString();
    this.parentHash = parentHash.split(' ')[1];

    // line 3, author
    const author = bufChunks[2].toString();
    const authorName = author.match(new RegExp('author ([^<]+) <'));
    this.authorName = authorName ? authorName[1] : '';
    const authorEmail = author.match(new RegExp('<([0-9a-zA-Z@.]+)>'));
    this.authorEmail = authorEmail ? authorEmail[1] : '';

    // line 4, committer
    const committer = bufChunks[3].toString();
    const committerName = committer.match(new RegExp('committer ([^<]+) <'));
    this.committerName = committerName ? committerName[1] : '';
    const committerEmail = committer.match(new RegExp('<([0-9a-zA-Z@.]+)>'));
    this.committerEmail = committerEmail ? committerEmail[1] : '';

    // line 6, message
    this.message = bufChunks[5].toString();
  }
}