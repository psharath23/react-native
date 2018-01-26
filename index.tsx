import { AppRegistry } from 'react-native';
import App from './src/App';
import configureStore from './src/reducers';
const store = configureStore({});
const persistStore = require('redux-persist').persistStore;
persistStore(store, {}, (err: any) => {
    if (err) {
    } else {
      renderApp();
    }
  });
function renderApp(){
    AppRegistry.registerComponent('sampleApp', () => App);
}

