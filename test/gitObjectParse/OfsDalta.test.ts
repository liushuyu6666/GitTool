// import * as dotenv from 'dotenv';
// import { Git } from '../../src/git/Git';
// import { GitObject } from '../../src/object/gitObject/GitObject';
// import { GitObjectType } from '../../src/utils/getGitObjectType';
// // import fs from 'fs';
// // import { inflateSync } from 'zlib';

// dotenv.config({ path: '.env.localhost.local' });
// dotenv.config({ path: '.env.local' });

// describe('Explore ref_delta', () => {
//   const gitTestRoot: string = process.env.gitTest ?? '';
//   const git = new Git(gitTestRoot, '');

//   // test('check one pack original object whose type should be BLOB_DELTA', () => {
//   //   const pack_original_object = git.gitObjectManager.originalObjectBriefs;
//   //   const target = pack_original_object.filter((pack) => pack.hash === 'b70f858b6d7884cc0078a3a8e90d92009032367d')[0];
//   //   target.differentiating();
//   //   if (target.data?.type === GitObjectType.BLOB) {
//   //     console.log(target.data.content);
//   //   }
//   // })

//   // test('check one pack original object whose type should be TREE_DELTA', () => {
//   //   const pack_original_object = git.gitObjectManager.originalObjectBriefs;
//   //   const target = pack_original_object.filter((pack) => pack.hash === 'fcec1e5e06352a4b27e223f4dc64759483320da7')[0];
//   //   target.differentiating();
//   //   if (target.data?.type === GitObjectType.TREE) {
//   //     console.log(target.data.fileEntries);
//   //   }
//   // })

//   // test('check one pack original object whose type should be COMMIT_DELTA', () => {
//   //   const pack_original_object = git.gitObjectManager.originalObjectBriefs;
//   //   const target = pack_original_object.filter((pack) => pack.hash === '56a65082c2c3652ba47dec00c749f3594280afb4')[0];
//   //   target.differentiating();
//   //   if (target.data?.type === GitObjectType.COMMIT) {
//   //     console.log(target.data.commitData);
//   //   }
//   // })

//   test('Check REF_DELTA object with 1, 2, 3 and 4 byte negative offsets', () => {
//     const delta_object = git.gitObjectManager.packDeltaObjectBriefs;
//     const one = delta_object.filter((pack) => pack.hash === '7721a5fd17c81b940d73b327e13c4d4fc66ba1f0')[0];
//     const two = delta_object.filter((pack) => pack.hash === 'e112d6bafc0cd9c5fbeb0627465c2db6e8479cdf')[0];
//     const three = delta_object.filter((pack) => pack.hash === 'f0e5333f7f906bc4e9d76c3c5283c0cda18dc850')[0];
//     const four = delta_object.filter((pack) => pack.hash === '66715f0b9e641a50bcf08f1dd1d6183a887d20f4')[0];

//     const testOffset = (object: GitObject, offset: number) => {
//       object.differentiating();
//       if (object.data?.type === GitObjectType.REF_DELTA) {
//         expect(object.data.refDeltaData.negativeOffset).toBe(offset);
//       } else {
//         expect(object.data?.type).toBe(GitObjectType.REF_DELTA)
//       }
//     };

//     testOffset(one, 44);
//     testOffset(two, 740);
//     testOffset(three, 83736);
//     testOffset(four, 2276461)

//   })

//   // test('check all pack delta objects to parse the delta_ref', () => {
//   //   const delta_objects = git.gitObjectManager.packDeltaObjectBriefs;

//   //   delta_objects.forEach((delta) => {
//   //     delta.differentiating()
//   //   })
//   // })
// })