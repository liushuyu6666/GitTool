import fs from 'fs';
import path from 'path';
import { inflateSync } from 'zlib';
import getGitObjectType from '../utils/getGitObjectType';
import splitHeaderAndBody from '../utils/splitHeaderAndBody';
import { GitObject } from './GitObject';

export interface GitOriginalObjectGeneratorInterface {
  filePath: string;

  generateGitOriginalObject(): GitObject
}

/**
 * 
 * @param filePath The file path of the original object, always likes this `${rooDir}/.git/objects/e3/e1dd343baa984e5d704c54404a80de05a5008e`
 */
export class GitOriginalObjectGenerator implements GitOriginalObjectGeneratorInterface {
  filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  generateGitOriginalObject(): GitObject {
    const filePaths: string[] = this.filePath.split(path.sep);
    const suffix = filePaths.pop();
    const prefix = filePaths.pop();
    if (!suffix || !prefix) {
      throw new Error(`GitOriginalObjectGenerator: can\'t get prefix or suffix from the file path ${this.filePath}`);
    }
    const hash = prefix + suffix;

    const decryptedBuf = inflateSync(fs.readFileSync(this.filePath));
    const [header, _] = splitHeaderAndBody(decryptedBuf);
    const headerStr = header.toString();
    const size = parseInt(headerStr.split(' ')[1]);
    const type = getGitObjectType(headerStr.split(' ')[0])

    const bodyOffsetStartIndex = header.length + 1;
    const bodyOffsetEndIndex = decryptedBuf.length;

    return new GitObject({
      hash,
      type,
      size,
      filePath: this.filePath,
      bodyOffsetStartIndex,
      bodyOffsetEndIndex
    })
  }
}