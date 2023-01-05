import fs from 'fs';
import { GitObjectType } from '../../src/utils/getGitObjectType';
import swapKeyAndValueInRecords from '../../src/utils/records/swapKeyAndValueInRecords';

export interface TestDeltaKit {
  refs: Array<TestObject>;
  ofss: Array<TestObject>;
}

export interface TestPackKit {
  packDeltaObjects: Array<TestObject>;
  packOriginalObjects: Array<TestObject>;
}

export interface TestObjectKit {
  blob: TestObject;
  tree: TestObject;
  commit: TestObject;
}

export interface TestObject {
  bodyOffsetEndIndex: number;
  bodyOffsetStartIndex: number;
  filePath: string;
  hash: string;
  prefix: number;
  size: number;
  suffix: string;
  type: GitObjectType;
}

export const gitOriginalObjectBrief = (): TestObjectKit => {
  const data = fs
    .readFileSync('test/data/gitOriginalObjectBrief.json')
    .toString();
  const jsonObjects: Array<TestObject> = JSON.parse(data);

  const blob = jsonObjects.filter(
    (json) => json.type === GitObjectType.BLOB,
  )[0];
  const tree = jsonObjects.filter(
    (json) => json.type === GitObjectType.TREE,
  )[0];
  const commit = jsonObjects.filter(
    (json) => json.type === GitObjectType.COMMIT,
  )[0];

  return {
    blob,
    tree,
    commit,
  };
};

export const gitPackedOriginalObjectBrief = (): TestObjectKit => {
  const data = fs
    .readFileSync('test/data/gitPackedObjectBrief.json')
    .toString();
  const jsonObjects: TestPackKit = JSON.parse(data);

  const originals = jsonObjects.packOriginalObjects;

  const blob = originals.filter(
    (json) => json.type === GitObjectType.BLOB_DELTA,
  )[0];
  const tree = originals.filter(
    (json) => json.type === GitObjectType.TREE_DELTA,
  )[0];
  const commit = originals.filter(
    (json) => json.type === GitObjectType.COMMIT_DELTA,
  )[0];

  return {
    blob,
    tree,
    commit,
  };
};

export const gitPackedDeltaObjectBrief = (): TestDeltaKit => {
  const data = fs
    .readFileSync('test/data/gitPackedObjectBrief.json')
    .toString();
  const jsonObjects: TestPackKit = JSON.parse(data);

  const deltas = jsonObjects.packDeltaObjects;

  const refs = deltas.filter((delta) => delta.type === GitObjectType.REF_DELTA);
  const ofss = deltas.filter((delta) => delta.type === GitObjectType.OFS_DELTA);

  return {
    refs,
    ofss,
  };
};

export const offsetsAndSwapOffsets = (): [
  Record<string, number>,
  Record<number, string>,
] => {
  const data = fs.readFileSync('test/data/offsets.json').toString();
  const offsets: Record<string, number> = JSON.parse(data);

  const swapOffsets = swapKeyAndValueInRecords(offsets);

  return [offsets, swapOffsets];
};

export const addInstructionData = (): [Buffer, string] => {
  const message =
    'Your parseAdd function works well if you can see this sentence! Congratulation!!! :)';

  const messageBuffer = Buffer.from(message);

  const size = messageBuffer.length;

  const headerBuffer = Buffer.alloc(1);
  headerBuffer.fill(size);

  const instruction = Buffer.concat([headerBuffer, messageBuffer], size + 1);

  return [
    instruction,
    message
  ]
};

export const copyInstructionData = (): [Buffer, number, number] => {
  const header = 0b11011010;

  const offset1 = 0b11011001;

  const offset2 = 0b00110101;

  const size1 = 0b11000011;

  const size2 = 0b11110000;

  const instructionBuffer = Buffer.from([header, offset1, offset2, size1, size2]);

  const offsetReal = 0b00110101000000001101100100000000

  const sizeReal = 0b111100000000000011000011

  return [
    instructionBuffer,
    offsetReal,
    sizeReal,
  ];
}

export const copyInstructionDataSpecial = (): [Buffer, number, number] => {
  const header = 0b00011010;

  const offset1 = 0b11011001;

  const offset2 = 0b00110101;

  const instructionBuffer = Buffer.from([header, offset1, offset2]);

  const offsetReal = 0b00110101000000001101100100000000

  const sizeReal = 0b10000;

  return [
    instructionBuffer,
    offsetReal,
    sizeReal,
  ];
}
