import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider} from './src/hooks/AuthContext';
import {PaperProvider} from 'react-native-paper';
import {MainStackNavigator} from './src/components/Navigation/StackNavigator';

import {createDrawerNavigator} from '@react-navigation/drawer';
import Home from './src/components/Home/Home';
import {BookingProvider} from './src/hooks/BookingContext';

const Drawer = createDrawerNavigator();

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <BookingProvider>
        <PaperProvider>
          <NavigationContainer>
            <MainStackNavigator />
          </NavigationContainer>
        </PaperProvider>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
