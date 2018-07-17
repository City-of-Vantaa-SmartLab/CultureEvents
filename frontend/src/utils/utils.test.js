import * as utilFuncs from './index';

test('recursively remove id attributes on a tree', () => {
  const mockData = {
    id: 'is412rsss',
    arrays: [
      { id: 1, v: 2 },
      {
        id: 4,
        v: {
          id: 3,
          v: 4,
        },
      },
      {
        id: 'z',
        v: [{ id: 4, x: 3 }, { x: 42 }],
      },
    ],
  };

  const expectation = {
    arrays: [
      { v: 2 },
      {
        v: {
          v: 4,
        },
      },
      {
        v: [{ x: 3 }, { x: 42 }],
      },
    ],
  };
  expect(utilFuncs.removeIdRecursively(mockData)).toEqual(expectation);
});

test('clamping number works properly', () => {
  const clamper = utilFuncs.clamp(0, 12);

  expect(clamper(16)).toBe(12);
  expect(clamper(0)).toBe(0);
  expect(clamper(-4434343)).toBe(0);
  expect(clamper('34978782355')).toBe(0);
});
