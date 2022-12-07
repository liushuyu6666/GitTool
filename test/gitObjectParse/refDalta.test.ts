import * as dotenv from 'dotenv';
import { Git } from '../../src/git/Git';
import { GitObjectType } from '../../src/utils/getGitObjectType';
// import fs from 'fs';

dotenv.config({ path: '.env.localhost.local' });
dotenv.config({ path: '.env.local' });

describe('Explore ref_delta', () => {
  const gitTestRoot: string = process.env.gitTest ?? '';
  const git = new Git(gitTestRoot, '');

  // test('check one pack original object whose type should be BLOB_DELTA', () => {
  //   const pack_original_object = git.gitObjectManager.originalObjectBriefs;
  //   const target = pack_original_object.filter((pack) => pack.hash === 'b70f858b6d7884cc0078a3a8e90d92009032367d')[0];
  //   target.differentiating();
  //   if (target.data?.type === GitObjectType.BLOB) {
  //     console.log(target.data.content);
  //   }
  // })

  // test('check one pack original object whose type should be TREE_DELTA', () => {
  //   const pack_original_object = git.gitObjectManager.originalObjectBriefs;
  //   const target = pack_original_object.filter((pack) => pack.hash === 'fcec1e5e06352a4b27e223f4dc64759483320da7')[0];
  //   target.differentiating();
  //   if (target.data?.type === GitObjectType.TREE) {
  //     console.log(target.data.fileEntries);
  //   }
  // })

  // test('check one pack original object whose type should be COMMIT_DELTA', () => {
  //   const pack_original_object = git.gitObjectManager.originalObjectBriefs;
  //   const target = pack_original_object.filter((pack) => pack.hash === '56a65082c2c3652ba47dec00c749f3594280afb4')[0];
  //   target.differentiating();
  //   if (target.data?.type === GitObjectType.COMMIT) {
  //     console.log(target.data.commitData);
  //   }
  // })

  test('check one pack original object whose type should be REF_DELTA', () => {
    const delta_object = git.gitObjectManager.packDeltaObjectBriefs;
    const target = delta_object.filter((pack) => pack.hash === '49d6f24d33b961876d1574209f2f9d784eca4e9e')[0];
    target.differentiating();
    if (target.data?.type === GitObjectType.REF_DELTA) {
      console.log(target.data.refDeltaData);
    }
  })

  // test('test the pack file', () => {
  //   const packFile = fs.readFileSync('./gitTest/.git/objects/pack/pack-5eb139577548314dffcb8e6410b30413a81ca3fb.pack');
  //   const data = packFile.toString('hex');
  //   console.log(data);
  //   fs.writeFileSync('packFileContent.txt', JSON.stringify(data));
  // })

  // test('crazy', () => {
  //   const pack = fs.readFileSync('gitTest/.git/objects/pack/pack-13995ffd6c5efdbeb96104a3c58d178c73a77926.pack');
  //   const bytes = pack.subarray(8118, 8165).toString('hex');
  //   fs.writeFileSync('crazy.txt', bytes);
  // })
})