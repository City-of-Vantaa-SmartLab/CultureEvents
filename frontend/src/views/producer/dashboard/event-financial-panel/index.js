import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 1rem;
  margin-top: calc(3rem + 5rem);
  background-color: white;
  flex-grow: 1;
  border-radius: 8px;
  height: 30rem;
`;

export default class EventFinancialPanel extends React.Component {
  render() {
    return <Wrapper />;
  }
}
