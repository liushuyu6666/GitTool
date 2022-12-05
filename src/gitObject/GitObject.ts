import { GitBlobObjectData } from './GitBlobObjectData';
import { GitTreeObjectData } from './GitTreeObjectData';
import { inflateSync } from 'zlib';
import fs from 'fs';
import { GitCommitObjectData } from './GitCommitObjectData';
import {
  GitObjectType,
  isOriginalObject,
  isPackDeltaObject,
  isPackOriginalObject,
} from '../utils/getGitObjectType';
import { GitRefDeltaObjectData } from './GitRefDeltaObjectData';

export enum Mode {
  normal = '100644',
  tree = '040000',
}

export interface GitObjectInterface {
  hash: string;

  type: GitObjectType;

  size: number;

  data:
    | undefined
    | GitBlobObjectData
    | GitTreeObjectData
    | GitCommitObjectData
    | GitRefDeltaObjectData;

  differentiating(): void;
}

export interface GitObjectInput {
  hash: string;

  type: GitObjectType;

  size: number;

  filePath: string;

  bodyOffsetStartIndex: number;

  bodyOffsetEndIndex: number;
}

export class GitObject implements GitObjectInterface {
  hash: string;

  prefix: string;

  suffix: string;

  type: GitObjectType;

  size: number;

  filePath: string;

  bodyOffsetStartIndex: number;

  bodyOffsetEndIndex: number;

  data:
    | undefined
    | GitBlobObjectData
    | GitTreeObjectData
    | GitCommitObjectData
    | GitRefDeltaObjectData;

  constructor({
    hash,
    type,
    size,
    filePath,
    bodyOffsetStartIndex,
    bodyOffsetEndIndex,
  }: GitObjectInput) {
    this.hash = hash ?? '';

    this.prefix = this.hash.slice(0, 2);

    this.suffix = this.hash.slice(2, this.hash.length);

    this.type = type;

    this.size = size;

    this.filePath = filePath;

    this.bodyOffsetStartIndex = bodyOffsetStartIndex;

    this.bodyOffsetEndIndex = bodyOffsetEndIndex;

    this.data = undefined;
  }

  differentiating() {
    const type = this.type;
    const content = fs.readFileSync(this.filePath);

    if (isOriginalObject(type)) {
      const decryptedBuf = inflateSync(content);
      const body = decryptedBuf.subarray(
        this.bodyOffsetStartIndex,
        this.bodyOffsetEndIndex,
      );
      switch (type) {
        case GitObjectType.BLOB:
          this.data = new GitBlobObjectData(body);
          break;
        case GitObjectType.TREE:
          this.data = new GitTreeObjectData(body, this.hash);
          break;
        case GitObjectType.COMMIT:
          this.data = new GitCommitObjectData(body);
          break;
        default:
          throw new Error(
            `${this.hash} can\'t be differentiated in the GitObject.`,
          );
      }
    } else if (isPackOriginalObject(type)) {
      const body = content.subarray(
        this.bodyOffsetStartIndex,
        this.bodyOffsetEndIndex,
      );
      const decryptedBuf = inflateSync(body);
      switch (type) {
        case GitObjectType.BLOB_DELTA:
          this.data = new GitBlobObjectData(decryptedBuf);
          break;
        case GitObjectType.TREE_DELTA:
          this.data = new GitTreeObjectData(decryptedBuf, this.hash);
          break;
        case GitObjectType.COMMIT_DELTA:
          this.data = new GitCommitObjectData(decryptedBuf);
          break;
        default:
          throw new Error(
            `${this.hash} can\'t be differentiated in the GitObject.`,
          );
      }
    } else if (isPackDeltaObject(type)) {
      const body = content.subarray(
        this.bodyOffsetStartIndex,
        this.bodyOffsetEndIndex,
      );
      console.log(body.toString('hex'));
      switch (type) {
        case GitObjectType.REF_DELTA:
          this.data = new GitRefDeltaObjectData(body);
          break;
      }
    }
  }
}
