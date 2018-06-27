import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: white;
  margin: 2rem;
  margin-top: calc(5rem + 3rem);
  border-radius: 8px;
  flex-grow: 3;
`;

export default class EditionForm extends React.Component {
  public render() {
    return <Wrapper />;
  }
}
