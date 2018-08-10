import React from 'react';
import styled, { withTheme } from 'styled-components';
import AntButton from 'antd/lib/button';
import { connect } from 'utils';

const Wrapper = styled.div`
  margin-bottom: 1rem;
`;

const Button = styled(AntButton)`
  && {
    border-radius: 8px;
    color: ${props => props.bgColor};
    border-color: transparent;

    &:hover {
      color: white;
      background-color: ${props => props.bgColor};
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    }
    ${props =>
      props.disabled && 'filter: grayscale(100%); &:hover {box-shadow: none};'};
  }
`;

class ButtonBar extends React.Component {
  render() {
    const { palette } = this.props.theme;
    const {
      addNewEventCB,
      confirmChangeCB,
      discardChangeCB,
      canConfirm,
      canAddNew,
      canSeeReservation,
    } = this.props;

    return (
      <Wrapper>
        <AntButton.Group>
          <Button
            disabled={!canAddNew}
            bgColor={palette.primaryDeep}
            icon="plus"
            onClick={addNewEventCB}
            onTouchEnd={addNewEventCB}
          >
            Lisää uusi tapahtuma
          </Button>
          <Button
            disabled={!canConfirm}
            bgColor={palette.deepGreen}
            icon="check"
            onClick={confirmChangeCB}
            onTouchEnd={confirmChangeCB}
          >
            Hyväksy muutokset
          </Button>
          <Button
            disabled={!canConfirm}
            bgColor={palette.red}
            icon="close"
            onClick={discardChangeCB}
            onTouchEnd={discardChangeCB}
          >
            Hylkää muutokset
          </Button>
          {canSeeReservation && (
            <Button
              bgColor={palette.purple}
              icon="solution"
              onClick={() =>
                this.props.store.ui.orderAndPayment.toggleShowListing()
              }
            >
              Katso varauslista
            </Button>
          )}
        </AntButton.Group>
      </Wrapper>
    );
  }
}

export default withTheme(connect('store')(ButtonBar));
