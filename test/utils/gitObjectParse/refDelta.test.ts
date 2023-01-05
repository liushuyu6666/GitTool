import { gitPackedDeltaObjectBrief } from '../../data/data';
import fs from 'fs';
import { parseRefDeltaObjectContent } from '../../../src/utils/gitObjectParse/refDelta';

describe('Test parseRefDeltaObjectContent function to check the RefDeltaObjectInfo:', () => {
  const delta = gitPackedDeltaObjectBrief();

  test('Test one case to see if the RefDeltaObjectInfo is right.', () => {
    const ref = delta.refs[0];

    const data = fs.readFileSync(ref.filePath);
    const body = data.subarray(
      ref.bodyOffsetStartIndex,
      ref.bodyOffsetEndIndex,
    );

    const refDeltaObjectInfo = parseRefDeltaObjectContent(body, ref.hash);

    expect(refDeltaObjectInfo.baseHash).toBe(
      '08e94634011b7a51f190c6854dc9179346f43f0f',
    );
  });

  test('Test all RefDelta objects to see if all objects can be inflated correctly', () => {
    const refs = delta.refs;

    refs.forEach((ref) => {
      const data = fs.readFileSync(ref.filePath);
      const body = data.subarray(
        ref.bodyOffsetStartIndex,
        ref.bodyOffsetEndIndex,
      );

      const refDeltaObjectInfo = parseRefDeltaObjectContent(body, ref.hash);

      expect(refDeltaObjectInfo.baseHash?.length).toBe(40);
    });
  });
});
