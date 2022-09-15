import React from 'react';
import styled from 'styled-components';
import Button, { ButtonGroup } from 'components/button';
import Icon from 'antd/lib/icon';
import RawForm, { InputField } from 'components/form';

// styles
const GreenButton = styled(Button)`
  &&& {
    border-radius: 8px;
    border-color: ${props => props.theme.palette.deepGreen};
    color: ${props => props.theme.palette.deepGreen} !important;
    background-color: transparent;

    &:hover {
      background-color: ${props => props.theme.palette.deepGreen};
      color: white !important;
    }
  }
`;
const RedButton = styled(GreenButton)`
  &&& {
    border-color: ${props => props.theme.palette.red};
    color: ${props => props.theme.palette.red} !important;
    &: hover {
      background-color: ${props => props.theme.palette.red};
    }
  }
`;

const HighlightedArea = styled.div`
  border-left: 3px ${props => props.themeColor} solid;
  width: 100%;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 4rem;
  & > div {
    margin-bottom: 0;
    margin-right: 2rem;
    ${props => props.fullsize && 'width: 100%'};
  }
  & > :last-child {
    margin-right: 0;
  }
`;

const TicketCatalogInputGroup = props => {
  if (props.ticketCatalog.length === 0) {
    return (
      <Row>
        <GreenButton
          onClick={props.addTicketType}
          onTouchEnd={props.addTicketType}
          icon="plus"
        >
          Lisää uusi lipputyyppi
        </GreenButton>
      </Row>
    );
  }
  return (
    <HighlightedArea themeColor={props.themeColor}>
      {props.ticketCatalog.map((ticketType, index, arr) => (
        <Row key={ticketType.id} style={{ alignItems: 'flex-end' }}>
          <InputField
            backgroundColor={props.inputBackgroundColor}
            style={{
              width: '100%',
            }}
            label="Lipun tyyppi"
            lightMode
            type="text"
            onChange={props.updateTicketCatalogField(
              ticketType.id,
              'ticketDescription',
            )}
            value={ticketType.ticketDescription}
          />
          <InputField
            backgroundColor={props.inputBackgroundColor}
            label="Hinta"
            formatter={value =>
              value == 0 ? `${value} €` : `${value} €`.replace(/^0/g, '')
            }
            lightMode
            type="number"
            onChange={props.updateTicketCatalogField(ticketType.id, 'price')}
            value={Number(ticketType.price)}
          />
          <InputField
            backgroundColor={props.inputBackgroundColor}
            label="Paikkojen määrä"
            lightMode
            type="number"
            onChange={props.updateTicketCatalogField(ticketType.id, 'maxSeats')}
            value={Number(ticketType.maxSeats)}
          />
          <ButtonGroup style={{ flexShrink: 0 }}>
            <RedButton
              onClick={props.removeTicketType(ticketType.id)}
              // NOTE 9/2022: is_created_on_client is missing from backend.
              //disabled={!ticketType.isCreatedOnClient}
            >
              <Icon type="close" />
            </RedButton>
            {index === arr.length - 1 && (
              <GreenButton
                onClick={props.addTicketType}
                onTouchEnd={props.addTicketType}
                icon="plus"
              >
                Lisää
              </GreenButton>
            )}
          </ButtonGroup>
        </Row>
      ))}
    </HighlightedArea>
  );
};

export default TicketCatalogInputGroup;
