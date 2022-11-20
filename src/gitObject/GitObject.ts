import path from 'path';
import { GitBlobObjectData } from './GitBlobObjectData';
import { GitTreeObjectData } from './GitTreeObjectData';
import { inflateSync } from 'zlib';
import fs from 'fs';
import splitBuffer from '../utils/splitBuffer';
import getGitObjectType from '../utils/getGitObjectType';
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

  prefix: string;

  suffix: string;

  objectLoc: string;

  dividedDecryptedBuffer: Buffer[];

  header: string;

  size: number;

  data: undefined | GitBlobObjectData | GitTreeObjectData | GitCommitObjectData;

  differentiating(): void;
}

export class GitObject implements GitObjectInterface {
  hash: string;

  prefix: string;

  suffix: string;

  objectLoc: string;

  dividedDecryptedBuffer: Buffer[];

  header: string;

  size: number;

  data: undefined | GitBlobObjectData | GitTreeObjectData | GitCommitObjectData;

  constructor(rootDir: string, hash: string) {
    this.hash = hash;

    this.prefix = hash.slice(0, 2);

    this.suffix = hash.slice(2, hash.length);

    this.objectLoc = path.join(
      rootDir,
      '.git',
      'objects',
      this.prefix,
      this.suffix,
    );

    const decryptedBuf = inflateSync(fs.readFileSync(this.objectLoc));

    this.dividedDecryptedBuffer = splitBuffer(decryptedBuf);

    this.header = splitBuffer(this.dividedDecryptedBuffer[0])[0].toString();

    this.size = parseInt(this.header.split(' ')[1]);

    this.data = undefined;
  }

  differentiating() {
    const type = getGitObjectType(this.header.split(' ')[0]);
    switch (type) {
      case GitObjectType.BLOB:
        this.data = new GitBlobObjectData(this.dividedDecryptedBuffer);
        break;
      case GitObjectType.TREE:
        this.data = new GitTreeObjectData(
          this.dividedDecryptedBuffer,
          this.hash,
        );
        break;
      case GitObjectType.COMMIT:
        this.data = new GitCommitObjectData(this.dividedDecryptedBuffer);
        break;
      default:
        throw new Error(`${this.hash} can\'t be differentiated the GitObject.`);
    }
  }
}
