import React from 'react';
import Typography from 'components/typography';
import styled from 'styled-components';

const ErrorMessage = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: palevioletred;

  & span,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: red;
    margin: auto;
  }
`;

export default class PanelErrorCatcher extends React.Component {
  state = {
    hasError: false,
  };
  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.error(
      'An error occurred in FinancialPanel and was catched by error boundary. ',
      error,
      info,
    );
  }
  render() {
    if (this.state.hasError) {
      return (
        <ErrorMessage>
          <Typography type="body">An Error occurred!</Typography>
        </ErrorMessage>
      );
    }
    return this.props.children;
  }
}
