// @TODO: Editor is a whole view. Find a way to break up the data into smaller parts
// @TODO: Restructure this component and make props/context more visible. Now everyting is everywhere.

import React from 'react';
import styled, { withTheme, injectGlobal } from 'styled-components';
import RawForm, { InputField } from 'components/form';
import Typography from 'components/typography';
import TagPillGroup from 'components/tag-pill';
import 'antd/lib/icon/style';
import 'antd/lib/checkbox/style/css';
import CoverImage from './CoverImage';
import ThemeColorChooser from './ThemeColorChooser';
import ButtonBar from './ButtonBar';
import * as chroma from 'chroma-js';
import { toRgba, genRandomKey } from 'utils';
import { observable, transaction, toJS } from 'mobx';
import { observer } from 'mobx-react';
import EventModel from 'models/event';
import TicketCatalog from 'models/ticketCatalog';
import TicketCatalogInputGroup from './TicketCatalogInputGroup';
import isEqual from 'lodash.isequal';
import * as consts from 'const.json';

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
  onChange = fieldName => e => {
    this.internalData.eventDraft[fieldName] = e.target.value;
  };
  onPillChange = fieldName => value => {
    this.internalData.eventDraft[fieldName] = value;
  };
  onAgeGroupChange = valueArr => {
    this.internalData.eventDraft.ageGroupLimits = valueArr;
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
    let value = e;
    if (fieldName == 'ticketDescription') value = e.target.value;
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
          deleteEventCB={() =>
            this.props.deleteEvent(this.props.selectedEvent.id)
          }
          canConfirm={canConfirm}
          canDiscard={canConfirm && !this.internalData.creationMode}
          canAddNew={!this.internalData.creationMode}
          canSeeReservation={
            !this.internalData.creationMode && this.props.selectedEvent
          }
        />
        <Form>
          {this.internalData.creationMode && (
            <Row>
              <Typography
                type="title"
                color={this.internalData.eventDraft.themeColor}
              >
                Luo uusi tapahtuma
              </Typography>
            </Row>
          )}
          <Row fullsize>
            <InputField
              backgroundColor={inputBackgroundColor}
              label="Tapahtuman nimi"
              lightMode
              onChange={this.onChange('name')}
              value={this.internalData.eventDraft.name}
            />
          </Row>
          <Row fullsize>
            <InputField
              backgroundColor={inputBackgroundColor}
              label="Tapahtuman paikka"
              lightMode
              onChange={this.onChange('location')}
              value={this.internalData.eventDraft.location}
            />
            <InputField
              style={{ flexShrink: 2 }}
              backgroundColor={inputBackgroundColor}
              label="Alue"
              lightMode
              type="select"
              data={consts.area.map(value => ({ value, label: value }))}
              onChange={value => (this.internalData.eventDraft.area = value)}
              value={this.internalData.eventDraft.area}
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
              padding: '2rem 4rem',
            }}
          >
            <InputField
              backgroundColor={inputBackgroundColor}
              label="Kuvaus"
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
              label="Päivämäärä"
              lightMode
              type="date"
              onChange={this.onChange('eventDate')}
              value={this.internalData.eventDraft.eventDate}
            />
            <InputField
              backgroundColor={inputBackgroundColor}
              label="Aika"
              lightMode
              type="time"
              onChange={this.onChange('eventTime')}
              value={this.internalData.eventDraft.eventTime}
            />
            <InputField
              style={{ width: '100%', flexGrow: 1, flexShrink: 1 }}
              backgroundColor={inputBackgroundColor}
              label="Esittäjä tai järjestäjä"
              lightMode
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
            disabled={!this.internalData.creationMode}
          />
          <Row fullsize>
            <InputField
              backgroundColor={inputBackgroundColor}
              label="Lisätiedot"
              lightMode
              type="text"
              value={this.internalData.eventDraft.contactInformation}
              onChange={this.onChange('contactInformation')}
            />
          </Row>
          <Row>
            <InputField label="Tapahtuman tyyppi" lightMode>
              <TagPillGroup
                highlightColor={this.internalData.eventDraft.themeColor}
                value={this.internalData.eventDraft.eventType}
                tags={consts.eventType.map(a => ({ value: a, label: a }))}
                onChange={this.onPillChange('eventType')}
              />
            </InputField>
          </Row>
          <Row>
            <InputField label="Ikäsuositus" lightMode>
              <TagPillGroup
                highlightColor={this.internalData.eventDraft.themeColor}
                onChange={this.onAgeGroupChange}
                value={this.internalData.eventDraft.ageGroupLimits}
                multiple
                tags={consts.ageGroup.map(a => ({ value: a, label: a }))}
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
        </Form>
      </React.Fragment>
    );
  }
}

export default withTheme(observer(Editor));
