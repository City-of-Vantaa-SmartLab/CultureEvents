import React, { Component } from 'react';
import styled from 'styled-components';
import Typography from '../../../components/typography';
import Icon from 'antd/lib/icon';

const StyledList = styled.li`
  list-style: none;
  margin: 0.5rem 1rem;

  i {
    color: ${props => props.color};
    margin-right: 0.5rem;
    font-weight: 800;
  }
`;

export const ListItem = ({ style, color, iconName, title, content }) => (
  <StyledList style={style} color={color}>
    <div>
      {iconName && <Icon type={iconName} />}
      <Typography type="largebody" color={color}>
        {title}
      </Typography>
    </div>
    {React.isValidElement(content) ? (
      <ul>{content}</ul>
    ) : (
      <Typography type="body">{content}</Typography>
    )}
  </StyledList>
);
const Wrapper = styled.ul`
  padding: 0.5rem;
  padding-top: 0.5rem;
  margin: 0;
`;

export default class EventDetails extends Component {
  render() {
    const { event } = this.props;
    const soldOut = event.totalAvailableTickets < 1;
    const themeColor = soldOut ? '#9B9B9B' : event.themeColor;
    return (
      <Wrapper>
        {event.isWordless && (
          <ListItem
            style={{ marginBottom: 0 }}
            color={themeColor}
            title={'Sanaton / sopii kaikenkielisille'}
          />
        )}
        <ListItem
          style={{ marginBottom: '1rem' }}
          iconName="user"
          color={themeColor}
          title={`Ikäsuositus: ${event.ageGroupLimits.join(', ')} v.`}
        />
        <ListItem color={themeColor} content={event.description} />
        <ListItem
          color={themeColor}
          title="Milloin"
          content={`${event.eventDate} klo ${event.eventTime}`}
        />
        <ListItem
          color={themeColor}
          title="Missä"
          content={event.area + ', ' + event.location}
        />
        <ListItem
          color={themeColor}
          title="Hinta"
          content={event.ticketCatalog.map(type => (
            <ListItem
              key={type.id}
              content={`${type.ticketDescription}: ${type.price} €`}
            />
          ))}
        />
        <ListItem
          color={themeColor}
          title="Lisätietoja"
          content={event.contactInformation}
        />
        <ListItem
          color={themeColor}
          title="Paikkoja jäljellä"
          content={event.totalAvailableTickets + ' jäljellä'}
        />
      </Wrapper>
    );
  }
}
