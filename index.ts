// import path from "path";
import { Git } from "./src/class/Git";

const rootDir: string = '/Users/shuyuliu/Coding/gitTest';

function main() {
  const git = new Git(rootDir);
  console.log(git.listTypes());
}

main();
