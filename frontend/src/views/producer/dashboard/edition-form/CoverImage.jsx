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
  & > * {
    margin: 0.5rem 0;
  }
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

      if (!response.ok) throw new Error('Kuvan lataus epäonnistui.');
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
          <Spin spinning={true}>Ladataan kuvaa.. Odota hetki, kiitos.</Spin>
        ) : (
          <React.Fragment>
            <Typography
              style={{ transform: 'translateY(-1rem)' }}
              type="largebody"
            >
              Kansikuva
            </Typography>
            <Image src={this.props.value} />
            <FlexBox>
              <InputField
                style={{ width: '100%', marginRight: '1rem' }}
                label="Kuvan verkko-osoite (URL)"
                lightMode
                backgroundColor={inputBackgroundColor}
                type="text"
                onChange={onChange}
                value={value}
              />
            </FlexBox>
            <FlexBox>
              <InputField
                label="Tai lataa tiedosto"
                lightMode
                type="file"
                onChange={this.handleUploadImage}
              />
              <Typography
                style={{ transform: 'translateY(-1rem)' }}
                type="errorMessage"
                show={this.state.uploadFailed}
                color="red"
              >
                <p>Kuvan lataaminen epäonnistui. Yritä uudelleen, kiitos.</p>
              </Typography>
            </FlexBox>
          </React.Fragment>
        )}
      </Wrapper>
    );
  }
}

export default withTheme(connect('store')(CoverImage));
