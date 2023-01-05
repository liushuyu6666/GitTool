import { GitObjectType } from '../../utils/getGitObjectType';
import {
  OfsDeltaObjectInfo,
  parseOfsDeltaObjectContent,
} from '../../utils/gitObjectParse/ofsDelta';

export interface GitOfsDeltaObjectDataInterface {
  type: GitObjectType.OFS_DELTA;

  ofsDeltaData: OfsDeltaObjectInfo;
}

export class GitOfsDeltaObjectData implements GitOfsDeltaObjectDataInterface {
  type: GitObjectType.OFS_DELTA;

  ofsDeltaData: OfsDeltaObjectInfo;

  constructor(
    body: Buffer,
    hash: string,
    offsets: Record<string, number>,
    swapOffsets: Record<number, string>,
  ) {
    this.type = GitObjectType.OFS_DELTA;
    this.ofsDeltaData = parseOfsDeltaObjectContent(
      body,
      hash,
      offsets,
      swapOffsets,
    );
  }
}
