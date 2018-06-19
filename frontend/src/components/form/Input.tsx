import * as React from 'react';
import styled from 'styled-components';
import AntInput from 'antd/lib/input';
import 'antd/lib/input/style/css';
import { Color } from 'csstype';

const TextInput = styled(AntInput)<{ backgroundColor?: Color }>`
  &&& {
    border-radius: 8px;
    height: auto;
    padding: 0.72rem 1rem;
    background-color: ${props => props.backgroundColor};
  }
`;

interface InputProps {
  type?: string;
  value?: string | number;
  placeHolder?: string;
  backgroundColor?: Color;
  [propsName: string]: any;
}
export default class Input extends React.Component<InputProps> {
  public render() {
    return <TextInput {...this.props} />;
  }
}
