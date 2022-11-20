// import { Git } from './src/class/Git';
import * as dotenv from 'dotenv';
// import { Idx } from './src/packFile/GitIdxFile';
// import { Pack } from './src/packFile/GitPackFile';
dotenv.config({ path: '.env.localhost.local' });
dotenv.config({ path: '.env.local' });

const rootDir: string = process.env.rootDir ?? '';

function main() {
  console.log(rootDir);
  // const git = new Git(rootDir);
  // git.toFlatTreeObjects();
  // console.log(JSON.stringify(git.flatTreeObjects, null, 2));
}

// function idx() {
//   const idx = new Idx(
//     `/Users/shuyuliu/Coding/gitTest/.git/objects/pack/pack-c86fa0f02f7bc3d0529d483e7376508cacbaf3c7.idx`,
//   );
//   idx.parseFanout();
//   console.log(idx.fanout.offsets);

//   const pack = new Pack(
//     `/Users/shuyuliu/Coding/gitTest/.git/objects/pack/pack-c86fa0f02f7bc3d0529d483e7376508cacbaf3c7.idx`,
//     idx.fanout.offsets,
//   );
//   console.log(pack.dataChunks.chunks);
// }

main();
