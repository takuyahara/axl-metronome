import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.module.scss';
import * as serviceWorker from './serviceWorker';
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';

const bugsnagClient = bugsnag({
  apiKey: process.env.BS_API!,
  appVersion: process.env.npm_package_version,
});
bugsnagClient.use(bugsnagReact, React);

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement,
);

serviceWorker.unregister();
