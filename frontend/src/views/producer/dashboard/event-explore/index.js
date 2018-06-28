import React from 'react';
import styled from 'styled-components';
import { render } from 'react-dom';

const Wrapper = styled.div`
  height: 100%;
  width: 22rem;
  background-color: white;
  box-shadow: 3px 0 12px rgba(0, 0, 0, 0.25);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
`;
const WrapperFlat = styled(Wrapper)`
  position: relative;
  background-color: transparent;
  box-shadow: none;
  margin-right: 2rem;
`;

export default class EventExplorer extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Wrapper />
        <WrapperFlat />
      </React.Fragment>
    );
  }
}
