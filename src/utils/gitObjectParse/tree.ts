export interface GitTreeObjectFileEntry {
  pointer: string;
  mode: string; // TODO: import { Mode } from "./enum";
  hash: string;
}

// /**
//  *
//  * @param dividedDecryptedBuffer The array of decrypted buffer divided by 0x00.
//  * The format:
//  *   1. The first element `dividedDecryptedBuffer[0]`: {tree}0x20${size}.
//  *   2. The second element `${modeNumber}0x20{fileName}`.
//  *   3. The third element `${20bytesHex}${modeNumber}0x20{fileName}`.
//  *   4. The forth element `${20bytesHex}${modeNumber}0x20{fileName}`.
//  *   5. The last element `${20bytesHex}`
//  * @returns An `GitTreeObjectFileEntry` array.
//  */
// export function parseTreeObjectContent(dividedDecryptedBuffer: Buffer[]): GitTreeObjectFileEntry[] {
//   const fileEntries: GitTreeObjectFileEntry[] = [];
//   console.log(dividedDecryptedBuffer);
//   if (dividedDecryptedBuffer.length >= 3) {
//     let modeAndFile = dividedDecryptedBuffer[1].toString();
//     let i = 2;
//     while (modeAndFile.length > 0) {
//       const hash = dividedDecryptedBuffer[i].subarray(0, 20).toString('hex');
//       const fileEntry: GitTreeObjectFileEntry = {
//         'pointer': modeAndFile.split(' ')[1],
//         'mode': modeAndFile.split(' ')[0],
//         'hash': hash
//       }
//       fileEntries.push(fileEntry);
//       modeAndFile = dividedDecryptedBuffer[i].subarray(20).toString();
//       i++;
//     }
//   }

//   return fileEntries;
// }

/**
 *
 * @param dividedDecryptedBuffer The array of decrypted buffer divided by 0x00.
 * The format:
 *   1. The first element `dividedDecryptedBuffer[0]`: {tree}0x20${size}.
 *   2. The second element `${modeNumber}0x20${fileName}`.
 *   3. The third element `${20bytesHex}${modeNumber}0x20${fileName}`.
 *   4. The forth element `${20bytesHex}${modeNumber}0x20${fileName}`.
 *   5. The last element `${20bytesHex}`
 * We process the array to assemble the entry `${modeNumber}0x20${fileName}0x00${20bytesHex}`
 * @returns An `GitTreeObjectFileEntry` array.
 */
export function parseTreeObjectContent(
  dividedDecryptedBuffer: Buffer[],
): GitTreeObjectFileEntry[] {
  const fileEntries: GitTreeObjectFileEntry[] = [];

  // start from the second element and end at the last one.
  let former = dividedDecryptedBuffer[1];
  for (let i = 2; i < dividedDecryptedBuffer.length; i++) {
    const concat = Buffer.concat([
      former, // `${modeNumber}0x20${fileName}`
      Uint8Array.from([0x00]),
      dividedDecryptedBuffer[i].subarray(0, 20), // `${20bytesHex}`
    ]);
    const fileEntry = parseTreeEntry(concat);
    fileEntries.push(fileEntry);
    former = dividedDecryptedBuffer[i].subarray(20);
  }

  return fileEntries;
}

/**
 * @param entry The deflated entry of the tree, format should be:
 * `${modeNumber}0x20${fileName}0x00${20bytesHex}`
 *
 * @returns The `GitTreeObjectFileEntry`
 */
export function parseTreeEntry(entry: Buffer): GitTreeObjectFileEntry {
  const first = entry.indexOf(0x20); // separate mode and others
  const second = entry.indexOf(0x00); // separate file name and hex

  const mode = entry.subarray(0, first).toString('ascii');
  const pointer = entry.subarray(first + 1, second).toString('ascii');
  const hash = entry.subarray(second + 1).toString('hex');

  return {
    mode,
    pointer,
    hash,
  };
}
