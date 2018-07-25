import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './normalize.css';
import registerServiceWorker from './registerServiceWorker';
import App from './views';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
