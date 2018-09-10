import React from 'react';
import styled from 'styled-components';
import posed, { PoseGroup } from 'react-pose';
import { tween } from 'popmotion';
import { createPortal } from 'react-dom';
import Icon from 'antd/lib/icon';

const ModalAnimatable = posed.div({
  enter: {
    scale: 1,
    opacity: 1,
    delay: 300,
    delayChildren: 400,
    staggerChildren: 100,
    y: '0%',
  },
  exit: {
    y: '30%',
    scale: 0,
    opacity: 0,
    delay: 300,
    staggerChildren: 100,
  },
});
const CloseButton = posed.span({
  enter: {
    y: 0,
    scale: 1,
  },
  exit: {
    y: -20,
    scale: 0,
  },
});
const Wrapper = styled('div')`
  position: absolute;
  width: 100%;
  min-width: 100%;
  height: 100%;
  z-index: 10000;
  top: 0;
  left: 0;
  display: flex;
  background-color: rgba(0, 0, 0, 0.7);
  transition: all 1s ease;

  ${props =>
    !props.block && 'pointer-events: none; background-color: transparent'};
`;

const ModalWrapper = styled(ModalAnimatable)`
  width: 80%;
  max-width: 600px;
  height: auto;
  margin: auto;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  background-color: white;
  position: relative;
  color: rgba(0, 0, 0, 0.86);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media only screen and (max-height: 580px) {
    height: auto;
  }
  & > span {
    line-height: 0;
    transform: scale(0);
    position: fixed;
    right: 0.3rem;
    top: 0.3rem;
    padding: 4px;
    border-radius: 8px;
    transition: background-color 0.5s ease;
    background-color: ${props => props.theme.palette.red};

    i {
      font-size: 1rem;
      transition: color 0.5s ease;
      color: white;
    }
  }
`;

const ModalContentAnimatable = posed.div({
  enter: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: 20,
    opacity: 0,
  },
});

export const Content = styled(ModalContentAnimatable)`
  padding: 2rem;
`;

export const ActionBar = styled.div`
  padding: 0 2rem 2rem 2rem;
  display: flex;
  justify-content: flex-end;

  button {
    margin-left: 1rem;
  }
`;

class Blur extends React.Component {
  target = document.querySelector('#root');
  isFireFox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  componentDidMount() {
    this.target.style.filter = `blur(8px)`;
  }
  render() {
    return null;
  }
  // remove the blur effect to root
  componentWillUnmount() {
    if (this.isFireFox) {
      return;
    }
    if (this.animation) this.animation.stop();
    tween({ from: 8, to: 0, duration: 100 })
      .pipe(v => v + 'px')
      .start(v => (this.target.style.filter = `blur(${v})`));
  }
}

export default class Modal extends React.Component {
  render() {
    return createPortal(
      <Wrapper block={this.props.show}>
        <PoseGroup animateOnMount>
          {this.props.show && (
            <ModalWrapper key="modal" className={this.props.className}>
              {!this.props.hideCloseButton && (
                <CloseButton onClick={this.props.onClear}>
                  <Icon type="close" />
                </CloseButton>
              )}
              {this.props.children}
              <Blur />
            </ModalWrapper>
          )}
        </PoseGroup>
      </Wrapper>,
      document.querySelector('body'),
    );
  }
}
