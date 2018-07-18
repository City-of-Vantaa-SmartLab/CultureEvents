import { types, getSnapshot } from 'mobx-state-tree';
import EventModel from './event';

const FilterModel = types
  .model('FilterModel', {
    ageGroupLimit: types.maybe(
      types.enumeration('AgeGroupLimit', ['0-3', '3-6', '7-12', '13+']),
    ),
    area: types.maybe(
      types.enumeration('Area', [
        'Tikkurila',
        'Aviapolis',
        'Myyrmäki',
        'Korso',
        'Hakunila',
        'Koivukylä',
      ]),
    ),
    date: types.maybe(types.refinement(types.number, v => v > 0 && v < 13)),
    eventType: types.maybe(
      types.enumeration('EventType', [
        'Kurssit Ja Työpajat',
        'Näyttelyt',
        'Esitykset',
      ]),
    ),
  })
  .actions(self => ({
    setFilters(filterType, value) {
      if (!self.criteria.includes(filterType))
        throw new Error('Filter type is non-existent');
      self[filterType] = value;
    },
    removeFilter(filterType) {
      self.setFilters(filterType, null);
    },
  }))
  .views(self => ({
    get criteria() {
      return Object.keys(getSnapshot(self));
    },
  }));

export default FilterModel;
