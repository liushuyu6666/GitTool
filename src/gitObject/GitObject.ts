import path from 'path';
import { GitBlobObjectData } from './GitBlobObjectData';
import { GitTreeObjectData } from './GitTreeObjectData';
import { inflateSync } from 'zlib';
import fs from 'fs';
import getGitObjectType from '../utils/getGitObjectType';
import { GitCommitObjectData } from './GitCommitObjectData';
import splitHeaderAndBody from '../utils/splitHeaderAndBody';

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

  type: GitObjectType;

  size: number;

  data: undefined | GitBlobObjectData | GitTreeObjectData | GitCommitObjectData;

  differentiating(): void;
}

export class GitObject implements GitObjectInterface {
  hash: string;

  prefix: string;

  suffix: string;

  type: GitObjectType;

  size: number;

  body: Buffer;

  data: undefined | GitBlobObjectData | GitTreeObjectData | GitCommitObjectData;

  constructor(rootDir: string, hash: string) {
    this.hash = hash;

    this.prefix = hash.slice(0, 2);

    this.suffix = hash.slice(2, hash.length);

    const objectLoc = path.join(
      rootDir,
      '.git',
      'objects',
      this.prefix,
      this.suffix,
    );

    const decryptedBuf = inflateSync(fs.readFileSync(objectLoc));

    const [header, body] = splitHeaderAndBody(decryptedBuf);

    const headerStr = header.toString();

    this.body = body;

    this.size = parseInt(headerStr.split(' ')[1]);

    this.type = getGitObjectType(headerStr.split(' ')[0])

    this.data = undefined;
  }

  differentiating() {
    const type = this.type;
    switch (type) {
      case GitObjectType.BLOB:
        this.data = new GitBlobObjectData(this.body);
        break;
      case GitObjectType.TREE:
        this.data = new GitTreeObjectData(
          this.body,
          this.hash,
        );
        break;
      case GitObjectType.COMMIT:
        this.data = new GitCommitObjectData(this.body);
        break;
      default:
        throw new Error(`${this.hash} can\'t be differentiated the GitObject.`);
    }
  }
}
