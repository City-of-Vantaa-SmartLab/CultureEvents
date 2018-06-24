import * as React from 'react';
import styled from 'styled-components';
import Form, { InputField } from '../../../components/form';
import Button from '../../../components/button';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  align-items: center;
  width: 25rem;
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
          <InputField label="Password" type="password" />
        </Form>
        <SignInButton>Kirjaudu</SignInButton>
      </Wrapper>
    );
  }
}
