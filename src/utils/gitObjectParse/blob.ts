export function parseBlobObjectContent(dividedDecryptedBuffer: Buffer[]): string {
  return dividedDecryptedBuffer[1].toString();
}