import fs from 'fs';
import storeDataInFile from '../../../src/utils/file/storeDataInFile';
import { GitObjectType } from '../../../src/utils/getGitObjectType';

describe('Test the storeDataInFile function:', () => {
  const data = {
    hash: 'test111111111111',
    type: GitObjectType.BLOB,
    size: 1,
    filePath: 'test_object',
    bodyOffsetStartIndex: 34,
    bodyOffsetEndIndex: 100,
  };

  test('Saving the data in the json file.', () => {
    const file = 'test/utils/file/data.json';

    // delete the file if exists
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }

    storeDataInFile(file, data);
    const csv = fs.readFileSync(file, 'utf-8');
    expect(csv).toMatchSnapshot();
  });

  test("If the folder doesn't exists, an error should be thrown.", () => {
    const file = 'test/not/exists';

    // delete the file if exists
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }

    expect(() => {
      storeDataInFile(file, data);
    }).toThrow(
      `[file path error]: ${file} doesn\'t exist, cannot store data into that`,
    );
  });
});
