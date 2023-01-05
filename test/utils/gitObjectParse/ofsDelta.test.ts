import { parseOfsDeltaObjectContent } from "../../../src/utils/gitObjectParse/ofsDelta";
import { gitPackedDeltaObjectBrief, offsetsAndSwapOffsets } from "../../data/data";
import fs from 'fs';

describe('Test parseOfsDeltaObjectContent function to check the OfsDeltaObjectInfo:', () => {
  const delta = gitPackedDeltaObjectBrief();
  const [offsets, swapOffsets] = offsetsAndSwapOffsets();

  test('Test one element to see the OfsDeltaObjectInfo.', () => {

    const ofs = delta.ofss[0];

    const data = fs.readFileSync(ofs.filePath);
    const body = data.subarray(ofs.bodyOffsetStartIndex, ofs.bodyOffsetEndIndex);

    const ofsDeltaObjectInfo = parseOfsDeltaObjectContent(
      body,
      ofs.hash,
      offsets,
      swapOffsets
    );

    expect(ofsDeltaObjectInfo.baseHash).toBe('3db1cded309c26ae02c53fe7fc6157296725e593');

    console.log(ofsDeltaObjectInfo.instructions);
  });

  // test('Test all ofsDelta objects to see if there is any error', () => {
  //   const ofss = delta.ofss;

  //   ofss.forEach((ofs) => {
  //     const data = fs.readFileSync(ofs.filePath);
  //     const body = data.subarray(ofs.bodyOffsetStartIndex, ofs.bodyOffsetEndIndex);

  //     const ofsDeltaObjectInfo = parseOfsDeltaObjectContent(
  //       body,
  //       ofs.hash,
  //       offsets,
  //       swapOffsets
  //     );

  //     expect(ofsDeltaObjectInfo.baseHash?.length).toBe(40);
  //   })

    
  // })

})