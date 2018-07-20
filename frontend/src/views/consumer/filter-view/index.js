import React, { Component } from 'react';
import posed, { PoseGroup } from 'react-pose';
import styled, { withTheme } from 'styled-components';
import Typography from '../../../components/typography';
import TagPillGroup from '../../../components/tag-pill';
import Button from '../../../components/button';
import { connect } from '../../../utils';
import { tween, easing } from 'popmotion';

const Sliddable = posed.div({
  exit: {
    y: '100%',
    transition: props =>
      tween({ ...props, duration: 300, ease: easing.easeIn }),
  },
  enter: {
    y: '0%',
    transition: tween,
    transition: props =>
      tween({ ...props, duration: 700, ease: easing.easeOut }),
  },
});

const Wrapper = styled(Sliddable)`
  position: fixed;
  overflow-y: scroll;
  overflow-x: hidden;
  top: 0;
  left: 0;
  height: 100%;

  z-index: 10;
  background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%);
`;
const ScrollContainer = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 2rem 1rem;
  padding-top: 7rem;

  & > div {
    margin: 0.5rem;
    flex-shrink: 0;
  }
  & > button {
    align-self: flex-end;
    margin: 1rem;
    flex-shrink: 0;
  }
`;

const MONTHS = [
  {
    value: 1,
    label: 'Tammikuu',
  },
  {
    value: 2,
    label: 'Helmikuu',
  },
  {
    value: 3,
    label: 'Maaliskuu',
  },
  {
    value: 4,
    label: 'Huhtikuu',
  },
  {
    value: 5,
    label: 'Toukokuu',
  },
  {
    value: 6,
    label: 'Kesäkuu',
  },
  {
    value: 7,
    label: 'Heinäkuu',
  },
  {
    value: 8,
    label: 'Elokuu',
  },
  {
    value: 9,
    label: 'Syyskuu',
  },
  {
    value: 10,
    label: 'Lokakuu',
  },
  {
    value: 11,
    label: 'Marraskuu',
  },
  {
    value: 12,
    label: 'Joulukuu',
  },
];
const EVENT_TYPES = ['Kurssit Ja Työpajat', 'Näyttelyt', 'Esitykset'];
const AREA = [
  'Tikkurila',
  'Aviapolis',
  'Myyrmäki',
  'Korso',
  'Hakunila',
  'Koivukylä',
];

export default withTheme(
  connect('store')(
    class FilterView extends Component {
      setAgeGroupFilter = value => {
        this.props.store.filters.setFilters('ageGroupLimits', value);
      };
      setAreaFilter = value => {
        this.props.store.filters.setFilters('area', value);
      };
      setDateFilter = value => {
        this.props.store.filters.setFilters('date', value);
      };
      setEventTypeFilter = value => {
        this.props.store.filters.setFilters('eventType', value);
      };

      render() {
        const { theme, store } = this.props;

        return (
          <Wrapper pose={store.ui.filterViewActive ? 'enter' : 'exit'}>
            <ScrollContainer>
              <Typography type="title" color={theme.palette.primaryDeep}>
                Rajaa hakua
              </Typography>
              <div>
                <Typography type="subheader">Lapsen ikä</Typography>
                <TagPillGroup
                  value={store.filters.ageGroupLimits}
                  onChange={this.setAgeGroupFilter}
                  highlightColor={theme.palette.primaryDeep}
                  tags={[
                    { value: '0-3', label: '0-3' },
                    { value: '3-6', label: '3-6' },
                    { value: '6-12', label: '6-12' },
                    { value: '13+', label: '13+' },
                  ]}
                />
              </div>
              <div>
                <Typography type="subheader">Alue</Typography>
                <TagPillGroup
                  value={store.filters.area}
                  onChange={this.setAreaFilter}
                  highlightColor={theme.palette.primaryDeep}
                  tags={AREA.map(a => ({ value: a, label: a }))}
                />
              </div>
              <div>
                <Typography type="subheader">Päivämäärä</Typography>
                <TagPillGroup
                  highlightColor={theme.palette.primaryDeep}
                  value={store.filters.date}
                  onChange={this.setDateFilter}
                  tags={MONTHS}
                />
              </div>
              <div>
                <Typography type="subheader">Tapahtuminen Typpi</Typography>
                <TagPillGroup
                  value={store.filters.eventType}
                  onChange={this.setEventTypeFilter}
                  highlightColor={theme.palette.primaryDeep}
                  tags={EVENT_TYPES.map(v => ({ value: v, label: v }))}
                />
              </div>
              <Button
                backgroundColor={theme.palette.primaryDeep}
                onClick={store.toggleFilterView}
              >
                OK
              </Button>
            </ScrollContainer>
          </Wrapper>
        );
      }
    },
  ),
);
