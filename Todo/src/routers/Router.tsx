import auth from '@react-native-firebase/auth';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import LoginScreen from '../screens/auth/LoginScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import HomeScreen from '../screens/home/HomeScreen';
import AddNewtasksScreen from '../screens/tasks/AddNewtasksScreen';
import ListTaskScreen from '../screens/tasks/ListTaskScreen';
import TaskDetailScreen from '../screens/tasks/TaskDetailScreen';
import NotificationScreen from '../screens/home/NotificationScreen';

const Router = () => {
  const Stack = createNativeStackNavigator();

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    });
  }, []);

  const MainRouter = (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Add task" component={AddNewtasksScreen} />
      <Stack.Screen name="Task Detail" component={TaskDetailScreen} />
      <Stack.Screen name="List Task" component={ListTaskScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
    </Stack.Navigator>
  );

  const AuthRouter = (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignInScreen" component={SignInScreen} />
    </Stack.Navigator>
  );

  return isLogin ? MainRouter : AuthRouter;
};

export default Router;

const styles = StyleSheet.create({});
