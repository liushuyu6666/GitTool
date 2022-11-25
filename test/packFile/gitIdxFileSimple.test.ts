import * as dotenv from 'dotenv';
import { GitIdxFile } from '../../src/packFile/GitIdxFile';

dotenv.config({ path: '.env.localhost.local' });
dotenv.config({ path: '.env.local' });

describe('Test GitIdxFile Class on gitTestSimple kit, where we only have blob, tree and commit.', () => {
  const filePath = process.env.idxPathTest ?? '';
  const gitIdx = new GitIdxFile(filePath);

  test('test header, should be [255, 116, 79, 99]', () => {
    expect(gitIdx.header).toEqual([255, 116, 79, 99]);
  });

  test('test version number, should be 2', () => {
    expect(gitIdx.versionNumber).toBe(2);
  });

  test('test entry size of fanout table', () => {
    const entrySize = gitIdx.fanout.entrySize;

    expect(entrySize).toBe(3);
  });

  test('test layer1 of fanout table', () => {
    const layer1 = gitIdx.fanout.layer1;
    const totalEntries = Object.values(layer1).reduce(
      (prev, curr) => prev + curr,
      0,
    );
    expect(layer1).toMatchSnapshot('layer1');
    expect(totalEntries).toBe(3);
  });

  test('test offsets of fanout table', () => {
    const offsets = gitIdx.fanout.offsets;

    expect(offsets).toMatchSnapshot('offsets');
  });
});
