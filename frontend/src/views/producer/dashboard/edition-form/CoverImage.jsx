import React from 'react';
import styled, { withTheme } from 'styled-components';
import { InputField } from '../../../../components/form';
import Button from '../../../../components/button';
import Typography from '../../../../components/typography';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Image = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 2rem;
  border-radius: 8px;
  max-width: 35rem;
  align-self: center;
`;
const FlexBox = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

class CoverImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmedSrc: props.value,
    };
  }
  componentWillReceiveProps = props => {
    this.setState({ confirmedSrc: props.value });
  };
  getDerivedStateFromProps = props => {
    this.setState({ confirmedSrc: props.value });
  };
  onConfirm = () => {
    this.setState({ confirmedSrc: this.props.value });
  };
  render() {
    const { inputBackgroundColor, value, onChange } = this.props;
    return (
      <Wrapper>
        <Typography style={{ transform: 'translateY(-1rem)' }} type="largebody">
          Cover image
        </Typography>
        <Image src={this.state.confirmedSrc} />
        <FlexBox>
          <InputField
            style={{ width: '100%', marginRight: '1rem' }}
            label="Image URL"
            lightMode
            backgroundColor={inputBackgroundColor}
            type="text"
            onChange={onChange}
            value={value}
          />
          <Button
            onClick={this.onConfirm}
            style={{ backgroundColor: this.props.theme.palette.deepGreen }}
            icon="check"
          >
            Confirm
          </Button>
        </FlexBox>
      </Wrapper>
    );
  }
}

export default withTheme(CoverImage);
