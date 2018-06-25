import * as React from 'react';
import styled from 'styled-components';
import AntInput from 'antd/lib/input';
import AntTextArea from 'antd/lib/input/TextArea';
import 'antd/lib/input/style/css';
import { Color } from 'csstype';

const TextInput = styled(AntInput)<{ backgroundColor?: Color }>`
  &&& {
    border-radius: 8px;
    height: auto;
    padding: 0.5rem 1rem;
    background-color: ${props => props.backgroundColor};
    border: white;
  }
`;

export const TextArea = styled(AntTextArea)<any>`
  &&& {
    border-radius: 8px;
    padding: 0.5rem 1rem;
    background-color: ${props => props.backgroundColor};
    border: white;
  }
`;

export interface InputProps {
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
