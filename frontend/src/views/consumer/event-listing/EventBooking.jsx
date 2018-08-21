import React, { Component } from 'react';
import styled from 'styled-components';
import Typography from 'components/typography';
import chroma from 'chroma-js';
import { observable, toJS } from 'mobx';
import { toRgba, genRandomKey, connect } from 'utils';
import Button, { ButtonGroup } from 'components/button';
import Icon from 'antd/lib/icon';
import Form, { InputField } from 'components/form';
import TicketInputSet from './TicketInputSet';
import { AsYouType, isValidNumber } from 'libphonenumber-js';

// styled componnents
const Wrapper = styled.div`
  padding: 1rem;
  padding-bottom: 3rem;
  margin-top: 1rem;
  width: 100%;
  background-color: ${props =>
    toRgba(
      chroma(props.bgColor)
        .alpha(0.3)
        .rgba(),
    )};
`;
const TitleBox = styled.div`
  h1,
  h2,
  h3,
  h4 {
    margin: 0;
  }

  margin-bottom: 1rem;
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
      <div>{props.disabled || props.children}</div>
    </FormListItemWrapper>
  );
};

// main class
export default connect('store')(
  class EventBooking extends Component {
    constructor(props) {
      super(props);

      const availableTicketType = props.event.ticketCatalog.find(
        ticketType => ticketType.isAvailable,
      );
      this.internalState = observable({
        customerGroup: undefined,
        tickets: [
          {
            id: 'first',
            label: availableTicketType && availableTicketType.ticketDescription,
            value: availableTicketType && availableTicketType.id,
            amount: 0,
          },
        ],
        phoneNumber: '',
        name: '',
        email: '',
        classRoom: '',
        school: '',
      });
    }

    getPricingAggrevate = () => {
      return this.internalState.tickets.reduce(
        (acc, curr) => {
          const targetCatalog = this.props.event.ticketCatalog.find(
            elem => elem.id === curr.value,
          );
          if (targetCatalog) {
            const singlePrice = targetCatalog.price;
            const totalPriceForThisCatalog = singlePrice * curr.amount;
            acc.totalCost += totalPriceForThisCatalog;
            acc.totalTicket += curr.amount;
          }
          return acc;
        },
        {
          totalCost: 0,
          totalTicket: 0,
        },
      );
    };
    submit = type => e => {
      this.props.store.submitOrder({
        ...toJS(this.internalState),
        type,
        eventId: this.props.event.id,
      });
    };
    render() {
      const { event, store } = this.props;
      const { internalState } = this;
      const isReservationPending =
        store.ui.orderAndPayment.reservationStatus == 1;

      const isPrivateCustomer = internalState.customerGroup == 'private';
      const isGroupConductorCustomer = internalState.customerGroup == 'group';
      const formDisabled = event.totalAvailableTickets < 1;
      const themeColor = formDisabled ? '#9B9B9B' : event.themeColor;
      const { totalCost, totalTicket } = this.getPricingAggrevate();
      const submittable =
        (isGroupConductorCustomer
          ? internalState.school &&
            internalState.classRoom &&
            internalState.name &&
            isValidNumber(internalState.phoneNumber, 'FI')
          : internalState.name &&
            isValidNumber(internalState.phoneNumber, 'FI')) && totalTicket > 0; // can't have an empty order
      return (
        <Wrapper bgColor={themeColor}>
          <TitleBox>
            <Typography type="title">Varaa/osta lippu</Typography>
            <Typography type="secondarybody">
              Varaaminen on mahdollista vain ryhmille
            </Typography>
          </TitleBox>
          <FormListItem title="1 - Olen">
            <ButtonGroup style={{ display: 'flex' }}>
              <CustomerGroupButton
                disabled={formDisabled}
                backgroundColor={
                  isGroupConductorCustomer ? themeColor : 'white'
                }
                onClick={e => (internalState.customerGroup = 'group')}
              >
                Ryhmänohjaaja
                {isGroupConductorCustomer && <Icon type="check" />}
              </CustomerGroupButton>
              <CustomerGroupButton
                disabled={formDisabled}
                onClick={e => (internalState.customerGroup = 'private')}
                backgroundColor={isPrivateCustomer ? themeColor : 'white'}
              >
                Yksityishenkilö
                {isPrivateCustomer && <Icon type="check" />}
              </CustomerGroupButton>
            </ButtonGroup>
          </FormListItem>
          <FormListItem
            title="2 - Lippujen määrä"
            disabled={!internalState.customerGroup || formDisabled}
          >
            <TicketInputSet
              themeColor={themeColor}
              ticketCatalog={event.ticketCatalog}
              tickets={internalState.tickets}
            />
            <TotalAmountCalculated>
              <Typography type="subheader">Yhteissumma</Typography>
              <Typography type="subheader" color={themeColor}>
                {totalCost} €
              </Typography>
            </TotalAmountCalculated>
          </FormListItem>
          <FormListItem
            title="3 - Tiedot varausta varten"
            disabled={!internalState.customerGroup || formDisabled}
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
                  <InputField
                    lightMode
                    type="text"
                    label="Varaajan nimi"
                    mandatory
                    value={internalState.name}
                    onChange={e => (internalState.name = e.target.value)}
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
                  icon={isReservationPending && 'loading'}
                  onClick={this.submit('reservation')}
                >
                  VARAA LIPUT
                </Button>
              )}
              <Button
                style={{ alignSelf: 'flex-end' }}
                backgroundColor={themeColor}
                disabled={!submittable}
                onClick={this.submit('payment')}
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
