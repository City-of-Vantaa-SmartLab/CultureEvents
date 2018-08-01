import React from 'react';
import styled from 'styled-components';
import Typography from '../typography';
import Input, { TextArea, NumericInput, Select } from './Input';
import chroma from 'chroma-js';

const LabelText = styled(Typography)`
  && {
    margin-bottom: 4px;
    font-size: ${props => (props.horizontal ? '0.86rem' : '1rem')};
    white-space: nowrap;
    position: relative;

    &::after {
      content: ${props => (props.mandatory ? ' "*"' : 'none')};
      position: absolute;
      top: 0;
      right: 0;
      color: red;
      transform: translate(0.5rem, -5px);
    }
  }
`;
const Label = props => {
  const originalTextColor = props.lightMode ? 'black' : 'white';
  const textColor = chroma(originalTextColor)
    .alpha(props.disabled ? 0.5 : 1)
    .css();

  return (
    <LabelText
      type="secondarybody"
      color={textColor}
      mandatory={props.mandatory}
    >
      {props.children}
    </LabelText>
  );
};

export const Wrapper = styled.div`
  ${props =>
    props.horizontal &&
    `
    display: flex;
    && > span {
      margin-right: 1.5rem;
      align-self: center;
      margin-bottom: 0;
    }
  `};
  & input {
    font-size: 16px !important;
  }
`;

export default class InputField extends React.Component {
  getChildrenFromType = () => {
    // @TODO: This is confusing. either inputType or type
    const {
      horizontal,
      lightMode,
      inputStyle,
      inputClassName,
      type,
      ...inputProps
    } = this.props;
    // @TODO: consider using SWITCH statement
    if (type === 'textarea')
      return (
        <TextArea
          className={inputClassName}
          style={inputStyle}
          {...inputProps} // @TODO: explicit passage of props to make it easier to be understood
        />
      );
    if (type === 'number')
      return (
        <NumericInput
          className={inputClassName}
          style={inputStyle}
          autoFocus={false}
          {...inputProps}
        />
      );
    if (type === 'select')
      return (
        <Select
          className={inputClassName}
          style={inputStyle}
          {...inputProps}
          autoFocus={false}
        />
      );
    else
      return (
        <Input
          className={inputClassName}
          style={inputStyle}
          autoFocus={false}
          {...inputProps}
          type={type}
        />
      );
  };
  render() {
    const {
      label,
      mandatory,
      className,
      style,
      horizontal,
      lightMode,
      disabled,
    } = this.props;
    return (
      <Wrapper className={className} style={style} horizontal={horizontal}>
        <Label
          mandatory={mandatory}
          horizontal={horizontal}
          lightMode={lightMode}
          disabled={disabled}
        >
          {label}
        </Label>
        {this.props.children ? this.props.children : this.getChildrenFromType()}
      </Wrapper>
    );
  }
}
