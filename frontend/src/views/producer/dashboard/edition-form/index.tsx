import * as React from 'react';
import styled from 'styled-components';
import Editor from './Editor';

const Wrapper = styled.div`
  background-color: white;
  margin: 2rem;
  margin-top: calc(5rem + 3rem);
  border-radius: 8px;
  flex-grow: 1;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  flex-basis: 30rem;
`;

export default class EditionForm extends React.Component {
  public render() {
    return (
      <Wrapper>
        <Editor />
      </Wrapper>
    );
  }
}
