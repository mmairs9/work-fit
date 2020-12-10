import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';

import MyDailyActivity from '../components/MyDailyActivity';
import { Text, View } from '../components/Themed';
import Colors from "../constants/Colors";

export default function MyActivityScreen(props) {

  return (
    <View style={styles.container}>
      <ScrollView>
      <Text style={styles.title}>KeepUp</Text>
      <MyDailyActivity {...props} path="/screens/TabOneScreen.js" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.tint,
    alignItems: 'center',
    paddingTop: 30,
    marginBottom: 100,
    justifyContent: 'flex-start',
  },
  title: {
    paddingTop: 35,
    paddingBottom: 20,
    fontSize: 26,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
