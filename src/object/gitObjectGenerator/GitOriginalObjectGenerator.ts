import { GitObjectType } from '../../utils/getGitObjectType';
import generateGitOriginalObjectFromFile from '../../utils/gitObjectGeneration/generateGitOriginalObjectFromFile';
import parseAndStoreObject from '../../utils/gitObjectGeneration/parseAndStoreObject';

export interface GitOriginalObjectGeneratorInterface {
  filePath: string;

  objectPath: string;

  parseAndStoreIndependentOriginalObject(): [string, GitObjectType];
}

/**
 * 
 * @param filePath The file path of the original object, always likes this `${rooDir}/.git/objects/e3/e1dd343baa984e5d704c54404a80de05a5008e`
 */
export class GitOriginalObjectGenerator implements GitOriginalObjectGeneratorInterface {
  filePath: string;

  objectPath: string;

  constructor(filePath: string, outObjectDir: string) {
    // Get all necessary paths.
    this.filePath = filePath;
    // TODO: configurable in .env.
    this.objectPath = outObjectDir;
  }

  parseAndStoreIndependentOriginalObject(): [string, GitObjectType] {
    // This is a BriefObject without extended data
    const gitObject = generateGitOriginalObjectFromFile(this.filePath);

    return parseAndStoreObject(this.objectPath, gitObject);
  }
}