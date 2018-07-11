// @TODO: Reafactor to make this component less gigantic

import React from 'react';
import styled, { withTheme, injectGlobal } from 'styled-components';
import RawForm, { InputField } from '../../../../components/form';
import Typography from '../../../../components/typography';
import Button, { ButtonGroup } from '../../../../components/button';
import TagPillGroup from '../../../../components/tag-pill';
import AntCheckbox from 'antd/lib/checkbox';
import 'antd/lib/icon/style';
import 'antd/lib/checkbox/style/css';
import CoverImage from './CoverImage';
import ThemeColorChooser from './ThemeColorChooser';
import ButtonBar from './ButtonBar';
import Icon from 'antd/lib/icon';
import * as chroma from 'chroma-js';
import { toRgba, genRandomKey } from '../../../../utils';
import { observable, transaction, toJS } from 'mobx';
import { observer } from 'mobx-react';
import EventModel from '../../../../models/event';
import TicketCatalog from '../../../../models/ticketCatalog';
import isEqual from 'lodash.isequal';

const Form = styled(RawForm)`
  & {
    padding: 2rem 0;
    background-color: white;
    border-radius: 8px;
    overflow-y: auto;
  }
`;
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
    border-radius: 8px;
    border-color: ${props => props.theme.palette.deepGreen};
    color: ${props => props.theme.palette.deepGreen};
    background-color: transparent;

    &: hover {
      background-color: ${props => props.theme.palette.deepGreen};
      color: white;
    }
  }
`;
const RedButton = styled(GreenButton)`
  &&& {
    border-color: ${props => props.theme.palette.red};
    color: ${props => props.theme.palette.red};
    &: hover {
      background-color: ${props => props.theme.palette.red};
    }
  }
`;

const HighlightedArea = styled.div`
  border-left: 3px ${props => props.themeColor} solid;
  width: 100%;
`;

const TicketCatalogInputGroup = props => {
  if (props.ticketCatalog.length === 0) {
    return (
      <Row>
        <GreenButton
          onClick={props.addTicketType}
          onTouchEnd={props.addTicketType}
          icon="plus"
        >
          Add ticket type
        </GreenButton>
      </Row>
    );
  }
  return (
    <HighlightedArea themeColor={props.themeColor}>
      {props.ticketCatalog.map((ticketType, index, arr) => (
        <Row key={ticketType.id}>
          <InputField
            backgroundColor={props.inputBackgroundColor}
            label="Price"
            lightMode
            horizontal
            type="number"
            onChange={props.updateTicketCatalogField(ticketType.id, 'price')}
            value={Number(ticketType.price)}
          />
          <InputField
            backgroundColor={props.inputBackgroundColor}
            style={{
              width: '100%',
            }}
            label="Price Type"
            lightMode
            horizontal
            type="text"
            onChange={props.updateTicketCatalogField(
              ticketType.id,
              'ticketDescription',
            )}
            value={ticketType.ticketDescription}
          />
          <InputField
            backgroundColor={props.inputBackgroundColor}
            label="Seat"
            lightMode
            horizontal
            type="number"
            onChange={props.updateTicketCatalogField(
              ticketType.id,
              'availableSeatForThisType',
            )}
            value={Number(ticketType.availableSeatForThisType)}
          />
          <ButtonGroup style={{ flexShrink: 0 }}>
            <RedButton onClick={props.removeTicketType(ticketType.id)}>
              <Icon type="close" />
            </RedButton>
            {index === arr.length - 1 && (
              <GreenButton
                onClick={props.addTicketType}
                onTouchEnd={props.addTicketType}
                icon="plus"
              >
                Add ticket type
              </GreenButton>
            )}
          </ButtonGroup>
        </Row>
      ))}
    </HighlightedArea>
  );
};

class Editor extends React.Component {
  internalData = observable({
    creationMode: true,
  });
  constructor(props) {
    super(props);
    this.internalData.eventDraft = props.selectedEvent
      ? { ...props.selectedEvent.toJSON() }
      : {
          ...EventModel.create({
            id: genRandomKey(),
          }).toJSON(),
        };
    this.internalData.creationMode = !props.selectedEvent;
  }
  componentWillReceiveProps(props) {
    if (props.selectedEvent) {
      transaction(() => {
        this.internalData.eventDraft = { ...props.selectedEvent.toJSON() };
        this.internalData.creationMode = false;
      });
    } else {
      transaction(() => {
        this.internalData.eventDraft = {
          ...EventModel.create({ id: genRandomKey() }).toJSON(),
        };
        this.internalData.creationMode = true;
      });
    }
  }
  componentDidMount() {
    const { palette } = this.props.theme;
    // override specific class name from ant-design
    // THIS IS A HACK
    injectGlobal`
    .ant-checkbox-checked .ant-checkbox-inner, .ant-checkbox-indeterminate .ant-checkbox-inner {
      background-color: ${palette.primaryDeep} !important;
      border-color: ${palette.primaryDeep} !important;
    }
    .ant-checkbox-wrapper:hover .ant-checkbox-inner, .ant-checkbox:hover .ant-checkbox-inner, .ant-checkbox-input:focus + .ant-checkbox-inner {
      border-color: ${palette.primaryDeep} !important;
    }
