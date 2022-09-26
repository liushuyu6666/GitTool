// import path from "path";
import { TreeObject } from "./src/class/TreeObject";


const rootDir: string = '/Users/shuyuliu/Coding/gitTest/.git';
// const objectDir: string = path.join(rootDir, 'objects');

function main() {
  const treeObject = new TreeObject(rootDir, '3c4e9cd789d88d8d89c1073707c3585e41b0e614');
  console.log(treeObject.fileEntries)
}

main();
