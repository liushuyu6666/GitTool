import { ManipulateBuffer } from '../../src/mani/ManipulateBuffer';

describe('test ManipulateBuffer class', () => {
  let stock: ManipulateBuffer;

  describe('test when BE = true', () => {
    beforeEach(() => {
      stock = new ManipulateBuffer(true);
    });

    test('clean the shuttle tail by using 0b11001111', () => {
      stock.shuttle = 0b11001111; // TODO: need setter and getter
      stock.capacityOfShuttle = 2;

      stock.cleanTheShuttleTail();

      expect(stock.shuttle).toBe(0b11001100);
    });

    test('load 0bxx011xxx to the empty shuttle', () => {
      stock.fill(0b11011111, 2, 5);

      expect(stock.shuttle).toBe(0b01100000); // left alignment
      expect(stock.capacityOfShuttle).toBe(5);
    });

    test('load 0b00001111 to the empty shuttle', () => {
      stock.fill(0b00001111, 0, 8);

      expect(stock.shuttle).toBe(0b00000000);
      expect(stock.capacityOfShuttle).toBe(8);
      expect(stock.stock).toEqual(Buffer.from([0b00001111]));
    });

    test('load 0bx10011xx to the empty shuttle, then load 0bxx10xxxx, the shuttle is not full', () => {
      stock.fill(0b01001111, 1, 6);
      stock.fill(0b10101111, 2, 4);

      expect(stock.shuttle).toBe(0b10011100); // left alignment
      expect(stock.capacityOfShuttle).toBe(1);
    });

    test('load 0bx10011xx to the empty shuttle, then load 0bxx1011xx, the shuttle is full', () => {
      stock.fill(0b01001111, 1, 6);
      stock.fill(0b10101111, 2, 6);

      expect(stock.shuttle).toBe(0b10000000);
      expect(stock.capacityOfShuttle).toBe(7);
      expect(stock.stock).toEqual(Buffer.from([0b10011101]));
    });

    test('load multiple bytes', () => {
      stock.fill(0b10100111, 3, 8); // 0bxxx00111 shuttle: 0 ,shuttle: 00111000.
      stock.fill(0b01010101, 1, 8); // 0bx1010101 shuttle: 00111101, shuttle: 01010000.
      stock.fill(0b10010100, 1, 7); // 0bx001010x shuttle: 01010010, shuttle: 10000000.
      stock.fill(0b11111101, 0, 8); // 0b11111101 shuttle: 10111111, shuttle: 01000000.
      stock.fill(0b01010101, 3, 5); // 0bxxx10xxx shuttle: x       , shuttle: 01100000.

      // [00111101, 01010010, 10111111]

      expect(stock.shuttle).toBe(0b01100000); // left alignment
      expect(stock.capacityOfShuttle).toBe(4);
      expect(stock.stock).toEqual(
        Buffer.from([0b00111101, 0b01010010, 0b10111111]),
      );
    });

    test('test finish', () => {
      stock.fill(0b10100111, 3, 8); // 0bxxx00111
      stock.fill(0b01010101, 1, 8); // 0bx1010101
      stock.fill(0b10010100, 1, 7); // 0bx001010x
      stock.fill(0b11111101, 0, 8); // 0b11111101
      stock.fill(0b01010101, 3, 5); // 0bxxx10xxx
      stock.finish();

      // [00111101, 01010010, 10111111, 01100000]

      expect(stock.shuttle).toBe(0b00000000); // left alignment
      expect(stock.capacityOfShuttle).toBe(8);
      expect(stock.stock).toEqual(
        Buffer.from([0b00111101, 0b01010010, 0b10111111, 0b01100000]),
      );
    });

    test('test readIntBE', () => {
      stock.fill(0b10100111, 3, 8); // 0bxxx00111
      stock.fill(0b01010101, 1, 8); // 0bx1010101
      stock.fill(0b10010100, 1, 7); // 0bx001010x
      stock.fill(0b11111101, 0, 8); // 0b11111101
      stock.fill(0b01010101, 3, 5); // 0bxxx10xxx
      stock.finish();

      expect(stock.readIntBE()).toBe(
        Buffer.from([
          0b00111101, 0b01010010, 0b10111111, 0b01100000,
        ]).readInt32BE(),
      ); // left alignment
    });
  });

  describe('test when BE = false', () => {
    beforeEach(() => {
      stock = new ManipulateBuffer(false);
    });

    test('clean the shuttle tail by using 0b11001111', () => {
      stock.shuttle = 0b11001111; // TODO: need setter and getter
      stock.capacityOfShuttle = 2;

      stock.cleanTheShuttleTail();

      expect(stock.shuttle).toBe(0b00001111);
    });

    test('load 0bxx011xxx to the empty shuttle', () => {
      stock.fill(0b11011111, 2, 5);

      expect(stock.shuttle).toBe(0b00000011); // right alignment
      expect(stock.capacityOfShuttle).toBe(5);
    });

    test('load 0b00001111 to the empty shuttle', () => {
      stock.fill(0b00001111, 0, 8);

      expect(stock.shuttle).toBe(0b00000000);
      expect(stock.capacityOfShuttle).toBe(8);
      expect(stock.stock).toEqual(Buffer.from([0b00001111]));
    });

    test('load 0bx10011xx to the empty shuttle, then load 0bxx10xxxx, the shuttle is not full', () => {
      stock.fill(0b01001111, 1, 6);
      stock.fill(0b10101111, 2, 4);

      expect(stock.shuttle).toBe(0b01010011); // right alignment
      expect(stock.capacityOfShuttle).toBe(1);
    });

    test('load 0bx10011xx to the empty shuttle, then load 0bxx1011xx, the shuttle is full', () => {
      stock.fill(0b01001111, 1, 6);
      stock.fill(0b10101111, 2, 6);

      expect(stock.shuttle).toBe(0b00000001);
      expect(stock.capacityOfShuttle).toBe(7);
      expect(stock.stock).toEqual(Buffer.from([0b01110011]));
    });

    test('load multiple bytes', () => {
      stock.fill(0b10100111, 3, 8); // 0bxxx00111
      stock.fill(0b01010101, 1, 8); // 0bx1010101
      stock.fill(0b10010100, 1, 7); // 0bx001010x
      stock.fill(0b11111101, 0, 8); // 0b11111101
      stock.fill(0b01010101, 3, 5); // 0bxxx10xxx

      expect(stock.shuttle).toBe(0b00001011); // right alignment
      expect(stock.capacityOfShuttle).toBe(4);
      expect(stock.stock).toEqual(
        Buffer.from([0b11110100, 0b10101010, 0b10100111]),
      );
    });

    test('test finish', () => {
      stock.fill(0b10100111, 3, 8); // 0bxxx00111
      stock.fill(0b01010101, 1, 8); // 0bx1010101
      stock.fill(0b10010100, 1, 7); // 0bx001010x
      stock.fill(0b11111101, 0, 8); // 0b11111101
      stock.fill(0b01010101, 3, 5); // 0bxxx10xxx
      stock.finish();

      expect(stock.shuttle).toBe(0b00000000); // right alignment
      expect(stock.capacityOfShuttle).toBe(8);
      expect(stock.stock).toEqual(
        Buffer.from([0b00001011, 0b11110100, 0b10101010, 0b10100111]),
      );
    });

    test('test readIntBE', () => {
      stock.fill(0b10100111, 3, 8); // 0bxxx00111
      stock.fill(0b01010101, 1, 8); // 0bx1010101
      stock.fill(0b10010100, 1, 7); // 0bx001010x
      stock.fill(0b11111101, 0, 8); // 0b11111101
      stock.fill(0b01010101, 3, 5); // 0bxxx10xxx
      stock.finish();

      expect(stock.readIntBE()).toBe(
        Buffer.from([
          0b00001011, 0b11110100, 0b10101010, 0b10100111,
        ]).readInt32BE(),
      ); // right alignment
    });
  });
});
