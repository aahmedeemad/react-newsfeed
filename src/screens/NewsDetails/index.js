import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  Dimensions,
  StyleSheet,
  Button,
  Linking,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useRoute, useTheme} from '@react-navigation/native';
import I18n from '../../locales/i18n';
import MY_API_TOKEN from '../../../config';

const NewsDetails = () => {
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');
  const {params} = useRoute();
  const {colors} = useTheme();
  const [id, setid] = useState(0);

  async function fetchNews() {
    setNewsLoading(true);
    setNewsError(false);
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${MY_API_TOKEN()}`,
      );
      const data = await response.json();
      if (params.title) {
        const datafiltered = data.articles.filter(
          article => article.title === params.title,
        );
        setNews(datafiltered);
      } else {
        setid(params.id);
        setNews(data.articles);
      }
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

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
    },
    activityind: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 350,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    newspageview: {
      margin: 10,
      maxWidth: Dimensions.get('window').width,
    },
    newsimg: {
      width: Dimensions.get('window').width - 20,
      height: 200,
      borderRadius: 15,
    },
    detailstitle: {
      fontSize: 25,
      color: colors.text,
      textAlign: 'center',
    },
    smalltext: {
      fontSize: 15,
      color: colors.text,
    },
    detailsdesc: {
      fontSize: 20,
      color: colors.text,
    },
  });

  if (news <= 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size={200} color="red" style={styles.activityind} />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        {newsLoading && (
          <ActivityIndicator
            size={200}
            color="red"
            style={styles.activityind}
          />
        )}
        <ScrollView>
          {
            <View key={news[id].urlToImage} style={styles.newspageview}>
              <Text style={styles.detailstitle}>
                {params.title || news[id].title}
                {'\n'}
              </Text>
              <Text style={styles.smalltext}>
                {I18n.t('Publishedat')}: {news[id].publishedAt}
              </Text>
              <Image
                style={styles.newsimg}
                source={{
                  uri: `${news[id].urlToImage}`,
                }}
              />
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text style={styles.smalltext}>
                    {I18n.t('Author')}: {news[id].author}
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={styles.smalltext}
                    style={{
                      textAlign: 'right',
                    }}>
                    {I18n.t('Source')}: {news[id].source.name}
                  </Text>
                </View>
              </View>
              <Text style={styles.detailsdesc}>
                {'\n'}
                {news[id].content}
                {'\n'}
              </Text>
              <Button
                onPress={() => {
                  Linking.canOpenURL(news[id].url).then(supported => {
                    if (supported) {
                      Linking.openURL(news[id].url);
                    } else {
                      console.log(
                        "Don't know how to open URI: " + news[id].url,
                      );
                    }
                  });
                }}
                title={I18n.t('readfull')}
              />
            </View>
          }
        </ScrollView>
      </SafeAreaView>
    );
  }
};

export default NewsDetails;
