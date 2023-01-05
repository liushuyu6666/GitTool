import generateGitPackObjectsFromFile from '../../../src/utils/gitObjectGeneration/generateGitPackObjectsFromFile';

describe('Test generateGitPackObjectsFromFile.test, which generates brief objects from file:', () => {
  test('Test on one of the pack file', () => {
    const filePathIdx = 'gitTest/.git/objects/pack/pack-393d82d9c95f8a620e22ea171f2ab8c4f5986722.idx';
    const filePathPack = 'gitTest/.git/objects/pack/pack-393d82d9c95f8a620e22ea171f2ab8c4f5986722.pack';
    const outObjectDir = 'test/utils/gitObjectGeneration';
    
    // The hashes and offsets table will be saved under test/utils/gitObjectGeneration/pack/pack-393d82d9c95f8a620e22ea171f2ab8c4f5986722.json
    const gitObjects = generateGitPackObjectsFromFile(filePathIdx, filePathPack, outObjectDir);

    expect(gitObjects).toMatchSnapshot();

    expect(gitObjects.packOriginalObjects.length).toBe(72);
    expect(gitObjects.packDeltaObjects.length).toBe(70);
  });
});
