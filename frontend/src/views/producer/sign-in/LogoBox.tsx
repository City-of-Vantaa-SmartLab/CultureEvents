import * as React from 'react';
import styled from 'styled-components';
import Logo from '../../../components/logo';
import Text from '../../../components/typography';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  align-items: center;

  svg {
    width: 7rem;
  }
`;

const LogoText = styled(Text)`
  margin-bottom: 0;
  margin-top: 2rem;
`;
const FlavorText = styled(Text)`
  display: block;
  text-align: right;
`;

export default class LogoBox extends React.Component {
  public render() {
    return (
      <Wrapper>
        <Logo noText />
        <div>
          <LogoText type="title" color="#FEF283">
            VANTAA KULTTURIA
          </LogoText>
          <FlavorText type="body" color="white">
            Producer
          </FlavorText>
        </div>
      </Wrapper>
    );
  }
}
