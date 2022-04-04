import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  Button,
  I18nManager,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {useTheme} from '@react-navigation/native';
import I18n from '../../locales/i18n';
import RNRestart from 'react-native-restart';

const Settings = () => {
  const [lang, setLang] = useState();
  const {colors} = useTheme();
  const [rerender, setRerender] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.card,
    },
    langlabel: {
      fontSize: 15,
      color: colors.text,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.langlabel}>{I18n.t('chooselang')}:</Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Button
              onPress={() => {
                Alert.alert(`${I18n.t('attention')}`, `${I18n.t('alertmsg')}`, [
                  {
                    text: `${I18n.t('cancel')}`,
                    style: 'cancel',
                  },
                  {
                    text: `${I18n.t('procceed')}`,
                    onPress: () => {
                      lang === 'ar' ? setLang('en-US') : setLang('ar');
                      I18n.locale = 'en-US';
                      AsyncStorage.setItem('language', 'en-US');
                      setRerender(!rerender);
                      Alert.alert(
                        `${I18n.t('attention')}`,
                        `${I18n.t('alertmsg2')}`,
                        [
                          {
                            text: `${I18n.t('cancel2')}`,
                            style: 'cancel',
                          },
                          {
                            text: `${I18n.t('procceed2')}`,
                            onPress: () => {
                              I18nManager.forceRTL(false);
                              RNRestart.Restart();
                            },
                          },
                        ],
                      );
                    },
                  },
                ]);
              }}
              title={I18n.t('EN')}></Button>
          </View>
          <View style={{flex: 1}}>
            <Button
              onPress={() => {
                Alert.alert(`${I18n.t('attention')}`, `${I18n.t('alertmsg')}`, [
                  {
                    text: `${I18n.t('cancel')}`,
                    style: 'cancel',
                  },
                  {
                    text: `${I18n.t('procceed')}`,
                    onPress: () => {
                      lang === 'en-US' ? setLang('ar') : setLang('en-US');
                      I18n.locale = 'ar';
                      AsyncStorage.setItem('language', 'ar');
                      setRerender(!rerender);
                      Alert.alert(
                        `${I18n.t('attention')}`,
                        `${I18n.t('alertmsg2')}`,
                        [
                          {
                            text: `${I18n.t('cancel2')}`,
                            style: 'cancel',
                          },
                          {
                            text: `${I18n.t('procceed2')}`,
                            onPress: () => {
                              I18nManager.forceRTL(true);
                              RNRestart.Restart();
                            },
                          },
                        ],
                      );
                    },
                  },
                ]);
              }}
              title={I18n.t('AR')}></Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
