import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  Button,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useTheme} from '@react-navigation/native';
import I18n from 'react-native-i18n';

const Settings = () => {
  const [lang, setLang] = useState();
  const {colors} = useTheme();
  const [rerender, setRerender] = useState(false);

  I18n.translations = {
    'en-US': {
      EN: 'English',
      AR: 'Arabic',
      chooselang: 'Application language',
      attention: 'Attention!',
      alertmsg:
        'Only the app language will change. \nThe news will still be in its original language (english).',
      cancel: 'Cancel',
      procceed: 'Procceed',
    },
    ar: {
      EN: 'الأنجليزية',
      AR: 'العربية',
      chooselang: 'لغة البرنامج',
      attention: 'انتبه!',
      alertmsg:
        'ستتغير لغة البرنامج فقط.\nستظل الأخبار بلغتها الأصلية (الأنجليزية).',
      cancel: 'الغي',
      procceed: 'استمر',
    },
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <ScrollView>
        <Text
          style={{
            fontSize: 15,
            color: colors.text,
          }}>
          {I18n.t('chooselang')}:
        </Text>
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
                      setRerender(!rerender);
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
                      setRerender(!rerender);
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
