import React from 'react';
import Home from './src/screens/Home';
import NewsDetails from './src/screens/NewsDetails';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Main = createNativeStackNavigator();

class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Main.Navigator key="mainStack">
          <Main.Screen name="Home" component={Home} />
          <Main.Screen name="News Details" component={NewsDetails} />
        </Main.Navigator>
      </NavigationContainer>
    );
  }
}
export default App;
