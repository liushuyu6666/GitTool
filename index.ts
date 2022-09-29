import { Git } from "./src/class/Git";
import * as dotenv from 'dotenv';
dotenv.config({path: '.env.local'});

const rootDir: string = process.env.rootDir ?? '';

function main() {
  const git = new Git(rootDir);
  console.log(JSON.stringify(git.commitObjects, null, 2));
}

main();
