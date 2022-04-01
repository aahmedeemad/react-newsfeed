import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';

const Home = () => {
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');

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

  return (
    <SafeAreaView Style={{flex: 1}}>
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
        {news.map(onenew => (
          <View key={onenew.id}>
            <Image
              style={{
                width: 150,
                height: 150,
              }}
              source={{
                uri: `${onenew.image}`,
              }}
            />
            <Text>
              {onenew.title}~{'\n'}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
