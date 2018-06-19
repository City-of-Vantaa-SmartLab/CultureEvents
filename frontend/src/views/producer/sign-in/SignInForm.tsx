import * as React from 'react';
import styled from 'styled-components';
import Form, { InputField } from '../../../components/form';
import Button from '../../../components/button';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  align-items: center;
`;
const SignInButton = styled(Button)<any>`
  &&& {
    margin: 2rem 0;
    align-self: flex-end;
    background-color: ${props => props.theme.palette.lightGreen};
    color: white;
  }
`;

export default class SignInForm extends React.Component {
  public render() {
    return (
      <Wrapper>
        <Form>
          <InputField label="Nimi" />
          <InputField label="Password" />
        </Form>
        <SignInButton>Kirjaudu</SignInButton>
      </Wrapper>
    );
  }
}
