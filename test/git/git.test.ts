import { Git } from "../../src/git/Git";

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
      console.log(git.gitObjectManager.sizeInTotal / 1000000);
    })
  })
})