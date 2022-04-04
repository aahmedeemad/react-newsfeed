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
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useRoute, useTheme} from '@react-navigation/native';
import I18n from '../../locales/i18n';

const NewsDetails = () => {
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');
  const {params} = useRoute();
  const {colors} = useTheme();

  async function fetchNews() {
    setNewsLoading(true);
    setNewsError(false);
    try {
      const response = await fetch(`http://10.0.2.2:8000/news/${params.id}`);
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

  return (
    <SafeAreaView style={styles.container}>
      {newsLoading && (
        <ActivityIndicator size={200} color="red" style={styles.activityind} />
      )}
      <ScrollView>
        {
          <View key={news.id} style={styles.newspageview}>
            <Text style={styles.detailstitle}>
              {news.title}
              {'\n'}
            </Text>
            <Text style={styles.smalltext}>
              {I18n.t('Publishedat')}: {news.published_at}
            </Text>
            <Image
              style={styles.newsimg}
              source={{
                uri: `${news.image}`,
              }}
            />
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Text style={styles.smalltext}>
                  {I18n.t('Author')}: {news.author}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={styles.smalltext}
                  style={{
                    textAlign: 'right',
                  }}>
                  {I18n.t('Source')}: {news.source}
                </Text>
              </View>
            </View>
            <Text style={styles.detailsdesc}>
              {'\n'}
              {news.description}
            </Text>
          </View>
        }
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewsDetails;
