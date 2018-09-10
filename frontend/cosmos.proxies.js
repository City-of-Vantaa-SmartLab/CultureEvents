// cosmos.proxies.js
import createContextProxy from 'react-cosmos-context-proxy';
import PropTypes from 'prop-types';

const ContextProxy = createContextProxy({
  childContextTypes: {
    theme: PropTypes.object.isRequired,
    mobxStores: PropTypes.object.isRequired,
  },
});

export default [
  ContextProxy,
  // ...other proxies
];
