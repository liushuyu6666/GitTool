import parseCopy from "../../../src/utils/parseInstruction/parseCopy";
import { copyInstructionData } from "../../data/data";

describe('Test parseCopy function, which parses couple bytes as the copy instruction:', () => {
  test('Check if the offset and size are parsed correctly.', () => {
    const [instruction, offset, size] = copyInstructionData();

    const [ addInstruction, _ ] = parseCopy(instruction, 0);

    expect(addInstruction.offset).toBe(offset);
    expect(addInstruction.size).toBe(size);
  });

  test('Check if the offset and size are parsed correctly when size is omitted.', () => {
    const [instruction, offset, size] = copyInstructionData();

    const [ addInstruction, _ ] = parseCopy(instruction, 0);

    expect(addInstruction.offset).toBe(offset);
    expect(addInstruction.size).toBe(size);
  })
})