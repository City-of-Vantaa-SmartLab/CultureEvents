import React, { Component } from 'react';
import posed, { PoseGroup } from 'react-pose';
import styled, { withTheme } from 'styled-components';
import Typography from 'components/typography';
import TagPillGroup from 'components/tag-pill';
import Button from 'components/button';
import { connect } from 'utils';
import { tween, easing } from 'popmotion';
import * as consts from 'const.json';

const Sliddable = posed.div({
  exit: {
    y: '100%',
    opacity: 0,
    transition: props =>
      tween({ ...props, duration: 300, ease: easing.easeIn }),
  },
  enter: {
    y: '0%',
    opacity: 1,
    transition: props =>
      tween({ ...props, duration: 700, ease: easing.easeOut }),
  },
});

const Wrapper = styled(Sliddable) `
  opacity: 0;
  position: absolute;
  overflow-y: scroll;
  overflow-x: hidden;
  top: 0;
  left: 0;
  height: 100%;

  z-index: 10;
  background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%);
`;
const ScrollContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  min-height: 100%;
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

export default withTheme(
  connect('store')(
    class FilterView extends Component {
      setAgeGroupFilter = value => {
        this.props.store.filters.setFilters('ageGroupLimits', value);
      };
      setAreaFilter = value => {
        this.props.store.filters.setFilters('areas', value);
      };
      setDateFilter = value => {
        this.props.store.filters.setFilters('months', value);
      };
      setEventTypeFilter = value => {
        this.props.store.filters.setFilters('eventTypes', value);
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
                  multiple
                  tags={consts.ageGroup.map(a => ({ value: a, label: a }))}
                />
              </div>
              <div>
                <Typography type="subheader">Alue</Typography>
                <TagPillGroup
                  multiple
                  value={store.filters.areas}
                  onChange={this.setAreaFilter}
                  highlightColor={theme.palette.primaryDeep}
                  tags={consts.area.map(a => ({ value: a, label: a }))}
                />
              </div>
              <div>
                <Typography type="subheader">Ajankohta</Typography>
                <TagPillGroup
                  multiple
                  highlightColor={theme.palette.primaryDeep}
                  value={store.filters.months}
                  onChange={this.setDateFilter}
                  tags={MONTHS}
                />
              </div>
              <div>
                <Typography type="subheader">Tapahtumien tyyppi</Typography>
                <TagPillGroup
                  multiple
                  value={store.filters.eventTypes}
                  onChange={this.setEventTypeFilter}
                  highlightColor={theme.palette.primaryDeep}
                  tags={consts.eventType.map(v => ({ value: v, label: v }))}
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
