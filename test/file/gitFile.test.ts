import { GitFile } from "../../src/file/GitFile";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.localhost.local' });
dotenv.config({ path: '.env.local' });

describe("Test gitFile", () => {
  const rootDirTest = process.env.rootDirTest ?? '';
  const gitFile = new GitFile(rootDirTest);

  test("test the list functions to see if the sum is right", () => {
    const originalObjectNumber = gitFile.originalGitObjectsPaths.length;
    const packNumber = gitFile.packPathsWithoutExtension.length;
    const infoNumber = gitFile.infoPaths.length;
    const allObjectNumber = gitFile.allObjectPaths.length;

    console.log(`
      There are ${originalObjectNumber} original objects, ${packNumber} pack objects, ${infoNumber} info files.`)
    expect(allObjectNumber).toBe(originalObjectNumber + packNumber + infoNumber);
  })
})