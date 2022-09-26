import { FileEntry } from "./FileEntry";

export interface GitTreeObject {
  hash: string;

  prefix: string;

  suffix: string;

  objectLoc: string;

  // TODO: should be enum
  type: string;

  /* 
    This is the Buffer size of the content;
    Buffer.length != string.length if there are 
    characters whose value larger than 127
  */
  size: number;

  fileEntries: FileEntry[];
}