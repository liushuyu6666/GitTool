export default function (buffer: Buffer, delimiter=0x00): [Buffer, Buffer] {
  const idx = buffer.indexOf(delimiter);
  return [buffer.subarray(0, idx), buffer.subarray(idx + 1)];
}