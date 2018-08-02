import { types, getSnapshot, getMembers } from 'mobx-state-tree';
import { values } from 'mobx';

const FilterModel = types
  .model('FilterModel', {
    ageGroupLimits: types.optional(
      types.array(
        types.maybe(
          types.enumeration('ageGroupLimits', ['0-3', '3-6', '6-12', '13+']),
        ),
      ),
      [],
    ),
    areas: types.optional(
      types.array(
        types.maybe(
          types.enumeration('Area', [
            'Tikkurila',
            'Aviapolis',
            'Myyrmäki',
            'Korso',
            'Hakunila',
            'Koivukylä',
            'Kivistö',
          ]),
        ),
      ),
      [],
    ),
    months: types.optional(
      types.array(
        types.maybe(types.refinement(types.number, v => v > 0 && v < 13)),
      ),
      [],
    ),
    eventTypes: types.optional(
      types.array(
        types.maybe(
          types.enumeration('EventType', [
            'Kurssit Ja Työpajat',
            'Näyttelyt',
            'Esitykset',
          ]),
        ),
      ),
      [],
    ),
  })
  .actions(self => ({
    setFilters(filterType, values) {
      if (!self.criteria.includes(filterType))
        throw new Error('Filter type is non-existent');
      self[filterType] = values;
    },
    removeFilter(filterType) {
      self.setFilters(filterType, []);
    },
    clearAllFilters() {
      self.ageGroupLimits = [];
      self.areas = [];
      self.eventTypes = [];
      self.months = [];
    },
  }))
  .views(self => ({
    get criteria() {
      return Object.keys(getSnapshot(self));
    },
    get hasActiveFilter() {
      return values(self).some(c => c.length > 0);
    },
  }));

export default FilterModel;
