import React from 'react';
import styled, { withTheme } from 'styled-components';
import AntButton from 'antd/lib/button';

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
            Add new event
          </Button>
          <Button
            disabled={!canConfirm}
            bgColor={palette.deepGreen}
            icon="check"
            onClick={confirmChangeCB}
            onTouchEnd={confirmChangeCB}
          >
            Confirm change
          </Button>
          <Button
            disabled={!canConfirm}
            bgColor={palette.red}
            icon="close"
            onClick={discardChangeCB}
            onTouchEnd={discardChangeCB}
          >
            Discard change
          </Button>
        </AntButton.Group>
      </Wrapper>
    );
  }
}

export default withTheme(ButtonBar);
