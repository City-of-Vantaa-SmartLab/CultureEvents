import * as React from 'react';
import styled, { css, withTheme, injectGlobal } from 'styled-components';
import Form, { InputField } from '../../../../components/form';
import Button from '../../../../components/button';
import TagPillGroup from '../../../../components/tag-pill';
import AntCheckbox from 'antd/lib/checkbox';
import 'antd/lib/checkbox/style/css';
import 'antd/lib/icon/style';
import Icon from 'antd/lib/icon';
import * as chroma from 'chroma-js';

const toRgba = (rgbaArray: Array<number>) => `rgba(${rgbaArray.join(',')})`;

const Row = styled.div<any>`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  & > div {
    margin-bottom: 0;
    margin-right: 2rem;
    ${props => props.fullsize && 'width: 100%'};
  }
  & > :last-child {
    margin-right: 0;
  }
`;

const Checkbox = styled(AntCheckbox)`
  &&& {
    div {
      align-items: center;
    }
  }
`;

const GreenButton = styled(Button)<any>`
  &&& {
    background-color: ${props => props.theme.palette.deepGreen};
  }
`;

class Editor extends React.Component<{ theme: any }> {
  componentDidMount() {
    const { palette } = this.props.theme;
    // override specific class name from ant-design
    // THIS IS A HACK
    injectGlobal`
    .ant-checkbox-checked .ant-checkbox-inner, .ant-checkbox-indeterminate .ant-checkbox-inner {
      background-color: ${palette.deepGreen} !important;
      border-color: ${palette.deepGreen} !important;
    }
    .ant-checkbox-wrapper:hover .ant-checkbox-inner, .ant-checkbox:hover .ant-checkbox-inner, .ant-checkbox-input:focus + .ant-checkbox-inner {
      border-color: ${palette.deepGreen} !important;
    }
`;
  }
  public render() {
    const { palette } = this.props.theme;
    const inputBackgroundColor = toRgba(
      chroma('#498DC7')
        .alpha(0.3)
        .rgba(),
    );

    return (
      <Form style={{ padding: '1rem' }}>
        <Row fullsize>
          <InputField
            backgroundColor={inputBackgroundColor}
            label="Name"
            lightMode
            horizontal
          />
          <InputField
            backgroundColor={inputBackgroundColor}
            label="Place"
            lightMode
            horizontal
          />
        </Row>
        <Row fullsize>
          <InputField
            backgroundColor={inputBackgroundColor}
            label="Description"
            type="textarea"
            lightMode
            rows={10}
          />
        </Row>
        <Row>
          <InputField
            backgroundColor={inputBackgroundColor}
            label="Date"
            lightMode
            horizontal
            type="date"
          />
          <InputField
            backgroundColor={inputBackgroundColor}
            label="Time"
            lightMode
            horizontal
            type="time"
          />
        </Row>
        <Row>
          <InputField
            backgroundColor={inputBackgroundColor}
            label="Price"
            lightMode
            horizontal
            type="number"
          />
          <InputField
            backgroundColor={inputBackgroundColor}
            style={{
              width: '100%',
            }}
            label="Price Type"
            lightMode
            horizontal
            type="text"
          />
          <InputField
            backgroundColor={inputBackgroundColor}
            label="Seat"
            lightMode
            horizontal
            type="number"
          />
          <GreenButton>
            <Icon type="plus" />
          </GreenButton>
        </Row>
        <Row fullsize>
          <InputField
            backgroundColor={inputBackgroundColor}
            label="Contact Information"
            lightMode
            horizontal
            type="text"
          />
        </Row>
        <Row>
          <InputField label="Event type" lightMode horizontal>
            <TagPillGroup
              active={'COURSE'}
              tags={[
                { id: 'COURSE', text: 'Kurssit ja työpajat' },
                { id: 'SHOW', text: 'Näyttelyt' },
                { id: 'PERFORMANCE', text: 'Esitykset' },
              ]}
            />
          </InputField>
        </Row>
        <Row>
          <InputField label="Age group limit" lightMode horizontal>
            <TagPillGroup
              tags={[
                { id: '0-3', text: '0-3' },
                { id: '3-6', text: '3-6' },
                { id: '7-12', text: '7-12' },
                { id: '13+', text: '13+' },
              ]}
            />
          </InputField>
        </Row>
        <Row>
          <Checkbox>Wordless</Checkbox>
          <Checkbox style={{ marginRight: '1rem' }}>Bilingual</Checkbox>
        </Row>
      </Form>
    );
  }
}

export default withTheme(Editor);
