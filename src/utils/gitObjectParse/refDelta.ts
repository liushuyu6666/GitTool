// import { inflateSync } from "zlib";

export interface RefDeltaObjectInfo {
  baseHash: string;
}

export function parseRefDeltaObjectContent(body: Buffer): RefDeltaObjectInfo {
  const baseHash = body.subarray(0, 20).toString('hex');
  // const deflatedData = body.subarray(20);

  // const inflate = inflateSync(body);
  // console.log(inflate);
  
  const refDeltaObjectInfo: RefDeltaObjectInfo = {
    baseHash
  }

  return refDeltaObjectInfo;
}