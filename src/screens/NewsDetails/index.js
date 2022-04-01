import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useRoute} from '@react-navigation/native';

const NewsDetails = () => {
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');
  const {params} = useRoute();

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

  return (
    <SafeAreaView
      style={{
        alignItems: 'center',
        flex: 1,
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
      <ScrollView>
        {
          <View
            key={news.id}
            style={{
              margin: 10,
              maxWidth: Dimensions.get('window').width,
            }}>
            <Text
              style={{
                fontSize: 25,
                color: 'black',
                textAlign: 'center',
              }}>
              {news.title}
              {'\n'}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: 'black',
              }}>
              Published at: {news.published_at}
            </Text>
            <Image
              style={{
                width: Dimensions.get('window').width - 20,
                height: 200,
                borderRadius: 15,
              }}
              source={{
                uri: `${news.image}`,
              }}
            />
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'black',
                  }}>
                  Author: {news.author}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'black',
                    textAlign: 'right',
                  }}>
                  Source: {news.source}
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontSize: 20,
                color: 'black',
              }}>
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
