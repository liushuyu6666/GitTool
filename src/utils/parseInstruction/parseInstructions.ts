import parseAdd, { GitAddInstruction } from './parseAdd';
import parseCopy, { GitCopyInstruction } from './parseCopy';

export type GitInstructions = Array<GitCopyInstruction | GitAddInstruction>;
export default function (instructions: Buffer) {
  let startIndex = 0;
  const len = instructions.length;

  const instructionsResult: GitInstructions = [];
  while (startIndex < len) {
    const isCopy = isCopyInstruction(instructions, startIndex);
    if (isCopy) {
      const [copyInstruction, pointer] = parseCopy(instructions, startIndex);
      instructionsResult.push(copyInstruction);
      startIndex = pointer;
    } else {
      const [addInstruction, pointer] = parseAdd(instructions, startIndex);
      instructionsResult.push(addInstruction);
      startIndex = pointer;
    }
  }

  return instructionsResult;
}

function isCopyInstruction(body: Buffer, pointer: number): boolean {
  const header = body.subarray(pointer, pointer + 1).readUInt8() & 0xff;

  return header >= 0b10000000;
}
