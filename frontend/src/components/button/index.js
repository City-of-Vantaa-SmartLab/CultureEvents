import React from 'react';
import PropTypes from 'prop-types';
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

const CustomButton = styled(AntButton)`
  && {
    border-radius: 4px;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    background-color: ${props => props.backgroundColor} !important;
    border-color: ${props => props.backgroundColor};
    color: ${props => getContrastColor(props.backgroundColor)} !important;

    ${props =>
      !props.disabled
        ? `&:hover {
          transform: translate(0, -3px);
          background-color: ${props => props.backgroundColor} !important;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
          text-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
          border-color: ${props => props.backgroundColor};
          color: ${props => getContrastColor(props.backgroundColor)} !important;
        }`
        : 'filter: grayscale(100%) opacity(30%); pointer-events: none;'}
`;

export default class Button extends React.Component {
  render() {
    return (
      <CustomButton
        type={this.props.type || 'primary'}
        backgroundColor={this.props.backgroundColor}
        {...this.props}
      />
    );
  }
}

Button.propTypes = {
  backgroundColor: PropTypes.string,
};

export const ButtonGroup = AntButton.Group;
