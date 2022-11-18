import { inflateSync } from 'zlib';
import { GitIdxFile } from '../../src/packFile/GitIdxFile';
import { GitPackFile } from '../../src/packFile/GitPackFile';

describe('test pack', () => {
  const filePath =
    'gitTestSimple/objects/pack/pack-5fec731b51ec842da6351423114d4bbee41e7aee.pack';
  const idxFilePath = 'gitTestSimple/objects/pack/pack-5fec731b51ec842da6351423114d4bbee41e7aee.idx';

  const gitIdx = new GitIdxFile(idxFilePath);
  const gitPack = new GitPackFile(filePath, gitIdx.fanout.offsets);

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

    const decipher = inflateSync(blob.content).toString();
    const real = 'hello world\n'; // Rememeber and the end of file there is a LF
    
    expect(decipher).toEqual(real);
    expect(blob.variableLengthInteger).toBe(real.length);
    expect(blob.type).toBe(3);
  });

  // test('check OBJ_TREE, we already know the hex is c3b8bb102afeca86037d5b5dd89ceeb0090eae9d from readme', () => {
  //   const layer4 = gitPack.layer4;
  //   const tree = layer4['c3b8bb102afeca86037d5b5dd89ceeb0090eae9d'];

  //   const decipher = inflateSync(tree.content).toString();
  //   // TODO: use the decipher function in GitObjectTree, and make this decipher as a independent function
  //   const real = '100644 blob 3b18e512dba79e4c8300dd08aeb37f8e728b8dad	test.txt\n';
    
  //   expect(decipher).toEqual(real);
  //   expect(tree.variableLengthInteger).toBe(real.length);
  //   expect(tree.type).toBe(2);
  // });
});
