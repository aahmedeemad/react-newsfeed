import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import I18n from './src/locales/i18n';
import Icon from 'react-native-vector-icons/Ionicons';

const Main = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const linking = {
  prefixes: ['voisnews://'],
  config: {
    initialRouteName: 'Home',
    screens: {
      Home: {
        path: 'News',
      },
      'News Details': {
        path: `NewsDetails/:id`,
      },
    },
  },
};

export default () => {
  const {colors} = useTheme();
  const [scheme, setScheme] = useState(useColorScheme());
  const [switchVal, setSwitchVal] = useState(true);

  _retrieveLang = async () => {
    try {
      let language = await AsyncStorage.getItem('language');
      if (language !== null) {
        I18n.locale = `${language}`;
      }
    } catch (error) {
      console.log(error);
    }
  };

  _retrieveLang();

  function Homee() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="News"
          component={Home}
          options={{
            title: I18n.t('News'),
            tabBarIcon: ({color, focused}) => (
              <Icon
                focused={focused}
                color={color}
                name="newspaper"
                size={25}
              />
            ),
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
                renderInsideCircle={() =>
                  switchVal === false ? (
                    <Icon name="sunny-outline" size={25} color={'white'} />
                  ) : (
                    <Icon name="moon" size={25} color={'white'} />
                  )
                }
              />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            title: I18n.t('Settings'),
            tabBarIcon: ({color, focused}) => (
              <Icon focused={focused} color={color} name="settings" size={25} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer
      theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
      linking={linking}>
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
