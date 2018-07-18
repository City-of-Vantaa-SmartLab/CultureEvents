import React, { Component } from 'react';
import posed, { PoseGroup } from 'react-pose';
import styled, { withTheme } from 'styled-components';
import Typography from '../../../components/typography';
import TagPillGroup from '../../../components/tag-pill';
import Button from '../../../components/button';
import { connect } from '../../../utils';
import { tween } from 'popmotion';

const Sliddable = posed.div({
  exit: {
    y: '100%',
    transition: props => tween({ ...props, duration: 600 }),
  },
  enter: {
    y: '0%',
    transition: tween,
    transition: props => tween({ ...props, duration: 600 }),
  },
});

const Wrapper = styled(Sliddable)`
  position: fixed;
  overflow-y: auto;
  overflow-x: hidden;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 2rem 1rem;
  z-index: 10;
  background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%);

  & > div {
    margin: 0.5rem;
  }
  & > button {
    align-self: flex-end;
    margin: 1rem;
  }
`;

export default withTheme(
  connect('store')(
    class FilterView extends Component {
      render() {
        const { theme, store } = this.props;
        const area = [
          'Tikkurila',
          'Aviapolis',
          'Myyrmäki',
          'Korso',
          'Hakunila',
          'Koivukylä',
        ];
        return (
          <Wrapper pose={store.ui.filterViewActive ? 'enter' : 'exit'}>
            <Typography type="title" color={theme.palette.primaryDeep}>
              Rajaa hakua
            </Typography>
            <div>
              <Typography type="subheader">Lapsen ikä</Typography>
              <TagPillGroup
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
                highlightColor={theme.palette.primaryDeep}
                tags={area.map(a => ({ value: a, label: a }))}
              />
            </div>
            <div>
              <Typography type="subheader">Päivämäärä</Typography>
              <TagPillGroup
                style={{ justifyContent: 'space-around' }}
                highlightColor={theme.palette.primaryDeep}
                tags={[
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
                ]}
              />
            </div>
            <div>
              <Typography type="subheader">Tapahtuminen Typpi</Typography>
              <TagPillGroup
                highlightColor={theme.palette.primaryDeep}
                tags={['Kurssit Ja Työpajat', 'Näyttelyt', 'Esitykset'].map(
                  v => ({ value: v, label: v }),
                )}
              />
            </div>
            <Button
              backgroundColor={theme.palette.primaryDeep}
              onClick={store.toggleFilterView}
            >
              OK
            </Button>
          </Wrapper>
        );
      }
    },
  ),
);
