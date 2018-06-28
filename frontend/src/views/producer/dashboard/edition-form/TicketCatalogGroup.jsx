import React from 'react';
import styled from 'styled-components';
import Button from '../../../../components/button';
import { InputField } from '../../../../components/form';
import { TicketCatalog } from '../../../../models/event';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  & > div {
    margin-bottom: 0;
    margin-right: 2rem;
  }
  & > :last-child {
    margin-right: 0;
  }
`;
const GreenButton = styled(Button)`
  &&& {
    background-color: ${props => props.theme.palette.deepGreen};
  }
`;

export default class TicketCatalogGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketTypeArr: props.defaultValue
        ? props.defaultValue
        : [defaulTicketTypeValue],
    };
  }

  render() {
    const inputBackgroundColor = this.props.background;
    return <React.Fragment />;
  }
}
