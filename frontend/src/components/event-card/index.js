import React from 'react';
import styled from 'styled-components';
import Typography from '../typography';
import Button from '../button';
import { toRgba } from '../../utils';
import chroma from 'chroma-js';
import posed from 'react-pose';
import { tween, easing } from 'popmotion';

const WrapperBase = posed.div({
  normal: {
    height: props => (props.mini ? '13rem' : '20rem'),
    width: true,
    top: 'initial',
    bottom: 'initial',
    borderRadius: 12,
    flip: true,
    transition: tween,
  },
  expanded: {
    height: '100%',
    width: true,
    left: 0,
    top: 0,
    borderRadius: 0,
    flip: true,
    transition: props => tween({ ...props, ease: easing.easeIn }),
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
    delay: 500,
    transition: tween,
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
  overflow-y: ${props => (props.expanded ? 'scroll' : 'hidden')};
  overflow-x: hidden;
  position: ${props => (props.expanded ? 'fixed' : 'relative')};
  z-index: ${props => (props.expanded ? 1000 : 1)};
  max-width: ${props => !props.expanded && '30rem'};
  width: 100%;
  -webkit-overflow-scroll: touch;
  margin: 0;
  cursor: pointer;
  background-color: white;
  will-change: transform, scroll-position;
`;

const Shim = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1;
  left: 0;
  top: 0;
  transition: background-color 1s ease;
  height: 100%;
`;

const Decorator = styled.div`
  z-index: 5;
  background-image: url('${props => props.coverImage}');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  height: 100%;
  filter: blur(4px);
  will-change: clip-path, transform;
  transition: clip-path 0.7s cubic-bezier(.94,.02,.33,1);
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
    z-index: 100; 
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

const EventTypeLabel = styled(Typography)`
  font-weight: 700 !important;
  position: absolute;
  top: 0;
  right: 1rem;
  transform: translate(0, -2rem);
  text-transform: uppercase;
`;

export default class EventCard extends React.Component {
  render() {
    const { className, style, active, expandable, mini, event } = this.props;
    const {
      name,
      coverImage,
      area,
      eventTime,
      eventDate,
      performer,
      ageGroupLimits,
      eventType,
    } = event;

    const soldOut = event.totalAvailableTickets < 1;
    const themeColor = soldOut ? 'black' : event.themeColor;

    const showBottomBar = !active && !mini && !soldOut;
    return (
      <Wrapper
        style={style}
        className={className}
        expanded={active && expandable && !mini}
        onClick={e => {
          !mini && !active && this.props.onSelect(e);
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
              color={
                soldOut
                  ? '#DEDEDE'
                  : toRgba(
                      chroma(themeColor)
                        .saturate(2)
                        .brighten(3)
                        .rgba(),
                    )
              }
            >
              {performer}
            </Typography>
            <Typography style={{ margin: 0 }} type="title" color="white">
              {name}
            </Typography>
            {soldOut && (
              <Typography
                type="body"
                color="#FF4B4B"
                style={{ fontWeight: 700 }}
              >
                LOPPUUNMYYTY
              </Typography>
            )}
          </Content>
        </BackgroundImageGroup>
        {showBottomBar && (
          <BottomSection themeColor={themeColor}>
            <Typography type="body" color="white">
              {area} •{' '}
            </Typography>
            <Typography type="body" color="white">
              {eventDate} |{' '}
            </Typography>
            <Typography type="body" color="white">
              {eventTime}
            </Typography>
            <br />
            {ageGroupLimits && (
              <Typography type="body" color="white">
                Ikäsuositus: {ageGroupLimits.join(', ')} v.
              </Typography>
            )}
            <EventTypeLabel type="body" color="white">
              {eventType}
            </EventTypeLabel>
          </BottomSection>
        )}
        {this.props.active && (
          <React.Fragment>
            <BackButton
              backgroundColor="rgba(0,0,0, .6)"
              icon="arrow-left"
              onClick={this.props.onDeselect}
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
