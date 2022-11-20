export interface GitTreeObjectFileEntry {
  pointer: string;
  mode: string; // TODO: import { Mode } from "./enum";
  hash: string;
}

export function parseTreeObjectContent(dividedDecryptedBuffer: Buffer[]): GitTreeObjectFileEntry[] {
  const fileEntries: GitTreeObjectFileEntry[] = [];
  if (dividedDecryptedBuffer.length >= 3) {
    let modeAndFile = dividedDecryptedBuffer[1].toString();
    let i = 2;
    while (modeAndFile.length > 0) {
      const hash = dividedDecryptedBuffer[i].subarray(0, 20).toString('hex');
      const fileEntry: GitTreeObjectFileEntry = {
        'pointer': modeAndFile.split(' ')[1],
        'mode': modeAndFile.split(' ')[0],
        'hash': hash
      }
      fileEntries.push(fileEntry);
      modeAndFile = dividedDecryptedBuffer[i].subarray(20).toString();
      i++;
    }
  }

  return fileEntries;
}
/**
 * 
 * @param entry The entry of the tree, format should be: 
 * <mode>0x20<fileName>0x00<20bytesHex>
 */
export function parseTreeEntryInPack(entry: Buffer): GitTreeObjectFileEntry {
  const first = entry.indexOf(0x20); // separate mode and others
  const second = entry.indexOf(0x00); // separate file name and hex

  const mode = entry.subarray(0, first).toString('ascii');
  const pointer = entry.subarray(first + 1, second).toString('ascii');
  const hash = entry.subarray(second + 1).toString('hex');

  return {
    mode,
    pointer,
    hash
  }
}