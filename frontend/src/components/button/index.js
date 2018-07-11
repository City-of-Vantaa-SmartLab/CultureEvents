import React from 'react';
import styled from 'styled-components';
import AntButton from 'antd/lib/button';
import 'antd/lib/button/style/css';

const CustomButton = styled(AntButton)`
  && {
    border-radius: 2rem;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    background-color: ${props => props.backgroundColor};

    &:hover {
      transform: translate(0, -3px);
      background-color: ${props => props.backgroundColor};
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
      text-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
    }
  }
`;

export default class Button extends React.Component {
  render() {
    return (
      <CustomButton
        type={this.props.type || 'primary'}
        {...this.props}
        backgroundColor={this.props.backgroundColor}
      />
    );
  }
}

export const ButtonGroup = AntButton.Group;
