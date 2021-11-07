import React from 'react';
import {
  StatusBar,
} from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import store from './src/core/redux/store';
import RootNavigator from './src/navigations';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar />
        <RootNavigator />
      </SafeAreaProvider>
    </Provider>
  );
};


export default App;
