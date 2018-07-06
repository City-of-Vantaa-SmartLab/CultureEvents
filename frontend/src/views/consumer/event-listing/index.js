import React, { Component } from 'react';
import styled from 'styled-components';
import EventCard from '../../../components/event-card';
import { connect } from '../../../utils';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export default connect('store')(
  class EventListing extends Component {
    render() {
      return <Wrapper />;
    }
  },
);
