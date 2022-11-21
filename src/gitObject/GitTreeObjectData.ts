import {
  GitTreeObjectFileEntry,
  parseTreeObjectContent,
} from '../utils/gitObjectParse/tree';
import { GitObjectType } from './GitObject';

export interface GitTreeObjectInterface {
  type: GitObjectType.TREE;

  fileEntries: GitTreeObjectFileEntry[];
}

export class GitTreeObjectData implements GitTreeObjectInterface {
  type: GitObjectType.TREE;

  fileEntries: GitTreeObjectFileEntry[];

  constructor(body: Buffer, hash: string) {
    this.type = GitObjectType.TREE;

    this.fileEntries = parseTreeObjectContent(body);
    if (this.fileEntries.length === 0) {
      throw new Error(`chunks in ${hash} less than 3`);
    }
  }
}
