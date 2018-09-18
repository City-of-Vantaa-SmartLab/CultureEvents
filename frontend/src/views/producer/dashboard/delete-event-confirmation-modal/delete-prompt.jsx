import React from 'react';
import { withTheme } from 'styled-components';
import { Content, ActionBar } from 'components/modal';
import Typography from 'components/typography';
import Button from 'components/button';
import EventCard from 'components/event-card';
import styled from 'styled-components';

const Centerizer = styled.div`
  padding: 2rem;
  display: flex;

  & > * {
    margin: auto;
  }
`;

class DeletePrompt extends React.Component {
  render() {
    const { theme, event, requestClear, requestDelete } = this.props;
    return [
      <Content>
        <Typography type="title" color={theme.palette.red}>
          Are you sure?
        </Typography>
        <Typography type="body">
          You are deleting this event. This action is permanent
        </Typography>
        <Centerizer>
          <EventCard mini={true} event={event} />
        </Centerizer>
      </Content>,
      <ActionBar>
        <Button backgroundColor="white" onClick={requestClear}>
          No, I change my mind
        </Button>
        <Button backgroundColor={theme.palette.red} onClick={requestDelete}>
          Yes, delete this
        </Button>
      </ActionBar>,
    ];
  }
}

export default withTheme(DeletePrompt);
