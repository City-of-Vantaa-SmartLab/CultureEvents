import React from 'react';
import Logo from 'components/logo';
import TextArt from 'components/logo/textart';
import { createPortal } from 'react-dom';
import posed, { PoseGroup } from 'react-pose';
import { tween } from 'popmotion';
import Typography from 'components/typography';

const AnimatedElement = posed.div({
  preEnter: {
    x: '130%',
    scale: 1.5,
    opacity: 0,
  },
  enter: {
    delay: 500,
    x: 0,
    scale: 1,
    opacity: 1,
    transition: props => tween({ duration: 1000, ...props }),
  },
  exit: {
    scale: 0,
    opacity: 0,
  },
});

const AnimatedText = posed.div({
  preEnter: {
    opacity: 0,
  },
  enter: {
    delay: 900,
    opacity: 1,
    transition: props => tween({ duration: 1000, ...props }),
  },
  exit: {
    opacity: 0,
  },
});

const AnimatedContainer = posed.div({
  enter: {
    opacity: 1,
    transition: props => tween({ duration: 1000, ...props }),
  },
  exit: {
    delay: 500,
    opacity: 0,
  },
});

class LoadingComponent extends React.Component {
  render() {
    return (
      <PoseGroup>
        {this.props.show && (
          <AnimatedContainer key="main-wrapper" className="loading-background">
            <div className="loading-aligner">
              <PoseGroup animateOnMount preEnterPose="preEnter">
                <AnimatedElement
                  key={'logo-container'}
                  style={{ display: 'flex' }}
                >
                  <Logo noText style={{ width: '5rem', margin: '1rem' }} />
                </AnimatedElement>
                <AnimatedText key={'logo-text'} style={{ display: 'flex' }}>
                  <TextArt
                    style={{ margin: '1rem', width: '13rem', fill: 'white' }}
                  />
                </AnimatedText>
              </PoseGroup>
            </div>
            <PoseGroup animateOnMount preEnterPose="preEnter">
              <AnimatedText key="info-text-spinner" className="loading-aligner">
                <div
                  className="rotating-square"
                  pose="rotating"
                  style={{ marginRight: '2rem' }}
                />
                <Typography
                  className="pulsating-text"
                  key="info-text-details"
                  type="largebody"
                  color="white"
                >
                  Ohjelman lataaminen...
                </Typography>
              </AnimatedText>
            </PoseGroup>
          </AnimatedContainer>
        )}
      </PoseGroup>
    );
  }
  componentWillUnmount() {
    document.querySelector('body').style.backgroundColor = 'white';
  }
}

class LoadingScreen extends React.Component {
  state = {
    done: false,
  };

  componentDidMount() {
    window.setTimeout(() => {
      this.setState({ done: true });
    }, 3500);
  }
  render() {
    return createPortal(
      <LoadingComponent show={!this.state.done} />,
      document.querySelector('body'),
    );
  }
}

export default LoadingScreen;
