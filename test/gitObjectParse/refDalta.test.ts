import * as dotenv from 'dotenv';
import { Git } from '../../src/git/Git';
import { GitObjectType } from '../../src/utils/getGitObjectType';

dotenv.config({ path: '.env.localhost.local' });
dotenv.config({ path: '.env.local' });

describe('Explore ref_delta', () => {
  const gitTestRoot: string = process.env.gitTest ?? '';
  const git = new Git(gitTestRoot, '');

  test('ref', () => {
    const original_object = git.gitObjectManager.originalObjectBriefs;
    const target = original_object.filter((obj) => obj.hash === 'e5d7354915e794c12d195446d07b810d884acaad')[0];
    console.log(target);
    target.differentiating();
    if (target.data?.type === GitObjectType.COMMIT) {
      console.log(target.data.commitData);
    }
  })
})