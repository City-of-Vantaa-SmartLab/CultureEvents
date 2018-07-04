import React from 'react';
import styled from 'styled-components';
import Typography from '../typography';
import { toRgba } from '../../utils';
import chroma from 'chroma-js';
import theme from '../../views/theme';

const Wrapper = styled.div`
  width: 100%;
  height: 20rem;
  background: url('${props => props.coverImage}');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.5s;

  &:hover {
      box-shadow: 3px 6px 12px rgba(0,0,0, .3);
  }
`;

const Shim = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
`;

const BottomSection = styled.div`
  z-index: 10;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: ${props => props.themeColor};
  transition: all 0.5s ease;
`;

const Content = styled(Shim)`
  z-index: 10;
  background-color: transparent;
  padding: 1rem;
`;

const Decorator = styled(Shim)`
  z-index: 5;
  background-image: url('${props => props.coverImage}');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  filter: blur(7px);
  clip-path: polygon(0 0, 59% 0, 40% 41%, 0 32%);

  &:after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: ${props => props.themeColor};
    left: 0;
    top: 0;
    opacity: 0.5;
    z-index: 6;    
  }
`;

export default class EventCard extends React.Component {
  render() {
    const {
      name,
      coverImage,
      themeColor,
      location,
      date,
      time,
      performer,
      ageGroupLimit,
      className,
      style,
    } = this.props;
    return (
      <Wrapper
        style={style}
        className={className}
        coverImage={coverImage}
        onClick={this.props.onSelect}
      >
        <Shim />
        <Decorator coverImage={coverImage} themeColor={themeColor} />
        <Content>
          {performer && (
            <Typography
              type="largebody"
              style={{ fontWeight: 700 }}
              color={toRgba(
                chroma(themeColor)
                  .saturate(2)
                  .brighten(3)
                  .rgba(),
              )}
            >
              {performer}
            </Typography>
          )}
          <Typography style={{ margin: 0 }} type="title" color="white">
            {name}
          </Typography>
        </Content>
        <BottomSection themeColor={themeColor}>
          <Typography type="body" color="white">
            {location} •{' '}
          </Typography>
          <Typography type="body" color="white">
            {date} |{' '}
          </Typography>
          <Typography type="body" color="white">
            {time}{' '}
          </Typography>{' '}
          <br />
          {ageGroupLimit && (
            <Typography type="body" color="white">
              Ikäsuositus: {ageGroupLimit} v.
            </Typography>
          )}
        </BottomSection>
      </Wrapper>
    );
  }
}
