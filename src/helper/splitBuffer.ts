export default function (buffer: Buffer) {
  const bufferArray: Buffer[] = [];

  let left: Buffer = buffer;
  while (left.indexOf('\u0000') !== -1) {
    const delimiter = left.indexOf('\u0000');
    const former = left.slice(0, delimiter);
    left = left.slice(delimiter + 1);
    bufferArray.push(former);
  }
  bufferArray.push(left);

  return bufferArray;
}