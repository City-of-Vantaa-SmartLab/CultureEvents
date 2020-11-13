import RootModel from 'models/';
import { onSnapshot } from 'mobx-state-tree';

const rootStore = RootModel.create();

// persist to local storage
onSnapshot(rootStore, snapshot =>
  window.localStorage.setItem('store', JSON.stringify(snapshot)),
);

export default rootStore;
