import React from 'react';
import styled, { withTheme } from 'styled-components';
import { InputField } from '../../../../components/form';
import Button from '../../../../components/button';

const Image = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 2rem;
  border-radius: 8px;
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
  onConfirm = () => {
    this.setState({ confirmedSrc: this.props.value });
  };
  render() {
    const { inputBackgroundColor, value, onChange } = this.props;
    return (
      <div>
        <Image src={this.state.confirmedSrc} />
        <FlexBox>
          <InputField
            style={{ width: '100%', marginRight: '1rem' }}
            label="Image URL"
            lightMode
            backgroundColor={inputBackgroundColor}
            type="text"
            onChange={this.props.onChange}
            value={this.props.value}
          />
          <Button
            onClick={this.onConfirm}
            style={{ backgroundColor: this.props.theme.palette.lightGreen }}
          >
            Confirm
          </Button>
        </FlexBox>
      </div>
    );
  }
}

export default withTheme(CoverImage);
