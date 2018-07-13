import React from 'react';
import styled, { withTheme } from 'styled-components';
import { InputField } from '../../../../components/form';
import Typography from '../../../../components/typography';
import { connect } from '../../../../utils';
import Spin from 'antd/lib/spin';
import 'antd/dist/antd.css';

const BASE_URL = 'http://' + window.location.host;
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
  state = {
    uploadFailed: false,
    uploadProgress: false,
  };
  handleUploadImage = async ev => {
    ev.preventDefault();
    this.setState({
      uploadFailed: false,
      uploadInProgress: true,
    });
    const imageurl = await this.uploadImage(ev.target.files[0]);
    this.setState({
      uploadFailed: imageurl ? false : true,
      uploadInProgress: false,
    });
    this.props.updateCoverImage(imageurl);
  };

  async uploadImage(file) {
    try {
      const userToken = await this.props.store.getUserToken();
      const formData = new FormData();
      formData.append('upload', file);
      const response = await window.fetch(BASE_URL + '/fileupload', {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
        method: 'POST',
      });

      if (!response.ok)
        throw new Error('Failed to upload image. Server threw HTTP error code');
      const imageurl = await response.json();
      return imageurl;
    } catch (error) {
      console.error('error is:', error);
      return null;
    }
  }

  render() {
    const {
      inputBackgroundColor,
      value,
      onChange,
      updateCoverImage,
    } = this.props;
    return (
      <Wrapper>
        {this.state.uploadInProgress ? (
          <Spin spinning={true}>Uploading Image.. Please Wait!.</Spin>
        ) : (
          <React.Fragment>
            <Typography
              style={{ transform: 'translateY(-1rem)' }}
              type="largebody"
            >
              Cover image
              <InputField type="file" onChange={this.handleUploadImage} />
            </Typography>
            <Typography
              style={{ transform: 'translateY(-1rem)' }}
              type="errorMessage"
              show={this.state.uploadFailed}
              color="red"
            >
              <p>Image upload failed.. Please try again!.</p>
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
          </React.Fragment>
        )}
      </Wrapper>
    );
  }
}

export default withTheme(connect('store')(CoverImage));
