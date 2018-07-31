import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import Logo from '../../../components/logo';
import Typography from '../../../components/typography';
import Button from '../../../components/button';
import { connect } from '../../../utils';
import posed, { PoseGroup } from 'react-pose';
import { tween } from 'popmotion';
import { format } from 'date-fns';
import fiLocale from 'date-fns/locale/fi';

const Sliddable = posed.div({
  exit: {
    y: '-100%',
    transition: props => tween({ ...props, duration: 600 }),
  },
  enter: {
    y: '0%',
    transition: props => tween({ ...props, duration: 600 }),
  },
});
const Wrapper = styled(Sliddable)`
  width: 100%;
  padding: 1rem;
  background-color: ${props => props.bgColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 3px 6px 12px rgba(0, 0, 0, 0.4);
  z-index: 100;
`;
const LeftBox = styled.div`
  display: flex;
  align-items: center;
  margin-right: 2rem;
  svg {
    width: 3rem;
    height: auto;
    margin-right: 1rem;
    filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.22));
  }
  h6 {
    margin: 0;
    font-weight: 700;
    line-height: 1;
  }
  * {
    flex-shrink: 0;
  }
  .button-container {
    display: flex;
    align-items: center;
    button {
      margin-right: 0.5rem;
    }
  }
`;

const LogoBox = props => (
  <LeftBox>
    <Logo noText />
    <div>
      <Typography type="subheader">Vantaa</Typography>
      <Typography type="subheader">Kulttuuria</Typography>
    </div>
  </LeftBox>
);
const FlexBox = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const FilterStrings = ({ filters }) => {
  return (
    <FlexBox>
      {Object.keys(filters)
        .filter(f => filters[f] !== null && filters[f].length > 0)
        .map((key, index, arr) => {
          let value = filters[key];

          if (value.length > 1) {
            if (key === 'areas') value = `${value.length} aluetta`;
            if (key === 'months') value = `${value.length} kuukautta`;
            if (key === 'ageGroupLimits') value = value.join(', ');
            if (key === 'eventTypes') value = `${value.length} typpia`;
          } else if (key === 'months') {
            value = format(new Date(2018, filters[key] - 1, 5), 'MMMM YYYY', {
              locale: fiLocale,
            });
          }
          const hasDot = index !== arr.length - 1 && arr.length > 1;

          return (
            <Typography
              style={{ textTransform: 'capitalize', whiteSpace: 'pre-wrap' }}
              key={index}
              type="body"
              color="white"
            >
              {' ' + value} {hasDot && '•'}
            </Typography>
          );
        })}
    </FlexBox>
  );
};

export default withTheme(
  connect('store')(
    class Appbar extends Component {
      render() {
        const { theme, store } = this.props;
        const { filters } = store;

        return (
          <PoseGroup>
            {!filters.hasActiveFilter ? (
              <Wrapper key="app-bar-no-filter" bgColor={theme.palette.primary}>
                <LogoBox />
                <Button
                  backgroundColor={theme.palette.primaryDeep}
                  onClick={this.props.store.toggleFilterView}
                >
                  Rajaa hakua
                </Button>
              </Wrapper>
            ) : (
              <Wrapper
                key="app-bar-has-filter"
                bgColor={theme.palette.primaryDeep}
              >
                <LeftBox
                  style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                >
                  <div className="button-container">
                    <Button
                      icon="arrow-left"
                      backgroundColor="transparent"
                      onClick={store.toggleFilterView}
                    />
                    <Typography type="subheader" color="white">
                      Rajaa hakua
                    </Typography>
                  </div>
                  <FilterStrings filters={filters.toJSON()} />
                </LeftBox>
                <Button
                  backgroundColor={this.props.theme.palette.red}
                  onClick={this.props.store.filters.clearAllFilters}
                >
                  POISTA
                </Button>
              </Wrapper>
            )}
          </PoseGroup>
        );
      }
    },
  ),
);
