import React from 'react';
import styled from 'styled-components';
import Typography from '../typography';
import Input, { TextArea, NumericInput, Select } from './Input';
import chroma from 'chroma-js';

const LabelText = styled(Typography)`
  &&& {
    margin-bottom: 4px;
    white-space: nowrap;
    position: relative;
    align-self: flex-start;

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
    .alpha(props.disabled ? 0.4 : 1)
    .css();

  return (
    <LabelText type="body" color={textColor} mandatory={props.mandatory}>
      {props.children}
    </LabelText>
  );
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  & input {
    font-size: 16px !important;
  }
`;

export default class InputField extends React.Component {
  getChildrenFromType = () => {
    // @TODO: This is confusing. either inputType or type
    const {
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
          {...inputProps}
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
      lightMode,
      disabled,
    } = this.props;
    return (
      <Wrapper className={className} style={style}>
        <Label mandatory={mandatory} lightMode={lightMode} disabled={disabled}>
          {label}
        </Label>
        {this.props.children ? this.props.children : this.getChildrenFromType()}
      </Wrapper>
    );
  }
}
