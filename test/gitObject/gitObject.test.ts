import { GitObject, GitObjectType } from "../../src/gitObject/GitObject";

describe('Test GitObject class', () => {
  let gitBlobObject: GitObject;
  let gitTreeObject: GitObject;
  let gitCommitObject: GitObject;
  const rootDir = 'gitTestSimple';

  describe('test a blob object, details can be found on readme.md', () => {
    const hex = '2129cac3bcef43797f755ba6105c32d4a3f1ace0';
    gitBlobObject = new GitObject(rootDir, hex);

    test('test the data', () => {
      gitBlobObject.differentiating();
      if (gitBlobObject.data?.type === GitObjectType.BLOB) {
        const blobData = gitBlobObject.data;
        const content = blobData.content;
        expect(content).toBe('This is the second blob\nThis is not the third line\n');
      } else {
        expect(gitBlobObject.data?.type).toBe(GitObjectType.BLOB);
      }
    })
  })

  describe('test a tree object, details can be found on readme.md', () => {
    const hex = 'a5e8ef5f17e278727d3f18a309cba4be8f6ba2c8';
    gitTreeObject = new GitObject(rootDir, hex);

    test('test the file entries', () => {
      gitTreeObject.differentiating();
      if (gitTreeObject.data?.type === GitObjectType.TREE) {
        const treeData = gitTreeObject.data;
        const fileEntries = treeData.fileEntries;
        expect(fileEntries).toEqual([
          {
            'pointer': 'bak',
            'mode': '40000',
            'hash': '326ae25c4e61cba56782e9e37a19d0bbcf9b694e'
          },
          {
            'pointer': 'test.txt',
            'mode': '100644',
            'hash': 'fffbf73fb93d922f351ee5b7311e1edb1c76b427'
          }
        ])
      } else {
        expect(gitTreeObject.data?.type).toBe(GitObjectType.TREE);
      }
    })
  })

  describe('test a commit object, details can be found on readme.md', () => {
    const hex = '7c556ca93b467f8f8247acf522915f2f9e048eb5';
    gitCommitObject = new GitObject(rootDir, hex);

    test('test the data', () => {
      gitCommitObject.differentiating();
      if (gitCommitObject.data?.type === GitObjectType.COMMIT) {
        const commitData = gitCommitObject.data;
        const content = commitData.commitData;
        expect(content.hash).toEqual({
          treeHash: '08c5082aa833173f6fe08a6ffaa05bf49322b6cd',
          parentHashes: ['d44f8c06583e525e7885ec701c04a067e061bd94']
        })
      } else {
        expect(gitCommitObject.data?.type).toBe(GitObjectType.COMMIT);
      }
    })
  })
})