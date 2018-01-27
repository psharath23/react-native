import React from 'react';
import { Provider } from 'react-redux';
// import { AppRegistry } from 'react-native';
import App from './src/App';
import { initReduxStore, store } from './src/store/index';

// AppRegistry.registerComponent('sampleApp', () => App);
initReduxStore((err: any, _state: any) => {
  if (err) { } else {
    renderApp();

  }
});
function renderApp() {
  return (
    <Provider store={store as any}>
      <App />
    </Provider>
  );
}
