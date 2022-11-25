import { Git } from "../../src/git/Git";
import { GitObjectType } from "../../src/gitObject/GitObject";

describe('Test Git using gitTestSimple', () => {
  const rootDir = './gitTest';
  const git = new Git(rootDir);

  // describe('Test fileManager', () => {
  //   test('allObjectPaths', () => {
  //     console.log(git.gitFileManager.allObjectPaths);
  //   });

  //   test('packPathsWithoutExtension', () => {
  //     console.log(git.gitFileManager.packPathsWithoutExtension);
  //   })
  // })

  describe('Test gitObjectManager', () => {
    test('all object briefs', () => {
      const ref = git.gitObjectManager.objectBriefs.filter((brief) => brief.type === GitObjectType.REF_DELTA);

      console.log(ref[5].hash);
    })
  })
})