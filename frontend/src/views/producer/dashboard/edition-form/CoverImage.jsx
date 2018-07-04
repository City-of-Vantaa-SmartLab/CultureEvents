import React from 'react';
import styled, { withTheme } from 'styled-components';
import { InputField } from '../../../../components/form';
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
  render() {
    const { inputBackgroundColor, value, onChange } = this.props;
    return (
      <Wrapper>
        <Typography style={{ transform: 'translateY(-1rem)' }} type="largebody">
          Cover image
        </Typography>
        <Image src={this.props.value} />
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
        </FlexBox>
      </Wrapper>
    );
  }
}

export default withTheme(CoverImage);
