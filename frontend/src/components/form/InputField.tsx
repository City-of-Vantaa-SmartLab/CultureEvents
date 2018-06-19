import * as React from 'react';
import styled from 'styled-components';
import Typography from '../typography';
import Input from './Input';

interface LabelProps {
  children: JSX.Element | string;
  mandatory?: boolean;
}
const LabelText = styled(Typography)`
  margin-bottom: 4px;
  font-size: 0.86rem;
`;
const Label = (props: LabelProps) => (
  <LabelText type="secondarybody" color="white">
    {props.children}
  </LabelText>
);

const Wrapper = styled.div`
  margin-bottom: 1rem;
`;

interface InputFieldType {
  label: LabelProps['children'];
  mandatory?: LabelProps['mandatory'];
  style?: any;
  className?: any;
}
export default class InputField extends React.Component<InputFieldType> {
  public render() {
    const { label, mandatory, className, style, ...inputProps } = this.props;
    return (
      <Wrapper className={className} style={style}>
        <Label mandatory={mandatory}>{label}</Label>
        <Input {...inputProps} />
      </Wrapper>
    );
  }
}
