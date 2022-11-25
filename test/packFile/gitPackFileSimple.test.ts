import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { inflateSync } from 'zlib';
import { GitIdxFile } from '../../src/packFile/GitIdxFile';
import { GitPackFile } from '../../src/packFile/GitPackFile';
import { parseTreeEntry } from '../../src/utils/gitObjectParse/tree';

dotenv.config({ path: '.env.localhost.local' });
dotenv.config({ path: '.env.local' });

describe('Test GitPackFile Class on gitTestSimple kit, where we only have blob, tree and commit.', () => {
  const filePath = process.env.packPathtest ?? '';
  const idxFilePath = process.env.idxPathTest ?? '';

  const gitIdx = new GitIdxFile(idxFilePath);
  const gitPack = new GitPackFile(filePath, gitIdx.fanout.offsets);

  const content = readFileSync(filePath);

  test('test layer1, should be PACK', () => {
    expect(gitPack.layer1).toBe('PACK');
  });

  test('test data chunk', () => {
    const layer4 = gitPack.layer4;
    expect(Object.keys(layer4)).toMatchSnapshot('packObjectEntries');
    expect(Object.keys(layer4).length).toBe(3);
  })

  test('check OBJ_BLOB, we already know the hex is 3b18e512dba79e4c8300dd08aeb37f8e728b8dad from readme', () => {
    const layer4 = gitPack.layer4;
    const blob = layer4['3b18e512dba79e4c8300dd08aeb37f8e728b8dad'];

    const decipher = inflateSync(content.subarray(blob.bodyStartIndex, blob.bodyEndIndex)).toString();
    const real = 'hello world\n'; // Rememeber and the end of file there is a LF
    
    expect(decipher).toEqual(real);
    expect(blob.size).toBe(real.length);
    expect(blob.type).toBe(3);
  });

  test('check OBJ_TREE (one entry), we already know the hex is c3b8bb102afeca86037d5b5dd89ceeb0090eae9d from readme', () => {
    const layer4 = gitPack.layer4;
    const tree = layer4['c3b8bb102afeca86037d5b5dd89ceeb0090eae9d'];

    const decipher = inflateSync(content.subarray(tree.bodyStartIndex, tree.bodyEndIndex));
    const {
      mode,
      pointer,
      hash
    } = parseTreeEntry(decipher);
    // TODO: use the decipher function in GitObjectTree, and make this decipher as a independent function
    const real = '100644 3b18e512dba79e4c8300dd08aeb37f8e728b8dad test.txt';
    
    expect(`${mode} ${hash} ${pointer}`).toEqual(real);
    expect(tree.size).toBe(mode.length + (hash.length / 2) + pointer.length + 2);
    expect(tree.type).toBe(2);
  });
});
