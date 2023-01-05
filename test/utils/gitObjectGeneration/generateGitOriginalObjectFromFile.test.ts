import generateGitOriginalObjectFromFile from '../../../src/utils/gitObjectGeneration/generateGitOriginalObjectFromFile';
import { gitOriginalObjectBrief, TestObjectKit } from '../../data/data';

describe('Test generateGitOriginalObjectFromFile, which generates brief object from file. Here three type need to be tested:', () => {
  const testDataKit: TestObjectKit = gitOriginalObjectBrief();
  
  test('Test the blob object', () => {
    const filePath = testDataKit.blob.filePath;
    const gitObject = generateGitOriginalObjectFromFile(filePath);

    expect(gitObject).toMatchSnapshot();
  });

  test('Test the tree object', () => {
    const filePath = testDataKit.tree.filePath;
    const gitObject = generateGitOriginalObjectFromFile(filePath);

    expect(gitObject).toMatchSnapshot();
  });

  test('Test the commit object', () => {
    const filePath = testDataKit.commit.filePath;
    const gitObject = generateGitOriginalObjectFromFile(filePath);

    expect(gitObject).toMatchSnapshot();
  });
});
