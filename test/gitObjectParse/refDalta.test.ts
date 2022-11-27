import * as dotenv from 'dotenv';
import { Git } from '../../src/git/Git';

dotenv.config({ path: '.env.localhost.local' });
dotenv.config({ path: '.env.local' });

describe('Explore ref_delta', () => {
  const gitTestRoot: string = process.env.gitTest ?? '';
  const git = new Git(gitTestRoot, '');

  test('ref', () => {
    const ref_delta = git.gitObjectManager.packDeltaObjectBriefs;
    console.log(ref_delta[2].hash);
  })
})