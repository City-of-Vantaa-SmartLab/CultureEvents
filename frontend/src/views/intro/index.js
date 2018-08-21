import React from 'react';
import Logo from 'components/logo';
import TextArt from 'components/logo/textart';
import { createPortal } from 'react-dom';
import posed, { PoseGroup } from 'react-pose';
import { tween, physics } from 'popmotion';
import Typography from 'components/typography';

const AnimatedElement = posed.div({
  preEnter: {
    x: '150%',
    scale: 1.5,
    opacity: 0,
  },
  enter: {
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
    delay: 500,
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
    staggerChildren: 100,
    delayChildren: 100,
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
          <AnimatedContainer className="loading-background">
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
              <AnimatedText className="loading-aligner">
                <div
                  className="rotating-square"
                  pose="rotating"
                  style={{ marginRight: '2rem' }}
                />
                <Typography type="largebody" color="white">
                  Loading the application...
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
    }, 4000);
  }
  render() {
    return createPortal(
      <LoadingComponent show={!this.state.done} />,
      document.querySelector('body'),
    );
  }
}

export default LoadingScreen;
