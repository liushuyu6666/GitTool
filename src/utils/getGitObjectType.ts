export enum GitObjectType {
  BLOB = 'blob',
  TREE = 'tree',
  COMMIT = 'commit',
  TAG = 'tag',
  BLOB_DELTA = 'blob_delta',
  TREE_DELTA = 'tree_delta',
  COMMIT_DELTA = 'commit_delta',
  TAG_DELTA = 'tag_delta',
  OFS_DELTA = 'ofs_delta',
  REF_DELTA = 'ref_delta',
  UNDEFINED = 'undefined',
}

export const GitPackObjectType: Record<number, GitObjectType> = {
  1: GitObjectType.COMMIT_DELTA,
  2: GitObjectType.TREE_DELTA,
  3: GitObjectType.BLOB_DELTA,
  4: GitObjectType.TAG_DELTA,
  5: GitObjectType.OFS_DELTA,
  6: GitObjectType.REF_DELTA,
};

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
    // if it is number, then it should come from pack file
    return GitPackObjectType[type];
  } else {
    throw new Error(`getGitObjectType error!`);
  }
}

const originalType: Array<GitObjectType> = [
  GitObjectType.BLOB,
  GitObjectType.TREE,
  GitObjectType.COMMIT,
  GitObjectType.TAG,
];

const originalDeltaType: Array<GitObjectType> = [
  GitObjectType.BLOB_DELTA,
  GitObjectType.TREE_DELTA,
  GitObjectType.COMMIT_DELTA,
  GitObjectType.TAG_DELTA,
]

const deltaType: Array<GitObjectType> = [
  GitObjectType.OFS_DELTA,
  GitObjectType.REF_DELTA,
];

export function isOriginalObject(type: GitObjectType): boolean {
  return originalType.includes(type);
}

export function isOriginalDeltaObject(type: GitObjectType): boolean {
  return originalDeltaType.includes(type);
}

export function isDeltaObject(type: GitObjectType): boolean {
  return deltaType.includes(type);
}
