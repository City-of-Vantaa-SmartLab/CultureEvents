import React, { Component } from 'react';
import Typography from '../typography';

export const ListItem = props => (
  <li>
    <Typography type="largebody" color={props.color}>
      {props.title}
    </Typography>
    <Typography type="body">{props.content}</Typography>
  </li>
);

export default class List extends Component {
  render() {
    return <ol />;
  }
}
