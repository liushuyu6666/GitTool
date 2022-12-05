// import { Git } from "../../src/git/Git";
// import { GitObjectType } from "../../src/utils/getGitObjectType";
// import * as dotenv from 'dotenv';

// dotenv.config({ path: '.env.localhost.local' });
// dotenv.config({ path: '.env.local' });

// describe('Test Git using gitTestSimple', () => {
//   const rootDirTest = process.env.rootDirTest ?? '';
//   const git = new Git(rootDirTest);

//   // describe('Test fileManager', () => {
//   //   test('allObjectPaths', () => {
//   //     console.log(git.gitFileManager.allObjectPaths);
//   //   });

//   //   test('packPathsWithoutExtension', () => {
//   //     console.log(git.gitFileManager.packPathsWithoutExtension);
//   //   })
//   // })

//   describe('Test gitObjectManager', () => {
//     test('all object briefs', () => {
//       const ref = git.gitObjectManager.objectBriefs.filter((brief) => brief.type === GitObjectType.REF_DELTA);

//       expect(ref.length).toBe(0);
//     })
//   })
// })