import React from 'react';
import Logo from 'components/logo';
import TextArt from 'components/logo/textart';

class LoadingScreen extends React.Component {
  render() {
    return (
      this.props.pastDelay && (
        <div className="loading-background">
          <div className="loading-aligner">
            <Logo noText style={{ width: '8rem', margin: '2rem' }} />
            <TextArt style={{ width: '10rem' }} />
          </div>
        </div>
      )
    );
  }
  componentWillUnmount() {
    document.querySelector('body').style.backgroundColor = 'white';
  }
}

export default LoadingScreen;
