import FilterModel from './filter';

test('default filter object is correct', () => {
  const expectation = {
    ageGroupLimits: null,
    date: null,
    area: null,
    eventType: null,
  };
  const actual = FilterModel.create().toJSON();
  expect(actual).toEqual(expectation);
});

test('can add filter types', () => {
  const filterWithAgeGroup = FilterModel.create({ ageGroupLimits: '13+' });
  expect(filterWithAgeGroup.ageGroupLimits).toEqual('13+');
  const filterWithArea = FilterModel.create({ area: 'Aviapolis' });
  expect(filterWithArea.area).toEqual('Aviapolis');
});
