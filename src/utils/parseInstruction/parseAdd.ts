export interface GitAddInstruction {
  content: string;
}

export default function (instructions: Buffer, startIndex: number): [GitAddInstruction, number] {
  const size = instructions.subarray(startIndex, startIndex + 1).readUInt8();

  const bodyBuffer = instructions.subarray(startIndex + 1, startIndex + size + 1);

  const content = bodyBuffer.toString();

  return [{ content }, startIndex + size + 1];
}
