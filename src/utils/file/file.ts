import fs from 'fs';
import path from 'path';
import { exactMatchArray } from '../regex/exactMatch';

/**
 * 
 * @param dir The directory to start, all file paths will be counted under this folder.
 * @param filePaths The initial file paths, always an empty array.
 * @param filterRegexToExclude An array of all directory names to exclude.
 * @returns 
 */
export function listAllSubordinatesDFS(dir: string, filePaths: string[], filterRegexToExclude: RegExp[]): string[] {
  const currFolder = dir.split(path.sep).pop();
  if (currFolder && exactMatchArray(currFolder, filterRegexToExclude)) {
    return filePaths;
  }

  const subordinates = fs.readdirSync(dir, {
    encoding: null,
    withFileTypes: true,
  });

  const currFilePaths: string[] = subordinates
    .filter((sub) => !sub.isDirectory())
    .map((sub) => path.join(dir, sub.name));

  filePaths = filePaths.concat(currFilePaths);

  const dirs = subordinates.filter((sub) => sub.isDirectory());

  for (let i = 0; i < dirs.length; i++) {
    const sub = dirs[i];
    const currDir = path.join(dir, sub.name);
    filePaths = listAllSubordinatesDFS(currDir, filePaths, filterRegexToExclude);
  }

  return filePaths;
}