import { inflateSync } from 'zlib';
import parseInstructions, { GitInstructions } from '../parseInstruction/parseInstructions';

export interface RefDeltaObjectInfo {
  instructions?: GitInstructions;
  baseHash?: string;
}

export function parseRefDeltaObjectContent(
  body: Buffer,
  hash: string,
): RefDeltaObjectInfo {
  const baseHash = body.subarray(0, 20).toString('hex');
  const deflate = body.subarray(20);

  try {
    const inflate = inflateSync(deflate);
    const instructions = parseInstructions(inflate);
    return {
      instructions,
      baseHash
    };
  } catch {
    console.error(
      `[inflate decoding error]: ${hash} (REF_DELTA) can not be inflated.`,
    );
    return {
      baseHash,
    };
  }
}
