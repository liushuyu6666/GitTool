import { addInstructionData, gitOriginalObjectBrief, gitPackedDeltaObjectBrief, gitPackedOriginalObjectBrief, offsetsAndSwapOffsets } from "./data";

describe('Check all test data to see if it parse the file correctly:', () => {
  
  test('Test the original objects by its type.', () => {
    const original = gitOriginalObjectBrief();

    expect(original.blob.type).toBe('blob');
    expect(original.commit.type).toBe('commit');
    expect(original.tree.type).toBe('tree');
  });

  test('Test the packed original objects by its type.', () => {
    const packed = gitPackedOriginalObjectBrief();

    expect(packed.blob.type).toBe('blob_delta');
    expect(packed.tree.type).toBe('tree_delta');
    expect(packed.commit.type).toBe('commit_delta');
  });

  test('Test the packed delta objects by its type.', () => {
    const packed = gitPackedDeltaObjectBrief();

    const ref = packed.refs[0];
    const ofs = packed.ofss[0];

    expect(ref.type).toBe('ref_delta');
    expect(ofs.type).toBe('ofs_delta');
  });

  test('Test offsets and swapOffsets by its type.', () => {
    const [offsets, swapOffsets] = offsetsAndSwapOffsets();


    Object.keys(offsets).forEach((offset) => {
      expect(offset.length).toBe(40);
    });

    Object.values(swapOffsets).forEach((offset) => {
      expect(offset.length).toBe(40);
    });
  })

  test('Test addInstruction to see if the size of message is smaller than 0b10000000.', () => {
    const [instruction, _] = addInstructionData();

    const header = instruction.subarray(0, 1).readUInt8();

    expect(header).toBeLessThan(0b10000000);
  })
});
