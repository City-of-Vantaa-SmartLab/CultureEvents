import { types, getSnapshot, getMembers } from 'mobx-state-tree';
import { values } from 'mobx';

const FilterModel = types
  .model('FilterModel', {
    ageGroupLimit: types.maybe(
      types.enumeration('AgeGroupLimit', ['0-3', '3-6', '6-12', '13+']),
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
    clearAllFilters() {
      self.ageGroupLimit = null;
      self.area = null;
      self.eventType = null;
      self.date = null;
    },
  }))
  .views(self => ({
    get criteria() {
      return Object.keys(getSnapshot(self));
    },
    get hasActiveFilter() {
      return !values(self).every(c => c == null);
    },
  }));

export default FilterModel;