`;
  }
  onChange = fieldName => e => {
    this.internalData.eventDraft[fieldName] = e.target.value;
  };
  onPillChange = fieldName => value => {
    this.internalData.eventDraft[fieldName] = value;
  };
  addTicketType = e => {
    this.internalData.eventDraft.ticketCatalog.push({
      ...TicketCatalog.create({ id: genRandomKey() }),
    });
  };
  removeTicketType = id => e => {
    const indexOfType = this.internalData.eventDraft.ticketCatalog.findIndex(
      ticketType => ticketType.id === id,
    );
    this.internalData.eventDraft.ticketCatalog.splice(indexOfType, 1);
  };
  updateTicketCatalogField = (id, fieldName) => e => {
    const catalog = this.internalData.eventDraft.ticketCatalog;
    const index = this.internalData.eventDraft.ticketCatalog.findIndex(
      elem => elem.id === id,
    );
    let value = e.target.value;
    if (fieldName != 'ticketDescription') value = Number(e.target.value);
    catalog[index][fieldName] = value;
  };
  switchToCreationMode = () => {
    transaction(() => {
      this.internalData.eventDraft = {
        ...EventModel.create({ id: genRandomKey() }).toJSON(),
      };
      this.internalData.creationMode = true;
    });
  };
  discardDraft = () => {
    if (this.internalData.creationMode) {
      this.internalData.eventDraft = {
        ...EventModel.create({ id: genRandomKey() }).toJSON(),
      };
    } else {
      this.internalData.eventDraft = {
        ...this.props.selectedEvent.toJSON(),
      };
    }
  };

  updateCoverImageName = imageurl => {
    this.internalData.eventDraft.coverImage = imageurl;
  };

  submitForm = () => {
    this.props.onSubmit(this.internalData.eventDraft);
  };
  render() {
    const inputBackgroundColor = toRgba(
      chroma(this.internalData.eventDraft.themeColor)
        .alpha(0.3)
        .rgba(),
    );
    const serializedDraft = toJS(this.internalData.eventDraft);
    const canConfirm = this.internalData.creationMode
      ? !isEqual(
          serializedDraft,
          EventModel.create({
            id: this.internalData.eventDraft.id,
          }).toJSON(),
        )
      : !isEqual(serializedDraft, this.props.selectedEvent.toJSON());

    return (
      <React.Fragment>
        <ButtonBar
          addNewEventCB={this.switchToCreationMode}
          confirmChangeCB={this.submitForm}
          discardChangeCB={this.discardDraft}
          canConfirm={canConfirm}
          canDiscard={canConfirm && !this.internalData.creationMode}
          canAddNew={!this.internalData.creationMode}
        />
        <Form>
          {this.internalData.creationMode && (
            <Row>
              <Typography
                type="title"
                color={this.internalData.eventDraft.themeColor}
              >
                Create new event
              </Typography>
            </Row>
          )}
          <Row fullsize>
            <InputField
              backgroundColor={inputBackgroundColor}
              label="Name"
              lightMode
              horizontal
              onChange={this.onChange('name')}
              value={this.internalData.eventDraft.name}
            />
            <InputField
              backgroundColor={inputBackgroundColor}
              label="Place"
              lightMode
              horizontal
              onChange={this.onChange('location')}
              value={this.internalData.eventDraft.location}
            />
          </Row>
          <Row
            fullsize
            style={{
              backgroundColor: 'rgba(0,0,0, .1)',
              padding: '2rem 4rem',
              marginBottom: 0,
            }}
          >
            <CoverImage
              value={this.internalData.eventDraft.coverImage}
              backgroundColor={inputBackgroundColor}
              onChange={this.onChange('coverImage')}
              updateCoverImage={this.updateCoverImageName}
            />
          </Row>
          <Row
            fullsize
            style={{
              backgroundColor: inputBackgroundColor,
              padding: '2rem 4rem',
            }}
          >
            <InputField
              label="Description"
              type="textarea"
              lightMode
              rows={10}
              onChange={this.onChange('description')}
              value={this.internalData.eventDraft.description}
            />
          </Row>
          <Row>
            <InputField
              backgroundColor={inputBackgroundColor}
              label="Date"
              lightMode
              horizontal
              type="date"
              onChange={this.onChange('eventDate')}
              value={this.internalData.eventDraft.eventDate}
            />
            <InputField
              backgroundColor={inputBackgroundColor}
              label="Time"
              lightMode
              horizontal
              type="time"
              onChange={this.onChange('eventTime')}
              value={this.internalData.eventDraft.eventTime}
            />
            <InputField
              style={{ width: '100%' }}
              backgroundColor={inputBackgroundColor}
              label="Performer"
              lightMode
              horizontal
              type="text"
              onChange={this.onChange('performer')}
              value={this.internalData.eventDraft.performer}
            />
          </Row>
          <TicketCatalogInputGroup
            ticketCatalog={this.internalData.eventDraft.ticketCatalog}
            addTicketType={this.addTicketType}
            removeTicketType={this.removeTicketType}
            inputBackgroundColor={inputBackgroundColor}
            updateTicketCatalogField={this.updateTicketCatalogField}
            themeColor={this.internalData.eventDraft.themeColor}
          />
          <Row fullsize>
            <InputField
              backgroundColor={inputBackgroundColor}
              label="Contact Information"
              lightMode
              horizontal
              type="text"
              value={this.internalData.eventDraft.contactInformation}
              onChange={this.onChange('contactInformation')}
            />
          </Row>
          <Row>
            <InputField label="Event type" lightMode horizontal>
              <TagPillGroup
                highlightColor={this.internalData.eventDraft.themeColor}
                value={this.internalData.eventDraft.eventType}
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
                highlightColor={this.internalData.eventDraft.themeColor}
                onChange={this.onPillChange('ageGroupLimit')}
                value={this.internalData.eventDraft.ageGroupLimit}
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
              value={this.internalData.eventDraft.themeColor}
              onChange={color =>
                (this.internalData.eventDraft.themeColor = color)
              }
            />
          </Row>
          <Row>
            <Checkbox
              checked={this.internalData.eventDraft.isWordless}
              onChange={() =>
                (this.internalData.eventDraft.isWordless = !this.internalData
                  .eventDraft.isWordless)
              }
            >
              Wordless
            </Checkbox>
            <Checkbox
              style={{ marginRight: '1rem' }}
              checked={this.internalData.eventDraft.isBilingual}
              onChange={() =>
                (this.internalData.eventDraft.isBilingual = !this.internalData
                  .eventDraft.isBilingual)
              }
            >
              Bilingual
            </Checkbox>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}

export default withTheme(observer(Editor));
