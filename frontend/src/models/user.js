import { types } from 'mobx-state-tree';

const User = types
  .model({
    username: '',
    token: types.maybe(types.string),
  })
  .views(self => ({
    get isAuthenticated() {
      return Boolean(self.token);
    },
  }));

export default User;
