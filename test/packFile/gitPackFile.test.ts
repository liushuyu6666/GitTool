import { inflateSync } from "zlib";
import { GitIdxFile } from "../../src/packFile/GitIdxFile";
import { GitPackFile } from "../../src/packFile/GitPackFile";

describe('test pack', () => {
  const filePath =
    'gitTest/objects/pack/pack-5eb139577548314dffcb8e6410b30413a81ca3fb.pack';
  const idxFilePath = 
    'gitTest/objects/pack/pack-5eb139577548314dffcb8e6410b30413a81ca3fb.idx';
  const gitIdx = new GitIdxFile(idxFilePath);
  const gitPack = new GitPackFile(filePath, gitIdx.fanout.offsets);

  test('test layer1, should be PACK', () => {
    expect(gitPack.layer1).toBe('PACK');
  });

  test('test data chunk', () => {
    const layer4 = gitPack.layer4;
    expect(Object.keys(layer4)).toMatchSnapshot('packObjectEntries');
    expect(Object.keys(layer4).length).toBe(167);
  })

  test('check OBJ_COMMIT', () => {
    const layer4 = gitPack.layer4;
    const buffer: Buffer[] = [];
    Object.entries(layer4).forEach(([_, entry]) => {
      // When type is OBJ_COMMIT
      if (entry.type === 1) {
        buffer.push(inflateSync(entry.content));
      }
    })

    expect(buffer).toMatchSnapshot('OBJ_COMMIT')
  })
});