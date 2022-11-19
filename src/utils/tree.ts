export interface GitTreeObjectEntry {
  mode: string;
  fileName: string;
  hex: string;
}
/**
 * 
 * @param entry The entry of the tree, format should be: 
 * <mode>0x20<fileName>0x00<20bytesHex>
 */
export function parseTreeEntryInPack(entry: Buffer): GitTreeObjectEntry {
  const first = entry.indexOf(0x20); // separate mode and others
  const second = entry.indexOf(0x00); // separate file name and hex

  const mode = entry.subarray(0, first).toString('ascii');
  const fileName = entry.subarray(first + 1, second).toString('ascii');
  const hex = entry.subarray(second + 1).toString('hex');

  return {
    mode,
    fileName,
    hex
  }
}