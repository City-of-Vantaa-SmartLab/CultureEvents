import React from 'react';
import styled from 'styled-components';
import Form, { InputField } from '../../../components/form';
import Button from '../../../components/button';
import { connect } from '../../../utils';
import { Redirect } from 'react-router-dom';

const Wrapper = styled.div`
  margin: auto;
  align-items: center;
  width: 25rem;

  form {
    display: flex;
    flex-direction: column;
    & > * {
      margin-bottom: 0.5rem;
    }
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

class SignInForm extends React.Component {
  state = {
    username: '',
    password: '',
  };
  onChangeName = e => {
    this.setState({ username: e.target.value });
  };
  onChangePassword = e => {
    this.setState({ password: e.target.value });
  };
  login = e => {
    this.props.store.login(this.state.username, this.state.password);
  };

  render() {
    const { auth } = this.props.store.ui;
    if (this.props.store.user.isAuthenticated)
      return <Redirect to="./dashboard" />;
    return (
      <Wrapper>
        <Form>
          <InputField
            label="Nimi"
            value={this.state.username}
            onChange={this.onChangeName}
          />
          <InputField
            label="Salasana"
            type="password"
            value={this.state.password}
            onChange={this.onChangePassword}
          />
          <SignInButton
            icon={auth.authInProgress ? 'loading' : 'arrow-right'}
            onClick={this.login}
          >
            Kirjaudu
          </SignInButton>
        </Form>
      </Wrapper>
    );
  }
}

export default connect('store')(SignInForm);
