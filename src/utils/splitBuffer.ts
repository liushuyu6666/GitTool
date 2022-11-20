export default function (buffer: Buffer, delimiter='\u0000') {
  const bufferArray: Buffer[] = [];

  let left: Buffer = buffer;
  while (left.indexOf(delimiter) !== -1) {
    const index = left.indexOf(delimiter);
    const former = left.subarray(0, index);
    left = left.subarray(index + 1);
    bufferArray.push(former);
  }
  bufferArray.push(left);

  return bufferArray;
}