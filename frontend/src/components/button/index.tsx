import * as React from 'react';
import styled from 'styled-components';
import AntButton, { ButtonProps } from 'antd/lib/button';
import 'antd/lib/button/style/css';

interface MyButtonProps {
  rounded?: boolean;
}
type MyButtonType = MyButtonProps & ButtonProps;

const MyButton = styled(AntButton)<any>`
  && {
    border-radius: 2rem;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    border: none;

    &:hover {
      transform: translate(0, -3px);
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
      text-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
    }
  }
`;

export default class Button extends React.Component<MyButtonType> {
  public render() {
    return <MyButton type="primary" {...this.props} />;
  }
}
