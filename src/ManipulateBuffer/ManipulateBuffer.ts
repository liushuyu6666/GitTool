export interface ManipulateBufferInterface {
  buffer: Buffer;

  stock: number;

  capacityOfStock: number;

  cleanTheStockTail(): void;

  assertStockIsByte(): void;

  fill(value: number, validSize: number): void;


}

// TODO: need setter and getter
export class ManipulateBuffer implements ManipulateBufferInterface {
  buffer: Buffer;

  stock: number;

  capacityOfStock: number;

  constructor() {
    this.buffer = Buffer.alloc(0);

    this.stock = 0x00; // one byte

    this.capacityOfStock = 8;
  }

  cleanTheStockTail() {
    this.stock = this.stock >> this.capacityOfStock << this.capacityOfStock;
  }

  assertStockIsByte() {
    if (this.stock > 0xff) throw new Error('[ManipulateBuffer error]: stock more that one byte');
  }

  fill(value: number, validSize: number) {
    if (value > 0xff || value < 0) {
      throw new Error(`[ManipulateBuffer error]: input value is illegal`);
    }
    if (validSize > 8 || validSize < 1) {
      throw new Error(`[ManipulateBuffer error]: input validSize is illegal`)
    }

    // clear value
    value = value & 0xff; // ensure only lowest 8 bits are left.
    value = value >> (8 - validSize) << (8 - validSize) // ensure only valid bits are left

    // bits left after loading
    const toBeLeft = value << this.capacityOfStock & 0xff;
    const newValidSize = Math.max(0, validSize - this.capacityOfStock); // no bit left if it is 0

    this.cleanTheStockTail();

    // load value to the stock
    const toBeLoaded = value >> 8 - this.capacityOfStock;
    this.stock = this.stock | toBeLoaded;
    this.capacityOfStock = Math.max(0, this.capacityOfStock - validSize); // new capacity size
    
    this.cleanTheStockTail();
    this.assertStockIsByte();

    // append stock to the buffer if necessary and build new stock
    if (this.capacityOfStock === 0) {
      const uint8 = new Uint8Array([this.stock]);
      this.buffer = Buffer.concat([this.buffer, uint8], this.buffer.length + uint8.length);
      this.stock = toBeLeft;
      this.capacityOfStock = 8 - newValidSize;
    }
  }
}