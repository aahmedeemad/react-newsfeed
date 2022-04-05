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
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import I18n from '../../locales/i18n';
import MY_API_TOKEN from '../../../config';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Home = () => {
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
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${MY_API_TOKEN()}`,
      );
      const data = await response.json();
      setNews(data.articles);
    } catch (err) {
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

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      backgroundColor: colors.card,
    },
    activityind: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 300,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchbar: {
      height: 50,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,
      fontSize: 20,
      borderColor: colors.text,
      width: Dimensions.get('window').width - 20,
    },
    newspageview: {
      alignItems: 'center',
      margin: 10,
      maxWidth: Dimensions.get('window').width,
    },
    newsimg: {
      width: Dimensions.get('window').width - 20,
      height: 200,
      borderRadius: 15,
    },
    title: {
      fontSize: 20,
      color: colors.text,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {newsLoading && (
        <ActivityIndicator size={200} color="red" style={styles.activityind} />
      )}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <TextInput
          placeholder={I18n.t('Search')}
          placeholderTextColor={colors.text}
          style={styles.searchbar}
          onChangeText={text => searchFilterFunction(text)}
        />
        {news.map(onenew => (
          <TouchableOpacity
            key={onenew.title}
            onPress={() => {
              navigate(`News Details`, {title: onenew.title});
            }}>
            <View style={styles.newspageview}>
              <Image
                style={styles.newsimg}
                source={{
                  uri: `${onenew.urlToImage}`,
                }}
              />
              <Text style={styles.title}>{onenew.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
