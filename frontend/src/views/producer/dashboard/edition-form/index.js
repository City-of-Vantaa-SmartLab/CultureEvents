import React from 'react';
import styled from 'styled-components';
import Editor from './Editor';
import { connect } from 'utils';

const Wrapper = styled.div`
  margin: 1rem;
  margin-top: calc(5rem + 3rem);
  flex-grow: 1.75;
  display: flex;
  flex-direction: column;
  flex-basis: 35rem;
  position: relative;
  overflow-y: auto;
`;

class EditionForm extends React.Component {
  commitChange = data => this.props.store.patchEvent(data);
  render() {
    return (
      <Wrapper id="theWrapper">
        <Editor
          selectedEvent={this.props.store.selectedEvent}
          onSubmit={this.commitChange}
        />
      </Wrapper>
    );
  }
}

export default connect('store')(EditionForm);
