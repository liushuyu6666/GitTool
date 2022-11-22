import { GitBlobObjectData } from './GitBlobObjectData';
import { GitTreeObjectData } from './GitTreeObjectData';
import { inflateSync } from 'zlib';
import fs from 'fs';
import { GitCommitObjectData } from './GitCommitObjectData';

export enum GitObjectType {
  BLOB = 'blob',
  TREE = 'tree',
  COMMIT = 'commit',
  UNDEFINED = 'undefined',
}

export enum Mode {
  normal = '100644',
  tree = '040000',
}

interface GitObjectInterface {
  hash: string;

  type: GitObjectType;

  size: number;

  data: undefined | GitBlobObjectData | GitTreeObjectData | GitCommitObjectData;

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

  data: undefined | GitBlobObjectData | GitTreeObjectData | GitCommitObjectData;

  constructor({hash, type, size, filePath, bodyOffsetStartIndex, bodyOffsetEndIndex}: GitObjectInput) {
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
    const decryptedBuf = inflateSync(fs.readFileSync(this.filePath));
    const body = decryptedBuf.subarray(this.bodyOffsetStartIndex, this.bodyOffsetEndIndex);
    switch (type) {
      case GitObjectType.BLOB:
        this.data = new GitBlobObjectData(body);
        break;
      case GitObjectType.TREE:
        this.data = new GitTreeObjectData(
          body,
          this.hash,
        );
        break;
      case GitObjectType.COMMIT:
        this.data = new GitCommitObjectData(body);
        break;
      default:
        throw new Error(`${this.hash} can\'t be differentiated in the GitObject.`);
    }
  }
}
