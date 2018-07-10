import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import Logo from '../../../components/logo';
import Typography from '../../../components/typography';
import Button from '../../../components/button';

const Wrapper = styled.div`
  width: 100%;
  padding: 1rem;
  background-color: ${props => props.theme.palette.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 3px 6px 12px rgba(0, 0, 0, 0.3);
`;
const LeftBox = styled.div`
  display: flex;
  align-items: center;
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
`;

const LogoBox = props => (
  <LeftBox>
    <Logo noText />
    <div>
      <Typography type="subheader">Vantaa</Typography>
      <Typography type="subheader">Kultuuria</Typography>
    </div>
  </LeftBox>
);

export default withTheme(
  class Appbar extends Component {
    render() {
      return (
        <Wrapper>
          <LogoBox />
          <div>
            <Button backgroundColor={this.props.theme.palette.primaryDeep}>
              Rajaa hakua
            </Button>
          </div>
        </Wrapper>
      );
    }
  },
);
