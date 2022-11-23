import { GitObjectType } from "../gitObject/GitObject";

export const GitNumberObjectType: Record<number, GitObjectType> = {
  1: GitObjectType.COMMIT,
  2: GitObjectType.TREE,
  3: GitObjectType.BLOB,
  4: GitObjectType.TAG,
  5: GitObjectType.OFS_DELTA,
  6: GitObjectType.REF_DELTA,
}

export default function (type: string | number): GitObjectType {
  if (typeof type === 'string') {
    switch (type) {
      case GitObjectType.BLOB:
        return GitObjectType.BLOB;
      case GitObjectType.TREE:
        return GitObjectType.TREE;
      case GitObjectType.COMMIT:
        return GitObjectType.COMMIT;
      case GitObjectType.TAG:
        return GitObjectType.TAG;
      case GitObjectType.OFS_DELTA:
        return GitObjectType.OFS_DELTA;
      case GitObjectType.REF_DELTA:
        return GitObjectType.REF_DELTA;
      default:
        throw new Error(`Can\'t find the GitObjectType: ${type}`);
    }
  } else if (typeof type === 'number') {
    return GitNumberObjectType[type];
  } else {
    throw new Error(`getGitObjectType error!`);
  }
}