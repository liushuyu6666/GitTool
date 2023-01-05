import fs from 'fs';
import path from 'path';
import { inflateSync } from 'zlib';
import { GitObject } from '../../object/gitObject/GitObject';
import getGitObjectType from '../getGitObjectType';
import splitHeaderAndBody from '../splitHeaderAndBody';

export default function (filePath: string): GitObject {
  const filePaths: string[] = filePath.split(path.sep);
  const suffix = filePaths.pop();
  const prefix = filePaths.pop();
  if (!suffix || !prefix) {
    throw new Error(
      `GitOriginalObjectGenerator: can\'t get prefix or suffix from the file path ${filePath}`,
    );
  }
  const hash = prefix + suffix;

  const decryptedBuf = inflateSync(fs.readFileSync(filePath));
  const [header, _] = splitHeaderAndBody(decryptedBuf);
  const headerStr = header.toString();
  const size = parseInt(headerStr.split(' ')[1]);
  const type = getGitObjectType(headerStr.split(' ')[0]);

  const bodyOffsetStartIndex = header.length + 1;
  const bodyOffsetEndIndex = decryptedBuf.length;

  return new GitObject({
    hash,
    type,
    size,
    filePath: filePath,
    bodyOffsetStartIndex,
    bodyOffsetEndIndex,
  });
}
