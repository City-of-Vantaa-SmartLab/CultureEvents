import React from 'react';
import styled, { withTheme, injectGlobal } from 'styled-components';
import Form, { InputField } from '../../../../components/form';
import Button from '../../../../components/button';
import TagPillGroup from '../../../../components/tag-pill';
import AntCheckbox from 'antd/lib/checkbox';
import 'antd/lib/icon/style';
import 'antd/lib/checkbox/style/css';
import CoverImage from './CoverImage';
import ThemeColorChooser from './ThemeColorChooser';
import Icon from 'antd/lib/icon';
import * as chroma from 'chroma-js';
import { toRgba, genRandomKey } from '../../../../utils';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import EventModel, { TicketCatalog } from '../../../../models/event';

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 4rem;
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

const GreenButton = styled(Button)`
  &&& {
    background-color: ${props => props.theme.palette.deepGreen};
  }
`;
const RedButton = styled(Button)`
  &&& {
    background-color: ${props => props.theme.palette.red};
  }
`;

const defaulTicketTypeValue = { ...TicketCatalog.create().toJSON() };

const Editor = observer(
  class Editor extends React.Component {
    eventDraft = observable({
      ...EventModel.create({ ticketCatalog: [defaulTicketTypeValue] }).toJSON(),
    });

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

    onChange = fieldName => e => {
      this.eventDraft[fieldName] = e.target.value;
    };
    onPillChange = fieldName => value => {
      this.eventDraft[fieldName] = value;
    };
    addTicketType = e => {
      this.eventDraft.ticketCatalog.push({
        ...TicketCatalog.create({ id: genRandomKey() }),
      });
    };
    removeTicketType = id => e => {
      const indexOfType = this.eventDraft.ticketCatalog.findIndex(
        ticketType => ticketType.id === id,
      );
      this.eventDraft.ticketCatalog.splice(indexOfType, 1);
    };
    updateTicketCatalogField = (id, fieldName) => e => {
      const entity = this.eventDraft.ticketCatalog;
      const index = entity.findIndex(type => type.id === id);

      let value = e.target.value;
      if (fieldName != 'ticketDescription') value = Number(e.target.value);
      entity[index][fieldName] = value;
    };
    submitForm = () => {
      const event = EventModel.create(this.eventDraft);
    };
    render() {
      const { palette } = this.props.theme;
      const inputBackgroundColor = toRgba(
        chroma(this.eventDraft.themeColor)
          .alpha(0.3)
          .rgba(),
      );
      return (
        <Form style={{ padding: '4rem 0' }}>
          <Row fullsize>
            <InputField
              backgroundColor={inputBackgroundColor}
              label="Name"
              lightMode
              horizontal
              onChange={this.onChange('name')}
              value={this.eventDraft.name}
            />
            <InputField
              backgroundColor={inputBackgroundColor}
              label="Place"
              lightMode
              horizontal
              onChange={this.onChange('location')}
              value={this.eventDraft.location}
            />
          </Row>
          <Row
            fullsize
            style={{
              backgroundColor: 'rgba(0,0,0, .1)',
              padding: '2rem 4rem',
            }}
          >
            <CoverImage
              value={this.eventDraft.coverImage}
              backgroundColor={inputBackgroundColor}
              onChange={this.onChange('coverImage')}
            />
          </Row>
          <Row fullsize>
            <InputField
              backgroundColor={inputBackgroundColor}
              label="Description"
              type="textarea"
              lightMode
              rows={10}
              onChange={this.onChange('description')}
              value={this.eventDraft.description}
            />
          </Row>
          <Row>
            <InputField
              backgroundColor={inputBackgroundColor}
              label="Date"
              lightMode
              horizontal
              type="date"
              onChange={this.onChange('date')}
              value={this.eventDraft.date}
            />
            <InputField
              backgroundColor={inputBackgroundColor}
              label="Time"
              lightMode
              horizontal
              type="time"
              onChange={this.onChange('time')}
              value={this.eventDraft.time}
            />
          </Row>
          {this.eventDraft.ticketCatalog
            .map(ticketType => (
              <Row key={ticketType.id}>
                <InputField
                  backgroundColor={inputBackgroundColor}
                  label="Price"
                  lightMode
                  horizontal
                  type="number"
                  onChange={this.updateTicketCatalogField(
                    ticketType.id,
                    'price',
                  )}
                  value={Number(ticketType.price)}
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
                  onChange={this.updateTicketCatalogField(
                    ticketType.id,
                    'ticketDescription',
                  )}
                  value={ticketType.ticketDescription}
                />
                <InputField
                  backgroundColor={inputBackgroundColor}
                  label="Seat"
                  lightMode
                  horizontal
                  type="number"
                  onChange={this.updateTicketCatalogField(
                    ticketType.id,
                    'availableSeatForThisType',
                  )}
                  value={Number(ticketType.availableSeatForThisType)}
                />
                {ticketType.id === 'defaultTicket' ? (
                  <GreenButton
                    onClick={this.addTicketType}
                    onTap={this.addTicketType}
                  >
                    <Icon type="plus" />
                  </GreenButton>
                ) : (
                  <RedButton onClick={this.removeTicketType(ticketType.id)}>
                    <Icon type="minus" />
                  </RedButton>
                )}
              </Row>
            ))
            .reverse()}
          <Row fullsize>
            <InputField
              backgroundColor={inputBackgroundColor}
              label="Contact Information"
              lightMode
              horizontal
              type="text"
              value={this.eventDraft.contactInformation}
              onChange={this.onChange('contactInformation')}
            />
          </Row>
          <Row>
            <InputField label="Event type" lightMode horizontal>
              <TagPillGroup
                highlightColor={this.eventDraft.themeColor}
                value={this.eventDraft.eventType}
                tags={[
                  { id: 'Kurssit Ja Työpajat', text: 'Kurssit ja työpajat' },
                  { id: 'Näyttelyt', text: 'Näyttelyt' },
                  { id: 'Esitykset', text: 'Esitykset' },
                ]}
                onChange={this.onPillChange('eventType')}
              />
            </InputField>
          </Row>
          <Row>
            <InputField label="Age group limit" lightMode horizontal>
              <TagPillGroup
                highlightColor={this.eventDraft.themeColor}
                onChange={this.onPillChange('ageGroupLimit')}
                value={this.eventDraft.ageGroupLimit}
                tags={[
                  { id: '0-3', text: '0-3' },
                  { id: '3-6', text: '3-6' },
                  { id: '7-12', text: '7-12' },
                  { id: '13+', text: '13+' },
                ]}
              />
            </InputField>
          </Row>
          <Row fullsize>
            <ThemeColorChooser
              value={this.eventDraft.themeColor}
              onChange={color => (this.eventDraft.themeColor = color)}
            />
          </Row>
          <Row>
            <Checkbox
              checked={this.eventDraft.isWordless}
              onChange={() =>
                (this.eventDraft.isWordless = !this.eventDraft.isWordless)
              }
            >
              Wordless
            </Checkbox>
            <Checkbox
              style={{ marginRight: '1rem' }}
              checked={this.eventDraft.isBilingual}
              onChange={() =>
                (this.eventDraft.isBilingual = !this.eventDraft.isBilingual)
              }
            >
              Bilingual
            </Checkbox>
          </Row>
          <Row
            style={{ justifyContent: 'center' }}
            onClick={this.submitForm}
            onTouchEnd={this.submitForm}
          >
            <GreenButton icon="check">Submit</GreenButton>
          </Row>
        </Form>
      );
    }
  },
);

export default withTheme(Editor);
