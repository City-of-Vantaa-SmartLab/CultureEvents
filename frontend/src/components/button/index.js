import React from 'react';
import styled from 'styled-components';
import AntButton from 'antd/lib/button';
import 'antd/lib/button/style/css';
import chroma from 'chroma-js';

const getContrastColor = color => {
  try {
    return chroma(color).luminance() > 0.5 ? 'black' : 'white';
  } catch (error) {
    return 'white';
  }
};

const MyButton = styled(AntButton)`
  && {
    border-radius: 2rem;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    background-color: ${props => props.backgroundColor} !important;
    border-color: ${props => props.backgroundColor};
    color: ${props => getContrastColor(props.backgroundColor)};

    ${props =>
      !props.disabled
        ? `&:hover {
          transform: translate(0, -3px);
          background-color: ${props => props.backgroundColor} !important;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
          text-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
          border-color: ${props => props.backgroundColor};
          color: ${props => getContrastColor(props.backgroundColor)};
        }`
        : 'filter: grayscale(100%);'}
`;

export default class Button extends React.Component {
  render() {
    return (
      <MyButton
        type={this.props.type || 'primary'}
        backgroundColor={this.props.backgroundColor}
        {...this.props}
      />
    );
  }
}

export const ButtonGroup = AntButton.Group;
