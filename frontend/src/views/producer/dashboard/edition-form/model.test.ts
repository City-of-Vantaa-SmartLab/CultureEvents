import formModel from './model';
test('initial default model is correct', () => {
  const expectation = {
    name: '',
    place: '',
  };
  expect(formModel.toJSON()).toBe(expectation);
});
