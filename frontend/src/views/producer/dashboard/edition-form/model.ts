import { types, getSnapshot } from 'mobx-state-tree';

const EditorModel = types.model({
  name: types.string,
  place: types.string,
  performer: types.string,
});

const formState = EditorModel.create({
  name: '',
  place: '',
  performer: '',
});

export default formState;
