import React from 'react';
import styled from 'styled-components';
import Editor from './Editor';
import { connect } from '../../../../utils';

const Wrapper = styled.div`
  background-color: white;
  margin: 1rem;
  margin-top: calc(5rem + 3rem);
  border-radius: 8px;
  flex-grow: 1.75;
  display: flex;
  flex-direction: column;
  flex-basis: 35rem;
  overflow-y: auto;
`;

class EditionForm extends React.Component {
  commitChange = data => this.props.store.alterEvent(data);
  render() {
    return (
      <Wrapper>
        <Editor
          selectedEvent={this.props.store.selectedEvent}
          onSubmit={this.commitChange}
        />
      </Wrapper>
    );
  }
}

export default connect('store')(EditionForm);
