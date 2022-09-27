import { FileEntry } from "./FileEntry";
import { GitObject } from "./GitObject";

export interface GitTreeObject extends GitObject {
  fileEntries: FileEntry[];
}