import * as React from 'react';
import {Platform, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { FancyAlert } from 'react-native-expo-fancy-alerts';
import { Text, View } from '../components/Themed';
import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { useState} from "react";
import { sample } from 'lodash'
import addWorkout from '../services/addWorkout'

export default function AddActivityScreen() {
    const [visible, setVisible] = useState(false);

    const workoutSuccessPhrases = [
        "Boom goes the dynamite. Another workout in the books.",
        "I bet you look cute right now, or maybe a little sweaty? Great job getting your workout in today!",
        "While other sleep, you choose to workout. Good choice.",
        "Workout logged. Time to fuel up!"
    ]

    const [activtity, setActivity] = useState({
      type: '',
      calories: '',
      steps: '',
      duration: ''
    });

    const toggleAlert = React.useCallback(() => {
        setVisible(!visible);
    }, [visible]);

    const onSubmit = () => {
        console.log('activity', activtity)
        addWorkout()
        //submit date to api
        toggleAlert()
    }


  return (
    <View style={styles.container}>
      <FontAwesome5 name="running" size={50} color={Colors.light.tint} />
      <Text style={styles.title}>Track Your Workout</Text>
      <View style={styles.separator} lightColor="#eee" />
      <View style={styles.getStartedContainer} lightColor="#eee">
          <FancyAlert
              visible={visible}
              style={styles.alert}
              icon={
                  <TouchableOpacity onPress={toggleAlert}  style={[ styles.icon, { borderRadius: 32, zIndex: 9 } ]}>
                  <View style={[ styles.icon, { borderRadius: 32 } ]}>
                      <Ionicons
                          name={Platform.select({ ios: 'ios-close', android: 'md-close' })}
                          size={36}
                          color="#FFFFFF"
                      />
                  </View>
                  </TouchableOpacity>
              }
          >
              <View style={styles.content}>

                  <Text style={styles.alertText}>{sample(workoutSuccessPhrases)}</Text>
              </View>
          </FancyAlert>
          <TextInput
              style={styles.input}
              placeholder="Type of Activity"
              onChangeText={text => setActivity({ ...activtity, type: text })}
              value={activtity.type}
          />
          <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Duration (minutes)"
              onChangeText={text => setActivity({ ...activtity, duration: text })}
              value={activtity.duration}
          />
          <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Steps"
              onChangeText={text => setActivity({ ...activtity, steps: text })}
              value={activtity.steps}
          />
          <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Calories Burned"
              onChangeText={text => setActivity({ ...activtity, calories: text })}
              value={activtity.calories}
          />
          <TouchableOpacity onPress={onSubmit} style={styles.appButtonContainer}>
              <Text style={styles.appButtonText}>Submit Activity</Text>
          </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    paddingTop: 80,
    justifyContent: 'flex-start',
  },
    alertText: {
    color: 'black',
        fontSize: 14,
        textAlign: 'center'
    },
    alert: {
        backgroundColor: '#EEEEEE',
    },
    contentText: {
        textAlign: 'center',
        paddingHorizontal: 20
    },
    content: {
        display: 'flex',
        backgroundColor: '#EEEEEE',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -16,
        marginBottom: 16,
    },
    icon: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3ec78c',
        width: '100%',
    },
    appButtonContainer: {
        elevation: 8,
        backgroundColor: Colors.light.tertiaryColor,
        borderRadius: 10,
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 12
    },
    appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
    input: {
      marginVertical: 20,
        height: 44,
        paddingHorizontal: 10,
        borderRadius: 8,

        width: '100%',
        backgroundColor: Colors.light.secondary,
        borderWidth: 1
    },
  title: {
    paddingTop: 30,
    fontSize: 26,
    color: Colors.light.text,
    fontWeight: 'bold',
  },
    getStartedContainer: {
       flex: 1,
        width: '100%',
        paddingHorizontal: 40,
        backgroundColor: Colors.light.background,
        marginHorizontal: 10,
    },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
