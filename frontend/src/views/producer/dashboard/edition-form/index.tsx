import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 50rem;
  background-color: white;
  margin-left: 3rem;
  margin-top: calc(5rem + 3rem);
  border-radius: 8px;
`;

export default class EditionForm extends React.Component {
  public render() {
    return <Wrapper />;
  }
}
