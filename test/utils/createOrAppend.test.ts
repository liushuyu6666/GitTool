import createOrAppend from "../../src/utils/createOrAppend";

describe('Test createOrAppend function, expect to create a new field if not exists or append the element in a certain field', () => {
  let container: Record<string, Array<string>>;
  const bag1 = { 'fruit': ['apple', 'pineapple', 'mango'] };
  const bag2 = { 'vegetable': ['lettuce', 'potato', 'tomato'] };

  test('Creating a new field in an empty container', () => {
    container = {};
    createOrAppend(container, 'fruit', bag1.fruit[0]);

    expect(container).toEqual({ 'fruit': ['apple']});

    createOrAppend(container, 'fruit', bag1.fruit[1]);

    expect(container).toEqual({ 'fruit': ['apple', 'pineapple']});
  });

  test('Creating a new field in a non-empty container', () => {
    container = {};
    createOrAppend(container, 'fruit', bag1.fruit[0]);
    createOrAppend(container, 'vegetable', bag2.vegetable[0]);

    expect(container).toEqual({ 'fruit': ['apple'], 'vegetable': ['lettuce']});
  });

})