import * as React from 'react';
import styled from 'styled-components';
import Typography from '../typography';
import Input, { InputProps, TextArea } from './Input';

interface LabelProps {
  children: JSX.Element | string;
  mandatory?: boolean;
  horizontal?: boolean;
  lightMode?: boolean;
}
const LabelText = styled(Typography)<any>`
  && {
    margin-bottom: 4px;
    font-size: ${props => (props.horizontal ? '0.86rem' : '1rem')};
    white-space: nowrap;
  }
`;
const Label = (props: LabelProps) => (
  <LabelText type="secondarybody" color={props.lightMode ? 'black' : 'white'}>
    {props.children}
  </LabelText>
);

export const Wrapper = styled.div<any>`
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

interface InputFieldType extends InputProps {
  label: LabelProps['children'];
  mandatory?: LabelProps['mandatory'];
  horizontal?: LabelProps['horizontal'];
  lightMode?: LabelProps['lightMode'];
  style?: any;
  className?: any;
  type?: string;
}

export default class InputField extends React.Component<InputFieldType> {
  public render() {
    const {
      label,
      mandatory,
      className,
      style,
      horizontal,
      lightMode,
      inputStyle,
      inputClassName,
      type,
      ...inputProps
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
        {this.props.children ? (
          this.props.children
        ) : type === 'textarea' ? (
          <TextArea
            className={inputClassName}
            style={inputStyle}
            {...inputProps}
          />
        ) : (
          <Input
            className={inputClassName}
            style={inputStyle}
            type={type}
            {...inputProps}
          />
        )}
      </Wrapper>
    );
  }
}
