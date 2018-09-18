import Typography from 'components/typography';
import React from 'react';
import styled, { withTheme } from 'styled-components';

const Wrapper = styled.div`
  * {
    white-space: nowrap;
  }
`;

class BookerInformation extends React.Component {
  render() {
    const { name, school, classRoom, phoneNumber, email, theme } = this.props;
    return (
      <Wrapper>
        <div>
          <Typography type="largebody" color={theme.palette.primaryDeep}>
            Booker
          </Typography>{' '}
          <br />
          <Typography style={{ display: 'inline', marginRight: '1.5rem', fontWeight: '600' }} type="subheader">
            {name}
          </Typography>
          <Typography type="body">
            {school && school}
            {classRoom && '• ' + classRoom}
            {phoneNumber && '• ' + phoneNumber}
            {email && ' • ' + email}
          </Typography>
        </div>
        <div />
      </Wrapper>
    );
  }
}

export default withTheme(BookerInformation);
