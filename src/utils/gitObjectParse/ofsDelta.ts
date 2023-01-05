import { inflateSync } from 'zlib';
import { getFirstVariableLengthIntegerFromWithoutType } from '../../manipulateBuffer/getFirstVariableLengthInteger';
import getMarginValue from '../getMarginValue';
import parseInstructions, {
  GitInstructions,
} from '../parseInstruction/parseInstructions';

export interface OfsDeltaObjectInfo {
  instructions?: GitInstructions;
  baseHash: string;
}

export function parseOfsDeltaObjectContent(
  body: Buffer,
  hash: string,
  offsets: Record<string, number>,
  swapOffsets: Record<number, string>,
): OfsDeltaObjectInfo {
  const [negativeOffsetBeforeMarginValue, startIndex] =
    getFirstVariableLengthIntegerFromWithoutType(body, true);
  const marginValue = getMarginValue(startIndex);
  const negativeOffset = negativeOffsetBeforeMarginValue + marginValue;

  const deflate = body.subarray(startIndex);

  const currOffset: number = offsets[hash];
  if (!currOffset) {
    throw new Error(
      `[mismatch of hash and offset]: no hash ${hash} found in offset table, negativeOffset is ${negativeOffset}.`,
    );
  }
  const baseOffset: number = currOffset - negativeOffset;

  const baseHash: string = swapOffsets[baseOffset];

  let inflate: Buffer;
  try {
    inflate = inflateSync(deflate);
  } catch {
    console.error(
      `${hash} can not be inflated: negativeOffset is ${negativeOffset}`,
    );
    return {
      baseHash,
    };
  }

  const instructions = parseInstructions(inflate);

  return {
    instructions,
    baseHash,
  };
}
