import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'

import Home from './Screens/Home';
import LoginScreen from './Screens/LoginScreen';
import RegistrationScreen from './Screens/RegistrationScreen';
import ForgotPasswordScreen from './Screens/ForgotPasswordScreen';
import Settings from './Screens/Settings';
import CreateGroup from './Screens/CreateGroup';
import { MenuProvider } from 'react-native-popup-menu';
import GroupView from './Screens/GroupView';
import CreateQuote from './Screens/CreateQuote';

const Stack = createStackNavigator();

export default function App() {
  return (
    <MenuProvider>
      <NavigationContainer>
          <Stack.Navigator /*screenOptions={{headerShown: false}}*/ > 
              {/* <Stack.Screen
                name='Login'
                options={{headerShown: false}}   
                component={LoginScreen}
              />
              <Stack.Screen
                name='Registration'
                options={{headerShown: false}}
                component={RegistrationScreen}
              />
              <Stack.Screen
                name='ForgotPassword'
                options={{headerShown: true, title: 'Password Reset'}}   
                component={ForgotPasswordScreen}
              /> */}
              <Stack.Screen 
                name='Home'
                options={{headerShown: false,}}       
                component={Home}
              />
              <Stack.Screen 
                name='GroupView'
                options={{headerShown: true}}       
                component={GroupView}
              />
              <Stack.Screen 
                name='CreateQuote'
                options={{headerShown: true}}       
                component={CreateQuote}
              />
              <Stack.Screen 
                name='CreateGroup'
                options={{headerShown: true}}       
                component={CreateGroup}
              />
              <Stack.Screen 
                name='Settings'
                options={{headerShown: true}}   
                component={Settings}
              />
          </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
