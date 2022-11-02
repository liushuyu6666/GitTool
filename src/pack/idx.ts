import { readFileSync } from "fs";

function pack() {
    const idx = readFileSync(`/Users/shuyuliu/Coding/gitTest/.git/objects/pack/pack-c86fa0f02f7bc3d0529d483e7376508cacbaf3c7.idx`);
    console.log(idx);
  
    // parse layer 0
    const header = [idx.readUInt8(0), idx.readUInt8(1), idx.readUInt8(2), idx.readUInt8(3)]; // [0, 3] bytes
    console.log(header);
  
    const versionNumber = idx.readUInt32BE(4); // [4, 7] bytes
    // console.log(versionNumber);
  
    // layer 1
    const layer1: Record<number, number> = {};
    const layer1Diff: Record<number, number> = {};
    for (let i = 0; i < 256; i++) {
      layer1[i] = idx.readUInt32BE(8 + i * 4); // [8, 1031] bytes
    }
    const size = layer1[255];
    for (let i = 255; i >= 0; i--) {
      layer1Diff[i] = i > 0 ? layer1[i] - layer1[i - 1] : layer1[0];
    }
    
  
    // layer 2: [1032, 1032 + 20 * size - 1] bytes
    const layer2: string[] = [];
    for (let i = 0; i < size; i++) {
      layer2.push(idx.subarray(1032 + 20 * i, 1032 + 20 * (i + 1)).toString('hex')) // TODO: set 1032 as a global constant for the first byte of the layer 2
    }
    console.log(layer2);
  
    // layer 3: [1032 + 20 * size, 1032 + 20 * size + 3] bytes
    const layer3: Buffer = idx.subarray(1032 + 20 * size, 1032 + 20 * size + 4);
    console.log(layer3);
  }