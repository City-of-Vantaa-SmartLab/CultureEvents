import React from 'react';
import styled from 'styled-components';
import Typography from '../typography';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

const TagPillText = styled(Typography)`
  display: inline;
  padding: 0.3rem 0.6rem;
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

  & > * {
    margin-left: 0.3rem;
    margin-top: 0.3rem;
  }
`;

const removeIfFoundOrInsertPure = (arr, value) => {
  const array = [...arr];
  const index = array.findIndex(elem => elem == value);
  if (index != -1) array.splice(index, 1);
  else array.push(value);
  return array;
};

export class TagPill extends React.Component {
  render() {
    return <TagPillText type="body" {...this.props} />;
  }
}

export default observer(
  class TagPillGroup extends React.Component {
    internalState = observable({
      selected: [],
    });
    constructor(props) {
      super(props);
      this.internalState.selected = props.value;
    }
    onChildClick = tagValue => () => {
      const { value, onChange, multiple } = this.props;
      if (value) {
        if (multiple) {
          const result = removeIfFoundOrInsertPure(value, tagValue);
          onChange(result);
        } else {
          onChange(tagValue);
        }
      } else {
        if (multiple) {
          const index = this.internalState.selected.findIndex(
            elem => elem.id == tagValue,
          );
          if (index == -1) this.internalState.selected.push(tagValue);
          else this.internalState.selected.splice(index, 1);
        } else {
          this.internalState.selected = tagValue;
        }
      }
    };

    isChildSelected = tag => {
      // the presence of value props means that the component is controlled
      if (this.props.value) {
        if (this.props.multiple) return this.props.value.find(tag.value);
        else return this.props.value == tag.value;
      } else {
        // otherwise we use internal state
        if (this.props.multiple) {
          return this.internalState.selected.find(tag.value);
        } else return this.internalState.selected == tag.value;
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
              selected={this.isChildSelected(tag)}
              onClick={this.onChildClick(tag.value)}
              onTouchEnd={this.onChildClick(tag.value)}
              key={index}
              {...tag.tagProps}
            >
              {tag.label}
            </TagPill>
          ))}
        </TagPillGroupWrapper>
      );
    }
  },
);
