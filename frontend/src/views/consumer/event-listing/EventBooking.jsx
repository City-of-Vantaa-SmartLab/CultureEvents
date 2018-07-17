import React, { Component } from 'react';
import styled from 'styled-components';
import Typography from '../../../components/typography';
import chroma from 'chroma-js';
import { observable } from 'mobx';
import { toRgba, genRandomKey, connect } from '../../../utils';
import Button, { ButtonGroup } from '../../../components/button';
import Icon from '../../../../node_modules/antd/lib/icon';
import Form, { InputField } from '../../../components/form';
import TicketInputSet from './TicketInputSet';
import posed from 'react-pose';
import { AsYouType, isValidNumber } from 'libphonenumber-js';

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
    & form {
      & > * {
        margin-top: 0.5rem;
      }
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
const FlexBoxHorizontal = styled(Collapsible)`
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
  overflow: hidden;
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
      phoneNumber: '',
      name: '',
      email: '',
      classRoom: '',
      school: '',
    });
    getTotalPrice = () => {
      return this.internalState.tickets.reduce((acc, curr) => {
        const targetCatalog = this.props.event.ticketCatalog.find(
          elem => elem.id == curr.value,
        );
        if (targetCatalog) {
          const singlePrice = targetCatalog.price;
          const totalPriceForThisCatalog = singlePrice * curr.amount;
          acc += totalPriceForThisCatalog;
        }
        return acc;
      }, 0);
    };
    render() {
      const { event } = this.props;
      const { internalState } = this;

      const isPrivateCustomer = internalState.customerGroup == 'private';
      const isGroupConductorCustomer = internalState.customerGroup == 'group';
      const totalCost = this.getTotalPrice();
      const submittable = isGroupConductorCustomer
        ? internalState.school &&
          internalState.classRoom &&
          isValidNumber(internalState.phoneNumber, 'FI')
        : internalState.name && isValidNumber(internalState.phoneNumber);
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
                {totalCost} €
              </Typography>
            </TotalAmountCalculated>
          </FormListItem>
          <FormListItem
            title="3 - Tiedot varausta varten"
            disabled={!internalState.customerGroup}
          >
            <Form>
              {isPrivateCustomer ? (
                <InputField
                  lightMode
                  label="Nimi"
                  mandatory
                  type="text"
                  value={internalState.name}
                  onChange={e => (internalState.name = e.target.value)}
                />
              ) : (
                <React.Fragment>
                  <InputField
                    lightMode
                    type="text"
                    label="Päiväkoti / koulu"
                    mandatory
                    value={internalState.school}
                    onChange={e => (internalState.school = e.target.value)}
                  />
                  <InputField
                    lightMode
                    type="text"
                    label="Ryhmä / luokka"
                    mandatory
                    value={internalState.classRoom}
                    onChange={e => (internalState.classRoom = e.target.value)}
                  />
                </React.Fragment>
              )}
              <InputField
                key="tel-input"
                lightMode
                mandatory
                type="tel"
                label="Puhelinnumero"
                onChange={e =>
                  (internalState.phoneNumber = new AsYouType('FI').input(
                    e.target.value,
                  ))
                }
                value={internalState.phoneNumber}
              />
              <InputField
                lightMode
                type="text"
                label="Sähköposti"
                value={internalState.email}
                onChange={e => (internalState.email = e.target.value)}
              />
            </Form>
            <FlexBoxHorizontal>
              {isGroupConductorCustomer && (
                <Button
                  type="dashed"
                  backgroundColor="white"
                  style={{ alignSelf: 'flex-start' }}
                  disabled={!submittable}
                >
                  VARAA LIPUT
                </Button>
              )}
              <Button
                style={{ alignSelf: 'flex-end' }}
                backgroundColor={event.themeColor}
                disabled={!submittable}
                onClick={this.submit}
                onTouchEnd={this.submit}
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
