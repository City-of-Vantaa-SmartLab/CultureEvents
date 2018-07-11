import React, { Component } from 'react';
import styled from 'styled-components';
import Typography from '../../../components/typography';
import chroma from 'chroma-js';
import { toRgba } from '../../../utils';
import Button, { ButtonGroup } from '../../../components/button';
import Icon from '../../../../node_modules/antd/lib/icon';
import Form, { InputField } from '../../../components/form';

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
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
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

  & > *:first-child {
    margin-right: 1rem;
  }
`;

const FormListItem = props => {
  return (
    <FormListItemWrapper>
      <Typography type="largebody">{props.title}</Typography>
      <div>{props.children}</div>
    </FormListItemWrapper>
  );
};

export default class EventBooking extends Component {
  state = {
    customerGroup: undefined,
  };

  render() {
    const { event } = this.props;
    return (
      <Wrapper bgColor={event.themeColor}>
        <Typography type="title">Varaa/osta lippu</Typography>
        <FormListItem title="1 - Olen">
          <ButtonGroup style={{ display: 'flex' }}>
            <CustomerGroupButton
              backgroundColor={
                this.state.customerGroup == 'group' ? event.themeColor : 'white'
              }
              onClick={e => this.setState({ customerGroup: 'group' })}
              onTouchEnd={e => this.setState({ customerGroup: 'group' })}
            >
              Ryhmänohjaaja{' '}
              {this.state.customerGroup == 'group' && <Icon type="check" />}
            </CustomerGroupButton>
            <CustomerGroupButton
              onClick={e => this.setState({ customerGroup: 'private' })}
              onTouchEnd={e => this.setState({ customerGroup: 'private' })}
              backgroundColor={
                this.state.customerGroup == 'private'
                  ? event.themeColor
                  : 'white'
              }
            >
              Yksityishenkilö
              {this.state.customerGroup == 'private' && <Icon type="check" />}
            </CustomerGroupButton>
          </ButtonGroup>
        </FormListItem>
        <FormListItem title="2 - Lippujen määrä">
          <Form>
            <FlexBoxHorizontal>
              <InputField
                defaultValue="Lipputyppi"
                style={{ width: '100%' }}
                type="select"
                data={event.ticketCatalog.map(catalog => ({
                  value: catalog.ticketDescription,
                }))}
                lightMode
              />
              <InputField lightMode type="number" />
            </FlexBoxHorizontal>
          </Form>
          <Button backgroundColor={event.themeColor} icon="plus">
            Lisää Lipputyppi
          </Button>
        </FormListItem>
        <FormListItem title="3 - Tiedot varausta varten">
          <Form>
            <InputField lightMode type="text" label="Nimi" mandatory />
            <InputField lightMode type="text" label="Puhelinumero" mandatory />
            <InputField lightMode type="text" label="Sahköposti" />
          </Form>
          <Button
            style={{ alignSelf: 'flex-end' }}
            backgroundColor={event.themeColor}
          >
            OSTA LIPUT
          </Button>
        </FormListItem>
      </Wrapper>
    );
  }
}
