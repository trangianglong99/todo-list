import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import HomeScreen from './src/screens/home/HomeScreen';
import {colors} from './src/constants/colors';
import {NavigationContainer} from '@react-navigation/native';
import Router from './src/routers/Router';

const App = () => {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.bgColor}
        translucent
      />
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </>
  );
};

export default App;

const styles = StyleSheet.create({});
