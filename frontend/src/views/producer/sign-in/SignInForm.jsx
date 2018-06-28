import React from 'react';
import styled from 'styled-components';
import Form, { InputField } from '../../../components/form';
import Button from '../../../components/button';

const Wrapper = styled.div`
  margin: auto;
  align-items: center;
  width: 25rem;

  form {
    display: flex;
    flex-direction: column;
  }
`;
const SignInButton = styled(Button)`
  &&& {
    margin: 2rem 0;
    align-self: flex-end;
    background-color: ${props => props.theme.palette.lightGreen};
    color: white;
  }
`;

export default class SignInForm extends React.Component {
  render() {
    return (
      <Wrapper>
        <Form>
          <InputField label="Nimi" />
          <InputField label="Password" type="password" />
          <SignInButton>Kirjaudu</SignInButton>
        </Form>
      </Wrapper>
    );
  }
}
