import fs from 'fs';
import path from 'path';

export default function (filePath: string, data: any) {
  const json = JSON.stringify(data, null, 2);
  const lastSep = filePath.lastIndexOf(path.sep);
  const prefix = filePath.substring(0, lastSep);

  if (fs.existsSync(prefix)) {
    fs.writeFileSync(filePath, json);
    console.log(
      `[storeDataInFile]: data stored into ${path.join(
        filePath,
      )} successfully.`,
    );
  } else {
    throw new Error(
      `[file path error]: ${filePath} doesn\'t exist, cannot store data into that`,
    );
  }
}
