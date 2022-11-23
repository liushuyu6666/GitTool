import { GitFile } from "../../src/file/GitFile";

describe("Test gitFile", () => {
  const rootDir = './gitTest';
  const gitFile = new GitFile(rootDir);

  test("test the list functions to see if the sum is right", () => {
    const originalObjectNumber = gitFile.originalGitObjectsPaths.length;
    const packNumber = gitFile.packPaths.length;
    const infoNumber = gitFile.infoPaths.length;
    const allObjectNumber = gitFile.allObjectPaths.length;

    console.log(`
      There are ${originalObjectNumber} original objects, ${packNumber} pack objects, ${infoNumber} info files.`)
    expect(allObjectNumber).toBe(originalObjectNumber + packNumber + infoNumber);
  })
})