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
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Home = () => {
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);

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

  const {isFocused, navigate} = useNavigation();

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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {news.map(onenew => (
          <TouchableOpacity
            onPress={() => {
              navigate(`News Details`, {id: onenew.id});
            }}>
            <View
              key={onenew.id}
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
                  color: 'black',
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
