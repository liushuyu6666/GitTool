import path from "path";
import fs from "fs";
import { inflateSync } from "zlib";
import { GitCommitObject } from "../interface/GitCommitObject";
import splitBuffer from "../helper/splitBuffer";
import { ObjectInGit } from "./Object";

export class CommitObject extends ObjectInGit implements GitCommitObject {
  treeHash: string;

  parentHash: string;

  message: string;

  authorName: string;

  authorEmail: string;

  committerName: string;

  committerEmail: string;

  constructor(rootDir: string, hash: string) {
    super(rootDir, hash);

    // line 1, type, size and tree hash
    const treeHash = splitBuffer(super.bufChunks[0])[1].toString();
    this.treeHash = treeHash.split(' ')[1];

    // line 2, parent commit hash
    const parentHash = super.bufChunks[1].toString();
    this.parentHash = parentHash.split(' ')[1];

    // line 3, author
    const author = super.bufChunks[2].toString();
    const authorName = author.match(new RegExp('author ([^<]+) <'));
    this.authorName = authorName ? authorName[1] : '';
    const authorEmail = author.match(new RegExp('<([0-9a-zA-Z@.]+)>'));
    this.authorEmail = authorEmail ? authorEmail[1] : '';

    // line 4, committer
    const committer = super.bufChunks[3].toString();
    const committerName = committer.match(new RegExp('committer ([^<]+) <'));
    this.committerName = committerName ? committerName[1] : '';
    const committerEmail = committer.match(new RegExp('<([0-9a-zA-Z@.]+)>'));
    this.committerEmail = committerEmail ? committerEmail[1] : '';

    // line 6, message
    this.message = super.bufChunks[5].toString();
  }
}