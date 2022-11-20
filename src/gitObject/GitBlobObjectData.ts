import { parseBlobObjectContent } from '../utils/gitObjectParse/blob';
import { GitObjectType } from './GitObject';

export interface GitBlobObjectInterface {
  type: GitObjectType.BLOB;

  content: string;
}

export class GitBlobObjectData implements GitBlobObjectInterface {
  type: GitObjectType.BLOB;

  content: string;

  constructor(dividedDecryptedBuffer: Buffer[]) {
    this.type = GitObjectType.BLOB;
    this.content = parseBlobObjectContent(dividedDecryptedBuffer);
  }
}
