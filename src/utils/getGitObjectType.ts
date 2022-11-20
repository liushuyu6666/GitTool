import { GitObjectType } from "../gitObject/GitObject";

export default function (type: string): GitObjectType {
  switch (type) {
    case GitObjectType.BLOB:
      return GitObjectType.BLOB;
    case GitObjectType.TREE:
      return GitObjectType.TREE;
    case GitObjectType.COMMIT:
      return GitObjectType.COMMIT;
    default:
      throw new Error(`Can\'t find the GitObjectType: ${type}`);
  }
}