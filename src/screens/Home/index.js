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
import React, {useState, useEffect} from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import I18n from 'react-native-i18n';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Home = () => {
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [text, onChangeText] = useState('');
  const [lang, setLang] = useState('');
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
      Alert.alert('API Error', 'Failed during data fetching', [
        {
          text: 'Retry',
          onPress: () => fetchNews(),
        },
        {
          text: 'Cancel',
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
    'en-US': {
      EN: 'English',
      AR: 'Arabic',
      Search: 'Search',
    },
    ar: {
      EN: 'الأنجليزية',
      AR: 'العربية',
      Search: 'بحث',
    },
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
        <Button
          onPress={() => {
            setLang('en-US');
            I18n.locale = 'en-US';
          }}
          title={I18n.t('EN')}></Button>
        <Button
          onPress={() => {
            setLang('ar');
            I18n.locale = 'ar';
          }}
          title={I18n.t('AR')}></Button>
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
