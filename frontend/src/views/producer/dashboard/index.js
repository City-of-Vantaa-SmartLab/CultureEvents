import React from 'react';
import Appbar from './Appbar';
import EventExplorer from './event-explore';
import EditionForm from './edition-form';
import EventFinancialPanel from './event-financial-panel';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #becdd9;
  position: relative;
  display: flex;
  justify-content: space-between;
`;

export default class DashBoard extends React.Component {
  render() {
    return (
      <Wrapper>
        <Appbar />
        <EventExplorer />
        <EditionForm />
        <EventFinancialPanel />
      </Wrapper>
    );
  }
}
