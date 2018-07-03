import React from 'react';
import styled, { withTheme } from 'styled-components';
import Logo from '../../../components/logo';
import Typography from '../../../components/typography';
import Button from '../../../components/button';
import { connect } from '../../../utils';

const Wrapper = styled.div`
  width: 100%;
  padding: 1rem 2rem;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.32);
  display: flex;
  flex-direction: row;
  position: fixed;
  top: 0;
  left: 0;
  background-color: ${props => props.theme.palette.primaryDeep};
  z-index: 100;
  align-items: center;
  justify-content: space-between;
`;
const LogoSection = styled.div`
  display: flex;
  align-items: center;
  svg {
    height: 3.5rem;
    margin-right: 1rem;
  }
  h1,
  h4,
  h6,
  span {
    margin: 0;
    margin-right: 0.5rem;
    transform: translateY(10%);
    font-size: 2rem;
  }
`;
const LogoutButton = styled(Button)`
  && {
    background-color: ${props => props.theme.palette.secondary};
    color: black;
    border-color: transparent;
  }
`;

class Appbar extends React.Component {
  render() {
    const { theme } = this.props;
    return (
      <React.Fragment>
        <Wrapper>
          <LogoSection>
            <Logo noText />
            <Typography type="title" color="white">
              VANTAA
            </Typography>
            <Typography type="title" color={theme.palette.secondary}>
              KULTTUURIA
            </Typography>
          </LogoSection>
          <LogoutButton icon="logout" onClick={this.props.store.logout}>
            Logout
          </LogoutButton>
        </Wrapper>
      </React.Fragment>
    );
  }
}

export default withTheme(connect('store')(Appbar));
