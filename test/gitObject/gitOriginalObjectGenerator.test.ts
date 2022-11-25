import { GitObject } from "../../src/gitObject/GitObject";
import { GitOriginalObjectGenerator } from "../../src/gitObject/GitOriginalObjectGenerator";
import { GitObjectType } from "../../src/utils/getGitObjectType";

describe('Test GitObject class', () => {
  let gitBlobObject: GitObject;
  let gitTreeObject: GitObject;
  let gitCommitObject: GitObject;

  describe('test a blob object, details can be found on readme.md', () => {
    const path = './gitTestSimple/.git/objects/21/29cac3bcef43797f755ba6105c32d4a3f1ace0';
    gitBlobObject = new GitOriginalObjectGenerator(path).generateGitOriginalObject();

    test('test the hash, prefix, suffix, type, size, filePath, startIndex and endIndex', () => {
      expect(gitBlobObject.hash).toBe('2129cac3bcef43797f755ba6105c32d4a3f1ace0');
      expect(gitBlobObject.prefix).toBe('21');
      expect(gitBlobObject.suffix).toBe('29cac3bcef43797f755ba6105c32d4a3f1ace0');
      expect(gitBlobObject.size).toBe(51);
      expect(gitBlobObject.filePath).toBe(path);
      expect(gitBlobObject.bodyOffsetStartIndex).toBe(8);
      expect(gitBlobObject.bodyOffsetEndIndex).toBe(59);
    })

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
    const path = './gitTestSimple/.git/objects/a5/e8ef5f17e278727d3f18a309cba4be8f6ba2c8';
    gitTreeObject = new GitOriginalObjectGenerator(path).generateGitOriginalObject();

    test('test the hash, prefix, suffix, type, size, filePath, startIndex and endIndex', () => {
      expect(gitTreeObject.hash).toBe('a5e8ef5f17e278727d3f18a309cba4be8f6ba2c8');
      expect(gitTreeObject.prefix).toBe('a5');
      expect(gitTreeObject.suffix).toBe('e8ef5f17e278727d3f18a309cba4be8f6ba2c8');
      expect(gitTreeObject.size).toBe(66);
      expect(gitTreeObject.filePath).toBe(path);
      expect(gitTreeObject.bodyOffsetStartIndex).toBe(8);
      expect(gitTreeObject.bodyOffsetEndIndex).toBe(74);
    })

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
    const path = './gitTestSimple/.git/objects/7c/556ca93b467f8f8247acf522915f2f9e048eb5';
    gitCommitObject = new GitOriginalObjectGenerator(path).generateGitOriginalObject();

    test('test the hash, prefix, suffix, type, size, filePath, startIndex and endIndex', () => {
      expect(gitCommitObject.hash).toBe('7c556ca93b467f8f8247acf522915f2f9e048eb5');
      expect(gitCommitObject.prefix).toBe('7c');
      expect(gitCommitObject.suffix).toBe('556ca93b467f8f8247acf522915f2f9e048eb5');
      expect(gitCommitObject.size).toBe(242);
      expect(gitCommitObject.filePath).toBe(path);
      expect(gitCommitObject.bodyOffsetStartIndex).toBe(11);
      expect(gitCommitObject.bodyOffsetEndIndex).toBe(253);
    })

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