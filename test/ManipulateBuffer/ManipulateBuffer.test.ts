import { ManipulateBuffer } from "../../src/ManipulateBuffer/ManipulateBuffer";

describe('test ManipulateBuffer class', () => {
  let buffer: ManipulateBuffer;

  beforeEach(() => {
    buffer = new ManipulateBuffer();
  });

  test('clean the stock tail by using 0b00001111', () => {
    buffer.stock = 0b00001111; // TODO: need setter and getter
    buffer.capacityOfStock = 2;

    buffer.cleanTheStockTail();
    
    expect(buffer.stock).toBe(0b00001100);
  });

  test('load 0b10011xxx to the empty stock', () => {
    buffer.fill(0b10011111, 5); // 0b10011000

    expect(buffer.stock).toBe(0b10011000);
    expect(buffer.capacityOfStock).toBe(3);
  })

  test('load 0b00001111 to the empty stock', () => {
    buffer.fill(0b00001111, 8);

    expect(buffer.stock).toBe(0b00000000);
    expect(buffer.capacityOfStock).toBe(8);
    expect(buffer.buffer).toEqual(Buffer.from([0b00001111]));
  })

  test('load 0b10011xxx to the empty stock, then load 0b10xxxxxx, the stock is not full', () => {
    buffer.fill(0b10011111, 5); // 0b10011xxx
    buffer.fill(0b10111111, 2); // 0b10xxxxxx
    
    expect(buffer.stock).toBe(0b10011100);
    expect(buffer.capacityOfStock).toBe(1);
  })

  test('load 0b10011xxx to the empty stock, then load 0b1011xxxx, the stock is full', () => {
    buffer.fill(0b10011111, 5); // 0b10011xxx
    buffer.fill(0b10111111, 4); // 0b1011xxxx
    
    expect(buffer.stock).toBe(0b10000000);
    expect(buffer.capacityOfStock).toBe(7);
    expect(buffer.buffer).toEqual(Buffer.from([0b10011101]))
  })

  test('load 0b10101010 to the empty stock, then load 0b01010101 to check the order of the buffer, so the buffer.size > 1', () => {
    buffer.fill(0b10101010, 8); // 0b10011xxx
    buffer.fill(0b01010101, 8); // 0b1011xxxx
    
    expect(buffer.stock).toBe(0b00000000);
    expect(buffer.capacityOfStock).toBe(8);
    expect(buffer.buffer).toEqual(Buffer.from([0b10101010, 0b01010101]))
  })

  test('load five times', () => {
    buffer.fill(0b10101000, 5); // 0b10101xxx
    buffer.fill(0b01100110, 7); // 0b0110011x
    buffer.fill(0b01111101, 4); // 0b0111xxxx
    buffer.fill(0b00110111, 5); // 0b00110xxx
    buffer.fill(0b11010011, 8); // 0b11010011

    // 10101011, 00110111, 00110110, (10011)
    
    expect(buffer.stock).toBe(0b10011000);
    expect(buffer.capacityOfStock).toBe(3);
    expect(buffer.buffer).toEqual(Buffer.from([0b10101011, 0b00110111, 0b00110110]))
  })
});