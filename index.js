import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import App from './src/App';
import { initReduxStore, store } from './src/store/index';
initReduxStore({});
const AppComponent = () => React.createElement(Provider, { store: store },
    React.createElement(App, null));
AppRegistry.registerComponent('sampleApp', () => AppComponent);
