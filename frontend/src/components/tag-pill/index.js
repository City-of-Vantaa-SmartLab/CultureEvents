import React from 'react';
import styled from 'styled-components';
import Typography from '../typography';

const TagPillText = styled(Typography)`
  display: inline;
  padding: 0.4rem 0.8rem;
  background-color: rgba(0, 0, 0, 0.15);
  opacity: 1;
  text-transform: capitalize;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.23);
    transform: translateY(-2px);
  }

  ${props =>
    props.selected &&
    `
    background-color: ${props.highlightColor ||
      props.theme.palette.primaryDeep};
    color: white;
    text-shadow: 0 2px 6px rgba(0,0,0, .23);
    transform: translateY(-2px);
  `};
`;
const TagPillGroupWrapper = styled.div`
  display: flex;
  flex-flow: wrap;

  span {
    margin-left: 0.5rem;
  }
`;

export class TagPill extends React.Component {
  render() {
    return <TagPillText type="body" {...this.props} />;
  }
}

export default class TagPillGroup extends React.Component {
  state = {
    selected: null,
  };
  constructor(props) {
    super(props);
    this.state.selected = props.value;
  }
  onChildClick = identifier => () => {
    if (this.props.onChange) {
      this.props.onChange(identifier);
    } else {
      this.setState({ selected: identifier });
    }
  };
  render() {
    const { tags, className, pillClassName, highlightColor } = this.props;
    return (
      <TagPillGroupWrapper className={className}>
        {tags.map((tag, index) => (
          <TagPill
            className={pillClassName}
            highlightColor={highlightColor}
            selected={
              this.props.onChange
                ? tag.id === this.props.value || index === this.props.value
                : this.state.selected === tag.id ||
                  this.state.selected === index
            }
            onClick={this.onChildClick(tag.id || index)}
            onTouchEnd={this.onChildClick(tag.id || index)}
            key={tag.id || index}
            {...tag.tagProps}
          >
            {tag.text}
          </TagPill>
        ))}
      </TagPillGroupWrapper>
    );
  }
}
