import React from 'react';
import styled from 'styled-components';
import AntInput from 'antd/lib/input';
import AntTextArea from 'antd/lib/input/TextArea';
import AntNumericInput from 'antd/lib/input-number';
import AntSelect, { Option as AntOption } from 'antd/lib/select';
import 'antd/lib/input/style/css';
import 'antd/lib/input-number/style/css';
import 'antd/lib/select/style/css';

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
export const NumericInput = styled(AntNumericInput)`
  &&& {
    border-radius: 8px;
    padding: 0;
    background-color: ${props => props.backgroundColor};
    border: white;
    max-width: 5rem;

    input {
      height: 2.5rem;
    }
  }
`;

const SelectWrapper = styled(AntSelect)`
  && {
    background-color: ${props => props.backgroundColor};
    border: white;
    width: 100%;

    div {
      border-radius: 8px;
      width: 100%;
    }
  }
`;

export const Select = ({ data, ...rest }) => (
  <SelectWrapper {...rest}>
    {data &&
      data.map((item, index) => (
        <AntOption key={index} value={item.value + ''} disabled={item.disabled}>
          {item.label}
        </AntOption>
      ))}
  </SelectWrapper>
);

export default class Input extends React.Component {
  render() {
    return <TextInput {...this.props} />;
  }
}
