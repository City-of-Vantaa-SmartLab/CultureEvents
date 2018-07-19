import FilterModel from './filter';

test('default filter object is correct', () => {
  const expectation = {
    ageGroupLimit: null,
    date: null,
    area: null,
    eventType: null,
  };
  const actual = FilterModel.create().toJSON();
  expect(actual).toEqual(expectation);
});

test('can add filter types', () => {
  const filterWithAgeGroup = FilterModel.create({ ageGroupLimit: '13+' });
  expect(filterWithAgeGroup.ageGroupLimit).toEqual('13+');
  const filterWithArea = FilterModel.create({ area: 'Aviapolis' });
  expect(filterWithArea.area).toEqual('Aviapolis');
});
