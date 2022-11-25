import { GitObjectType } from '../utils/getGitObjectType';
import { CommitObjectInfo, parseCommitObjectContent } from '../utils/gitObjectParse/commit';

export interface GitCommitObjectInterface {
  type: GitObjectType.COMMIT;

  commitData: CommitObjectInfo;
}

export class GitCommitObjectData implements GitCommitObjectInterface {
  type: GitObjectType.COMMIT;

  commitData: CommitObjectInfo;

  constructor(body: Buffer) {
    this.type = GitObjectType.COMMIT;
    this.commitData = parseCommitObjectContent(body);
  }
}
