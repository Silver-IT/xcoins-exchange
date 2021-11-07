import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ExchangeScreen from '../screens/exchange';

const RootStack = createStackNavigator();
export const RootStackNavigator = () => (
    <RootStack.Navigator initialRouteName='Currency Exchange Prototype'>
        <RootStack.Screen name='Currency Exchange Prototype' component={ExchangeScreen} />
    </RootStack.Navigator>
);

function RootNavigator() {
    return <NavigationContainer>
        <RootStackNavigator />
    </NavigationContainer>
}

export default RootNavigator;
