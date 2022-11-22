import { GitFile } from "../../src/file/GitFile";

describe("Test gitFile", () => {
  const rootDir = '/home/shuyu/Developments/foxcom-payment-backend';
  const gitFile = new GitFile(rootDir);

  test("test the list functions to see if the sum is right", () => {
    const originalObjectNumber = gitFile.originalGitObjectsPaths.length;
    const packNumber = gitFile.packPaths.length;
    const infoNumber = gitFile.infoPaths.length;
    const allObjectNumber = gitFile.allObjectPaths.length;

    expect(allObjectNumber).toBe(originalObjectNumber + packNumber + infoNumber);
  })
})