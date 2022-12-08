import { GitObjectType } from '../utils/getGitObjectType';
import { parseRefDeltaObjectContent, RefDeltaObjectInfo } from '../utils/gitObjectParse/refDelta';

export interface GitRefDeltaObjectDataInterface {
  type: GitObjectType.REF_DELTA;

  refDeltaData: RefDeltaObjectInfo;
}

export class GitRefDeltaObjectData implements GitRefDeltaObjectDataInterface {
  type: GitObjectType.REF_DELTA;

  refDeltaData: RefDeltaObjectInfo;

  constructor(body: Buffer, hash: string) {
    this.type = GitObjectType.REF_DELTA;
    this.refDeltaData = parseRefDeltaObjectContent(body, hash);
  }
}
