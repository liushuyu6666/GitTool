import * as dotenv from 'dotenv';
import { Git } from '../../src/git/Git';
import { GitObjectType } from '../../src/utils/getGitObjectType';
// import fs from 'fs';

dotenv.config({ path: '.env.localhost.local' });
dotenv.config({ path: '.env.local' });

describe('Explore ref_delta', () => {
  const gitTestRoot: string = process.env.gitTest ?? '';
  const git = new Git(gitTestRoot, '');

  test('ref', () => {
    const delta_object = git.gitObjectManager.packDeltaObjectBriefs;
    const target = delta_object.filter((delta) => delta.hash === '983bf48e1e5e6f35a98c8bc465f139abe56f04e4')[0];
    console.log(target.size);
    target.differentiating();
    if (target.data?.type === GitObjectType.REF_DELTA) {
      console.log(target.data.refDeltaData);
    }
  })

  // test('crazy', () => {
  //   const pack = fs.readFileSync('gitTest/.git/objects/pack/pack-13995ffd6c5efdbeb96104a3c58d178c73a77926.pack');
  //   const bytes = pack.subarray(8118, 8165).toString('hex');
  //   fs.writeFileSync('crazy.txt', bytes);
  // })
})