import parseAdd from "../../../src/utils/parseInstruction/parseAdd";
import { addInstructionData } from "../../data/data";

describe('Test parseAdd function, which parses couple bytes as the add instruction:', () => {
  test('Check if the header is parsed correctly and get the right encoded message.', () => {
    const [instruction, message] = addInstructionData();

    const [ addInstruction, _ ] = parseAdd(instruction, 0);

    expect(addInstruction.content).toBe(message);
  })
})