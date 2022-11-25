import { GitObjectType } from '../utils/getGitObjectType';
import { parseBlobObjectContent } from '../utils/gitObjectParse/blob';

export interface GitBlobObjectInterface {
  type: GitObjectType.BLOB;

  content: string;
}

export class GitBlobObjectData implements GitBlobObjectInterface {
  type: GitObjectType.BLOB;

  content: string;

  constructor(body: Buffer) {
    this.type = GitObjectType.BLOB;
    this.content = parseBlobObjectContent(body);
  }
}
