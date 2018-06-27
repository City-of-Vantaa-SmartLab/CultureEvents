import React from 'react';
import styled from 'styled-components';

const Headline = styled.h1`
  color: ${props => props.color};
  font-size: 2.85rem;
  font-weight: 900;
`;
const Title = styled.h4`
  color: ${props => props.color};
  font-size: 2.14rem;
  font-weight: 700;
`;
const Subheader = styled.h6`
  color: ${props => props.color};
  font-size: 1.42rem;
  font-weight: 400;
`;
const LargeBody = styled.span`
  color: ${props => props.color};
  font-size: 1rem;
  font-weight: 600;
`;
const Body = styled.span`
  color: ${props => props.color};
  font-size: 1rem;
  font-weight: 400;
`;
const SecondaryBody = styled.span`
  color: ${props => props.color};
  font-size: 0.86rem;
  font-weight: 400;
  opacity: 0.7;
`;
const ButtonLabel = styled.span`
  color: ${props => props.color};
  font-size: 0.71rem;
  font-weight: 600;
`;

export default class Typography extends React.Component {
  render() {
    const { color, type, children, ...props } = this.props;
    switch (type) {
      case 'headline':
        return (
          <Headline {...props} color={color}>
            {children}
          </Headline>
        );
      case 'title':
        return (
          <Title {...props} color={color}>
            {children}
          </Title>
        );
      case 'subheader':
        return (
          <Subheader {...props} color={color}>
            {children}
          </Subheader>
        );
      case 'largebody':
        return (
          <LargeBody {...props} color={color}>
            {children}
          </LargeBody>
        );
      case 'body':
        return (
          <Body {...props} color={color}>
            {children}
          </Body>
        );
      case 'secondarybody':
        return (
          <SecondaryBody {...props} color={color}>
            {children}
          </SecondaryBody>
        );
      case 'buttonlabel':
        return (
          <ButtonLabel {...props} color={color}>
            {children}
          </ButtonLabel>
        );
      default:
        throw new Error('You provide a wrong type for typography');
    }
  }
}
