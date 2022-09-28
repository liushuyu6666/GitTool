import { readdirSync } from "fs";
import path from "path";
import { GitBlobObject } from "../interface/GitBlobObject";
import { GitCommitObject } from "../interface/GitCommitObject";
import { GitTool } from "../interface/GitTool";
import { GitTreeObject } from "../interface/GitTreeObject";
import isValidPrefix from "../helper/isValidPrefix";
import createObject from "../object/createObject";
import { BlobObject } from "./BlobObject";
import { TreeObject } from "./TreeObject";
import { CommitObject } from "./CommitObject";
import { GitCommitNode } from "../interface/GitCommitNode";

export class Git implements GitTool {
  rootDir: string;

  objectDir: string;

  allObjects: string[] = [];

  blobObjects: GitBlobObject[] = [];

  treeObjects: GitTreeObject[] = [];

  commitObjects: GitCommitObject[] = [];

  commitNodes: GitCommitNode = {};

  constructor(rootDir: string) {
    this.rootDir = rootDir;

    this.objectDir = path.join(rootDir, '.git', 'objects');

    this.allObjects = this.listObjects();

    this.allObjects.forEach((hash) => {
      const obj = createObject(this.rootDir, hash);
      if (obj.type === 'blob') this.blobObjects.push(obj as BlobObject);
      if (obj.type === 'tree') this.treeObjects.push(obj as TreeObject);
      if (obj.type === 'commit') this.commitObjects.push(obj as CommitObject);
    })

    this.commitObjects.forEach((commit) => {
      const hash: string = commit.hash;
      const parents = commit.parentHashes;
      const treeHash = commit.treeHash;

      // check commit object itself
      if (!this.commitNodes[hash]) {
        this.commitNodes[hash] = {
          prevHashes: parents,
          nextHashes: [],
          treeHash: treeHash,
        }
      } else {
        this.commitNodes[hash].prevHashes = this.commitNodes[hash].prevHashes.concat(parents);
        this.commitNodes[hash].treeHash = treeHash;
      }

      // check parent commit
      if (parents.length > 0) {
        commit.parentHashes.forEach((parent) => {
          if (!this.commitNodes[parent]) {
            this.commitNodes[parent] = {
              prevHashes: [],
              nextHashes: [hash],
              treeHash: '',
            }
          } else {
            this.commitNodes[parent].nextHashes.push(hash);
          }
        })
      }
    })

  }

  listObjects(): string[] {
    const objectPrefix: string[] = readdirSync(this.objectDir);

    const validPrefix = objectPrefix.filter((prefix) => isValidPrefix(prefix));

    const objects: string[] = [];
    validPrefix.forEach((prefix) => {
      const subDir = path.join(this.objectDir, prefix);
      const suffixes = readdirSync(subDir);

      suffixes.forEach((suffix) => {
        const full: string = prefix + suffix;
        objects.push(full);
      })
    })

    return objects;
  }

  listTypes(): Record<string, Array<string>> {
    return {
      'blob': this.blobObjects.map((blob) => blob.hash),
      'tree': this.treeObjects.map((tree) => tree.hash),
      'commit': this.commitObjects.map((commit) => commit.hash),
    };
  }
}