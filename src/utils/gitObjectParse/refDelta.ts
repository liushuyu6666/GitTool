import { inflateSync } from 'zlib';
import { getFirstVariableLengthIntegerFromWithoutType } from '../../manipulateBuffer/getFirstVariableLengthInteger';
import getMarginValue from '../getMarginValue';

export interface RefDeltaObjectInfo {
  negativeOffset: number;
  inflate?: Buffer;
}

export function parseRefDeltaObjectContent(
  body: Buffer,
  hash: string,
): RefDeltaObjectInfo {
  const [negativeOffsetBeforeMarginValue, startIndex] =
    getFirstVariableLengthIntegerFromWithoutType(body, true);
  const marginValue = getMarginValue(startIndex);
  const negativeOffset = negativeOffsetBeforeMarginValue + marginValue;

  const deflate = body.subarray(startIndex);

  try {
    const inflate = inflateSync(deflate);
    return {
      negativeOffset,
      inflate,
    };
  } catch {
    console.error(
      `${hash} can not be inflated: negativeOffset is ${negativeOffset}`,
    );
    return {
      negativeOffset,
    };
  }
}
