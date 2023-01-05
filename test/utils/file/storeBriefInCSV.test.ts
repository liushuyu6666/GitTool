import fs from "fs";
import { GitObject } from "../../../src/object/gitObject/GitObject";
import storeBriefInCSV from "../../../src/utils/file/storeBriefInCSV";
import { GitObjectType } from "../../../src/utils/getGitObjectType";

describe('Test the storeBriefInCSV function', () => {
  const brief1 = new GitObject({
    hash: 'test111111111111',
    type: GitObjectType.BLOB,
    size: 1,
    filePath: 'test_object',
    bodyOffsetStartIndex: 34,
    bodyOffsetEndIndex: 100
  });

  const brief2 = new GitObject({
    hash: 'test222222222222',
    type: GitObjectType.BLOB,
    size: 2,
    filePath: 'test_object2',
    bodyOffsetStartIndex: 13,
    bodyOffsetEndIndex: 100
  });

  test('Saving the first record in the csv file', () => {
  
    const file = 'test/utils/file/brief1.csv';

    // delete the file if exists
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
    
    storeBriefInCSV(file, brief1);
    const csv = fs.readFileSync(file, 'utf-8');
    expect(csv).toMatchSnapshot();
  });

  test('Saving the second record in the csv file', () => {
  
    const file = 'test/utils/file/brief2.csv';

    // delete the file if exists
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }

    storeBriefInCSV(file, brief1);
    storeBriefInCSV(file, brief2);
    const csv = fs.readFileSync(file, 'utf-8');
    expect(csv).toMatchSnapshot();
  });
})