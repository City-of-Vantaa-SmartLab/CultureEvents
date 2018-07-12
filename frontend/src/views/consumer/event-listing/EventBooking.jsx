import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import Typography from '../../../components/typography';
import chroma from 'chroma-js';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { toRgba, genRandomKey, connect, clamp } from '../../../utils';
import Button, { ButtonGroup } from '../../../components/button';
import Icon from '../../../../node_modules/antd/lib/icon';
import Form, { InputField } from '../../../components/form';
import TicketInputSet from './TicketInputSet';
import posed from 'react-pose';
// posed components
const Collapsible = posed.div({
  collapsed: {
    opacity: 0,
    height: 0,
    flip: true,
  },
  natural: {
    opacity: 1,
    height: '100%',
    flip: true,
  },
});
// styled componnents
const Wrapper = styled.div`
  padding: 1rem;
  margin-top: 1rem;
  width: 100%;
  background-color: ${props =>
    toRgba(
      chroma(props.bgColor)
        .alpha(0.3)
        .rgba(),
    )};
`;
const FormListItemWrapper = styled.div`
  width: 100%;
  margin-bottom: 0.5rem;
  & > div {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    & > * {
      margin: 0.5rem 0;
    }
  }
`;
const CustomerGroupButton = styled(Button)`
  &&& {
    padding: 0.5rem;
    width: 100%;
    height: auto;
    font-size: 0.86rem;
    border-radius: 8px;
  }
`;
const FlexBoxHorizontal = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0;

  & > *:first-child {
    margin-right: 1rem;
  }
`;
const TotalAmountCalculated = styled(FlexBoxHorizontal)`
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  justify-content: space-between;
  * {
    margin-bottom: 0;
  }
`;

// child components
const FormListItem = props => {
  return (
    <FormListItemWrapper>
      <Typography type="largebody">{props.title}</Typography>
      <Collapsible pose={props.disabled ? 'collapsed' : 'natural'}>
        {props.children}
      </Collapsible>
    </FormListItemWrapper>
  );
};

// main class
export default connect('store')(
  class EventBooking extends Component {
    internalState = observable({
      customerGroup: undefined,
      tickets: [
        {
          id: 'first',
          label: this.props.event.ticketCatalog[0].ticketDescription,
          value: this.props.event.ticketCatalog[0].id,
          amount: 0,
        },
      ],
    });

    render() {
      const { event } = this.props;
      const { internalState } = this;

      const isPrivateCustomer = internalState.customerGroup == 'private';
      const isGroupConductorCustomer = internalState.customerGroup == 'group';
      const totalCost = internalState.tickets.reduce((acc, curr) => {}, 0);

      return (
        <Wrapper bgColor={event.themeColor}>
          <Typography type="title">Varaa/osta lippu</Typography>
          <FormListItem title="1 - Olen">
            <ButtonGroup style={{ display: 'flex' }}>
              <CustomerGroupButton
                backgroundColor={
                  isGroupConductorCustomer ? event.themeColor : 'white'
                }
                onClick={e => (internalState.customerGroup = 'group')}
                onTouchEnd={e => (internalState.customerGroup = 'group')}
              >
                Ryhmänohjaaja
                {isGroupConductorCustomer && <Icon type="check" />}
              </CustomerGroupButton>
              <CustomerGroupButton
                onClick={e => (internalState.customerGroup = 'private')}
                onTouchEnd={e => (internalState.customerGroup = 'private')}
                backgroundColor={isPrivateCustomer ? event.themeColor : 'white'}
              >
                Yksityishenkilö
                {isPrivateCustomer && <Icon type="check" />}
              </CustomerGroupButton>
            </ButtonGroup>
          </FormListItem>
          <FormListItem
            title="2 - Lippujen määrä"
            disabled={!internalState.customerGroup}
          >
            <TicketInputSet
              ticketCatalog={event.ticketCatalog}
              tickets={internalState.tickets}
            />
            <Button
              disabled={
                internalState.tickets.length >= event.ticketCatalog.length
              }
              backgroundColor={event.themeColor}
              icon="plus"
              onClick={e =>
                internalState.tickets.push({
                  label: '',
                  amount: 0,
                  id: genRandomKey(),
                })
              }
            >
              Lisää Lipputyppi
            </Button>
            <TotalAmountCalculated>
              <Typography type="subheader">Yhteissumma</Typography>
              <Typography type="subheader" color={event.themeColor}>
                313 €
              </Typography>
            </TotalAmountCalculated>
          </FormListItem>
          <FormListItem
            title="3 - Tiedot varausta varten"
            disabled={!internalState.customerGroup}
          >
            {isPrivateCustomer ? (
              <Form>
                <InputField lightMode type="text" label="Nimi" mandatory />
                <InputField
                  lightMode
                  type="text"
                  label="Puhelinumero"
                  mandatory
                />
                <InputField lightMode type="text" label="Sahköposti" />
              </Form>
            ) : (
              <Form>
                <InputField
                  lightMode
                  type="text"
                  label="Päiväkoti / koulu"
                  mandatory
                />
                <InputField
                  lightMode
                  type="text"
                  label="Ryhmä / luokka"
                  mandatory
                />
                <InputField lightMode type="text" label="Puhelinnumero" />
                <InputField lightMode type="text" label="Sähköposti" />
              </Form>
            )}
            <FlexBoxHorizontal>
              {isGroupConductorCustomer && (
                <Button
                  type="dashed"
                  backgroundColor="white"
                  style={{ alignSelf: 'flex-start' }}
                >
                  VARAA LIPUT
                </Button>
              )}
              <Button
                style={{ alignSelf: 'flex-end' }}
                backgroundColor={event.themeColor}
              >
                OSTA LIPUT
              </Button>
            </FlexBoxHorizontal>
          </FormListItem>
        </Wrapper>
      );
    }
  },
);

export { FlexBoxHorizontal };
