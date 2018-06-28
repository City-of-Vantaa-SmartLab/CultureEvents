import React from 'react';
import styled from 'styled-components';
import AntInput from 'antd/lib/input';
import AntTextArea from 'antd/lib/input/TextArea';
import 'antd/lib/input/style/css';

const TextInput = styled(AntInput)`
  &&& {
    border-radius: 8px;
    height: auto;
    padding: 0.5rem 1rem;
    background-color: ${props => props.backgroundColor};
    border: white;
  }
`;

export const TextArea = styled(AntTextArea)`
  &&& {
    border-radius: 8px;
    padding: 0.5rem 1rem;
    background-color: ${props => props.backgroundColor};
    border: white;
  }
`;

export default class Input extends React.Component {
  render() {
    return <TextInput {...this.props} />;
  }
}
