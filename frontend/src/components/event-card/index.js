import React from 'react';
import styled from 'styled-components';
import Typography from '../typography';
import Button from '../button';
import { toRgba } from '../../utils';
import chroma from 'chroma-js';
import posed from 'react-pose';
import { tween } from 'popmotion';

const WrapperBase = posed.div({
  normal: {
    height: props => (props.mini ? '13rem' : '20rem'),
    width: '100%',
    flip: true,
    transition: tween,
    borderRadius: 14,
  },
  expanded: {
    height: '100vh',
    width: '100vw',
    left: 0,
    top: 0,
    borderRadius: 0,
    flip: true,
  },
});

const MorphableText = posed.div({
  normal: {
    top: 0,
    bottom: 'initial',
    flip: true,
    delay: 300,
    transition: tween,
  },
  expanded: {
    bottom: 0,
    top: 'initial',
    flip: true,
    delay: 200,
  },
});
const BoxImageAnimation = posed.div({
  normal: {
    height: '100%',
    flip: true,
    delay: 10,
  },
  expanded: {
    height: '20rem',
    flip: true,
  },
});

const Wrapper = styled(WrapperBase)`
  position: ${props => (props.expanded ? 'fixed' : 'relative')};
  z-index: ${props => (props.expanded ? 100 : 1)};
  overflow-y: ${props => (props.expanded ? 'auto' : 'hidden')};
  overflow-x: hidden;
  cursor: pointer;
  background-color: white;
  will-change: transform;
  transition: box-shadow 0.5s ease;

  &:hover {
    box-shadow: 12px 12px 24px rgba(0, 0, 0, 0.3);
  }
`;

const Shim = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1;
  left: 0;
  top: 0;
  transition: all 0.5s ease;
  height: 100%;
`;

const Decorator = styled.div`
  z-index: 5;
  background-image: url('${props => props.coverImage}');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  max-height: 20rem;
  filter: blur(7px);
  height: 100%;
  transition: clip-path 0.4s cubic-bezier(.94,.02,.33,1);
  clip-path: ${props =>
    !props.expanded
      ? 'polygon(0 0, 59% 0, 40% 41%, 0 32%)'
      : 'polygon(0 72%, 45% 61%, 55% 100%, 0% 100%)'};

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
    transform: scale(1.3);
  }
`;

const BackgroundImg = styled.div`
  background: url('${props => props.coverImage}');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  z-index: 0;
  left: 0;
  top: 0;
  height: 100%;
`;

const BackgroundImageGroup = styled(BoxImageAnimation)`
  width: 100%;
  position: relative;
  will-change: transform;

  & > * {
    width: 100%;
    position: absolute;
  }
`;

const BottomSection = styled.div`
  position: absolute;
  z-index: 10;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: ${props => props.themeColor};
`;

const Content = styled(MorphableText)`
  left: 0;
  z-index: 10;
  background-color: transparent;
  padding: 1rem;
  height: auto;
`;
const BackButton = styled(Button)`
  && {
    border: none;
    position: absolute;
    z-index: 100;
    top: 1rem;
    left: 1rem;
  }
`;

export default class EventCard extends React.Component {
  render() {
    const { className, style, active, expandable, mini } = this.props;
    const {
      name,
      coverImage,
      themeColor,
      location,
      eventTime,
      eventDate,
      performer,
      ageGroupLimit,
    } = this.props.event;

    const showBottomBar = !active && !mini;
    return (
      <Wrapper
        style={style}
        className={className}
        expanded={active && expandable && !mini}
        onClick={e => {
          !mini && this.props.onSelect(e);
        }}
        mini={mini}
        pose={active && expandable ? 'expanded' : 'normal'}
      >
        <BackgroundImageGroup>
          <BackgroundImg coverImage={coverImage} />
          <Shim />
          <Decorator
            coverImage={coverImage}
            themeColor={themeColor}
            expanded={active && expandable}
          />
          <Content>
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
            <Typography style={{ margin: 0 }} type="title" color="white">
              {name}
            </Typography>
          </Content>
        </BackgroundImageGroup>
        {showBottomBar && (
          <BottomSection themeColor={themeColor}>
            <Typography type="body" color="white">
              {location} •{' '}
            </Typography>
            <Typography type="body" color="white">
              {eventDate} |{' '}
            </Typography>
            <Typography type="body" color="white">
              {eventTime}
            </Typography>
            <br />
            {ageGroupLimit && (
              <Typography type="body" color="white">
                Ikäsuositus: {ageGroupLimit} v.
              </Typography>
            )}
          </BottomSection>
        )}
        {this.props.active && (
          <React.Fragment>
            <BackButton
              backgroundColor="rgba(0,0,0, .4)"
              icon="arrow-left"
              onClick={this.props.onDeselect}
              onTouchEnd={this.props.onDeselect}
            >
              Takaisin
            </BackButton>
            {this.props.children}
          </React.Fragment>
        )}
      </Wrapper>
    );
  }
}
