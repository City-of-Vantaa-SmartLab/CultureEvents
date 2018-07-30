import RootStore from './index';

it('finds an event if there exists an event', () => {
  const fakeEvents = {
    1: {
      id: 32,
      name: 'An event',
    },
    2: {
      id: 2,
      name: 'The event',
    },
  };
  const store = RootStore.create({
    events: fakeEvents,
  });
  const foundEvent = store.findEvent(2);
  const notfoundEvent = store.findEvent(123);

  expect(foundEvent.name).toBe(fakeEvents[2].name);
  expect(notfoundEvent).toBeUndefined();
});
