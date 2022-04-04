import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import I18n from 'react-native-i18n';
import en from '../../locales/en';
import ar from '../../locales/ar';
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Home = () => {
  I18n.fallbacks = true;
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [text, onChangeText] = useState('');
  const {isFocused, navigate} = useNavigation();
  const {colors} = useTheme();

  async function fetchNews() {
    setNewsLoading(true);
    setNewsError(false);
    try {
      const response = await fetch('http://10.0.2.2:8000/news');
      const data = await response.json();
      setNews(data);
    } catch (err) {
      console.log(err);
      setNewsError(err);
    } finally {
      setNewsLoading(false);
    }
  }

  useEffect(() => {
    if (newsError) {
      Alert.alert(`${I18n.t('APIErr')}`, `${I18n.t('APIfailed')}`, [
        {
          text: `${I18n.t('retry')}`,
          onPress: () => fetchNews(),
        },
        {
          text: `${I18n.t('cancel')}`,
          Style: 'destructive',
        },
      ]);
    }
  }, [newsError]);

  useEffect(() => {
    fetchNews();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  function searchFilterFunction(text) {
    if (text == '') {
      fetchNews();
    } else {
      const newData = news.filter(item => {
        const itemData = `${item.title.toUpperCase()}`;
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setNews(newData);
    }
  }

  I18n.translations = {
    en,
    ar,
  };

  return (
    <SafeAreaView
      style={{
        alignItems: 'center',
        flex: 1,
        backgroundColor: colors.card,
      }}>
      {newsLoading && (
        <ActivityIndicator
          size={200}
          color="red"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 350,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      )}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <TextInput
          placeholder={I18n.t('Search')}
          placeholderTextColor={colors.text}
          style={{
            height: 50,
            margin: 12,
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            fontSize: 20,
            borderColor: colors.text,
            width: Dimensions.get('window').width - 20,
          }}
          onChangeText={text => searchFilterFunction(text)}
        />
        {news.map(onenew => (
          <TouchableOpacity
            key={onenew.id}
            onPress={() => {
              navigate(`News Details`, {id: onenew.id});
            }}>
            <View
              style={{
                alignItems: 'center',
                margin: 10,
                maxWidth: Dimensions.get('window').width,
              }}>
              <Image
                style={{
                  width: Dimensions.get('window').width - 20,
                  height: 200,
                  borderRadius: 15,
                }}
                source={{
                  uri: `${onenew.image}`,
                }}
              />
              <Text
                style={{
                  fontSize: 20,
                  color: colors.text,
                }}>
                {onenew.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
