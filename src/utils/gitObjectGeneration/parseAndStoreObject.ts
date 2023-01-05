import path from 'path';
import { GitObject } from '../../object/gitObject/GitObject';
import storeBriefInCSV from '../file/storeBriefInCSV';
import storeDataInFile from '../file/storeDataInFile';
import { GitObjectType } from '../getGitObjectType';

export default function (
  objectPath: string,
  gitObject: GitObject,
  offsets?: Record<string, number>,
  swapOffsets?: Record<number, string>,
): [string, GitObjectType] {
  // TODO: configurable in .env.
  const briefPath = path.join(objectPath, 'briefs.csv');

  storeBriefInCSV(briefPath, gitObject);

  gitObject.differentiating(offsets, swapOffsets);

  if (!gitObject.data) {
    throw new Error(
      `${gitObject.hash}, ${gitObject.type} failed to differentiate`,
    );
  }
  const type: GitObjectType = gitObject.data?.type;
  const hash: string = gitObject.hash;

  // TODO: configurable in .env.
  const outFilePath = path.join(objectPath, gitObject.type);
  storeDataInFile(outFilePath, gitObject);

  return [hash, type];
}
