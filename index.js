import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import App from './src/App';
import { initReduxStore, store } from './src/store/index';
initReduxStore({});
const AppComponent = () =>
  <Provider store={store}>
    <App />
  </Provider>;
AppRegistry.registerComponent('sampleApp', () => AppComponent);