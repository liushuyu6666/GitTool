import { GitFile } from "../../src/file/GitFile";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.localhost.local' });
dotenv.config({ path: '.env.local' });

describe("Test gitFile for couple cases", () => {
  const rootDirTest = process.env.rootDirTest ?? '';
  const gitFile = new GitFile(rootDirTest, '');

  test("test the list functions to see if the sum is right", () => {
    const originalObjectNumber = gitFile.unpackedObjectsPaths.length;
    const packNumber = gitFile.packPathsWithoutExtension.length;
    const infoNumber = gitFile.infoPaths.length;
    const allObjectNumber = gitFile.allObjectPaths.length;

    expect(allObjectNumber).toBe(originalObjectNumber + packNumber + infoNumber);
  })

  test("The out directory should be created and returned successfully", () => {
    const outDirs = gitFile.outDirs;

    expect(outDirs.outDir).toBe('./outDir');
    expect(outDirs.objectDir).toBe('outDir/objects');
  })
})