import React from 'react';
import Appbar from './Appbar';
import EventExplorer from './event-explore';
import EditionForm from './edition-form';
import EventFinancialPanel from './event-financial-panel';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { connect } from '../../../utils';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #becdd9;
  position: relative;
  display: flex;
  justify-content: center;
`;

const InnerWrapper = styled(Wrapper)`
  max-width: 1600px;
  width: 100%;
  justify-content: flex-start;
  padding: 0 2rem;
`;

export default connect('store')(
  class DashBoard extends React.Component {
    render() {
      if (!this.props.store.user.isAuthenticated)
        return <Redirect to="./login" />;
      return (
        <Wrapper>
          <Appbar />
          <EventExplorer />
          <InnerWrapper>
            <EditionForm />
            <EventFinancialPanel />
          </InnerWrapper>
        </Wrapper>
      );
    }
  },
);
