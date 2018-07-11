import React from 'react';
import styled from 'styled-components';
import Typography from '../typography';
import Input, { TextArea, NumericInput, Select } from './Input';

const LabelText = styled(Typography)`
  && {
    margin-bottom: 4px;
    font-size: ${props => (props.horizontal ? '0.86rem' : '1rem')};
    white-space: nowrap;
  }
`;
const Label = props => (
  <LabelText type="secondarybody" color={props.lightMode ? 'black' : 'white'}>
    {props.children}
  </LabelText>
);

export const Wrapper = styled.div`
  margin-bottom: 1rem;
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
`;

export default class InputField extends React.Component {
  getChildrenFromType = inputType => {
    const {
      horizontal,
      lightMode,
      inputStyle,
      inputClassName,
      type,
      ...inputProps
    } = this.props;

    if (inputType === 'textarea')
      return (
        <TextArea
          className={inputClassName}
          style={inputStyle}
          {...inputProps}
        />
      );
    if (inputType === 'number')
      return (
        <NumericInput
          className={inputClassName}
          style={inputStyle}
          {...inputProps}
        />
      );
    if (inputType === 'select')
      return (
        <Select className={inputClassName} style={inputStyle} {...inputProps} />
      );
    else
      return (
        <Input className={inputClassName} style={inputStyle} {...inputProps} />
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
      type,
    } = this.props;
    return (
      <Wrapper className={className} style={style} horizontal={horizontal}>
        <Label
          mandatory={mandatory}
          horizontal={horizontal}
          lightMode={lightMode}
        >
          {label}
        </Label>
        {this.props.children
          ? this.props.children
          : this.getChildrenFromType(type)}
      </Wrapper>
    );
  }
}
