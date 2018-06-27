import React from 'react';
import styled from 'styled-components';
import LogoBox from './LogoBox';
import SignInForm from './SignInForm';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.palette.primaryDeep};
  display: flex;
`;
const ContentBox = styled.div`
  flex: column center;
  margin: auto;
`;
export default class SignInView extends React.Component {
  render() {
    return (
      <Wrapper>
        <ContentBox>
          <LogoBox />
          <SignInForm />
        </ContentBox>
      </Wrapper>
    );
  }
}
