export interface RefDeltaObjectInfo {
  baseHash: string;
}

export function parseRefDeltaObjectContent(body: Buffer): RefDeltaObjectInfo {
  const baseHash = body.subarray(0, 20).toString('hex');
  
  const refDeltaObjectInfo: RefDeltaObjectInfo = {
    baseHash
  }

  return refDeltaObjectInfo;
}