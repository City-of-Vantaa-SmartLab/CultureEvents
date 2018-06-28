import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 2rem;
  margin-top: calc(3rem + 5rem);
  background-color: white;
  flex-grow: 1;
  border-radius: 8px;
  height: 30%;
`;

export default class EventFinancialPanel extends React.Component {
  render() {
    return <Wrapper />;
  }
}
