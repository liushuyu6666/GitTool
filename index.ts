import { Git } from "./src/class/Git";
import * as dotenv from 'dotenv';
import { readFileSync } from "fs";
dotenv.config({path: '.env.localhost.local'});
dotenv.config({path: '.env.local'});

const rootDir: string = process.env.rootDir ?? '';

function main() {
  const git = new Git(rootDir);
  git.toFlatTreeObjects();
  console.log(JSON.stringify(git.flatTreeObjects, null, 2));
}

function pack() {
  const pack = readFileSync(`/Users/shuyuliu/Coding/gitTest/.git/objects/pack/pack-c86fa0f02f7bc3d0529d483e7376508cacbaf3c7.pack`);
  const size = pack.length;
  console.log(size);

  // layer 1: [0, 4): 'PACK'
  const layer1 = pack.subarray(0, 4);
  console.log(layer1.toString('utf-8'));

  // layer 2: [4, 8): 'version number
  const layer2 = pack.subarray(4, 8);
  console.log(layer2.readUInt32BE());

  // layer 3: [8, 12): 'object number'
  const layer3 = pack.subarray(8, 12);
  console.log(layer3.readUInt32BE());

  // layer 4: [12, length - 20)
  const layer4 = pack.subarray(12, size - 20);
  let isFirst: boolean = true;
  let msb: boolean;

  const currEntry = layer4[0];
  do {
    msb = 
  }
}

const parseChunks = (
  isFirst: boolean,
  
)

pack();
