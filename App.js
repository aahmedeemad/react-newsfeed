import React, {useState} from 'react';
import Home from './src/screens/Home';
import NewsDetails from './src/screens/NewsDetails';
import Settings from './src/screens/Settings';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useTheme,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useColorScheme, Button, Text} from 'react-native';
import {Switch} from 'react-native-switch';
import FontAwesome from 'react-native-fontawesome';
import I18n from 'react-native-i18n';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import en from './src/locales/en';
import ar from './src/locales/ar';

const Main = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default () => {
  I18n.fallbacks = true;
  const {colors} = useTheme();
  const [scheme, setScheme] = useState(useColorScheme());
  const [switchVal, setSwitchVal] = useState(true);

  I18n.translations = {
    en,
    ar,
  };

  function Homee() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="News"
          component={Home}
          options={{
            title: I18n.t('News'),
            headerRight: () => (
              <Switch
                value={switchVal}
                barHeight={40}
                circleSize={40}
                onValueChange={() => {
                  scheme === 'dark' ? setScheme('light') : setScheme('dark');
                  switchVal === false
                    ? setSwitchVal(true)
                    : setSwitchVal(false);
                }}
                innerCircleStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                disabled={false}
                activeText={I18n.t('DarkMode')}
                inActiveText={I18n.t('LightMode')}
                backgroundActive={'green'}
                backgroundInactive={'gray'}
                circleActiveColor={'#30a566'}
                circleInActiveColor={'#000000'}
                switchWidthMultiplier={3.9}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            title: I18n.t('Settings'),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Main.Navigator key="mainStack">
        <Main.Screen
          name="Home"
          options={{
            title: I18n.t('Home'),
            headerShown: false,
          }}
          component={Homee}
        />
        <Main.Screen
          name="News Details"
          options={{
            title: I18n.t('NewsDetails'),
          }}
          component={NewsDetails}
        />
      </Main.Navigator>
    </NavigationContainer>
  );
};
