import fs from 'fs';
import { GitObject } from '../../object/gitObject/GitObject';

const newLine = '\r\n';

export default function (filePath: string, gitObject: GitObject) {
  const fields = Object.keys(gitObject).filter((field) => field !== 'data');

  // Create a new CSV file with fields
  if (!fs.existsSync(filePath)) {
    console.log(`${filePath} is creating`);
    fs.writeFileSync(filePath, fields.join(',') + newLine);
  }

  const csvData = Object.values(gitObject).join(',');
  fs.appendFileSync(filePath, csvData + newLine);
}
