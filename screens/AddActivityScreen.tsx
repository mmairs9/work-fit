import * as React from 'react';
import {
    ActivityIndicator, Keyboard,
    Picker,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import { FancyAlert } from 'react-native-expo-fancy-alerts';
import { Text, View } from '../components/Themed';
import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { useState} from "react";
import { sample, map, get } from 'lodash'
import addWorkout from '../services/addWorkout'
import CustomActionSheet from '../components/CustomActionSheet'


export default function AddActivityScreen() {
    const [visible, setVisible] = useState(false);
    const [actionSheet, setActionSheet] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const workoutSuccessPhrases = [
        "Boom goes the dynamite. Another workout in the books.",
        "I bet you look cute right now, or maybe a little sweaty? Great job getting your workout in today!",
        "While other sleep, you choose to workout. Good choice.",
        "Workout logged. Time to fuel up!"
    ]
    const initialActivityState = {
        type: '',
        calories: '',
        steps: '',
        duration: ''
    }

    const [activity, setActivity] = useState(initialActivityState);

    const toggleAlert = React.useCallback(() => {

        setVisible(!visible);
    }, [visible]);

    const onSubmit = async () => {
        setIsLoading(true)
        await addWorkout(activity)
        setIsLoading(false)
        setActivity(initialActivityState)
        toggleAlert()
        console.log('activity', activity)
    }

    const activites = [
        "Walking",
        "Running",
        "Swimming",
        "Soccer",
        "Jumping",
        "HIIT",
        "Tennis",
        "Football",
        "Baseball",
    ];

    const onCancelSheet = () => {
        if (get(actionSheet, "onCancel")) {
            actionSheet.onCancel();
        }
        onToggleActionSheet();
    };

    const onToggleActionSheet = (sheet) => {
        setActionSheet(sheet);
    };

    const showPicker = () => {
        onToggleActionSheet({
            children: renderPicker(),
            onCancel: () => onToggleActionSheet(),
        });
    };

    const renderPicker = () => {
        return (
            <Picker
                selectedValue={activity.type}
                onValueChange={(value) => {
                    setActivity({ ...activity, type: value });
                    onToggleActionSheet();
                }}
            >
                {map(activites, (act) => (
                    <Picker.Item key={act} label={act} value={act} />
                ))}
            </Picker>
        );
    };

  return (
    <View style={styles.container}>
      <FontAwesome5 name="running" size={50} color={Colors.light.tint} />
      <Text style={styles.title}>Track Your Workout</Text>
      <View style={styles.separator} lightColor="#eee" />
      <View style={styles.getStartedContainer} lightColor="#eee">
          {isLoading ? (
              <View style={styles.activityIndicatorContainer}>
                  <ActivityIndicator size="large" color={Colors.light.tint} />
              </View>
          ) : (<>
          {actionSheet && (
              <CustomActionSheet
                  backgroundColor={"transparent"}
                  modalVisible={!!actionSheet}
                  onCancel={onCancelSheet}
                  options={actionSheet.options}
              >
                  <View style={styles.pickerOverlay}>{actionSheet.children}</View>
              </CustomActionSheet>
          )}
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
              <ScrollView style={{flexGrow: 1}} keyboardShouldPersistTaps={false}>

              <>

          <TouchableOpacity
              testID="picker"
              onPress={showPicker}
              style={{
                  borderBottomWidth: 1,
                  borderColor: "#e4e4e4",
                  marginTop: 0,
              }}
          >
              <Text style={[styles.input, { paddingTop: 10, color: activity.type.length>0? "black":"gray"  }]}>
                  {activity.type === '' ? 'Type of Activity' : activity.type }
              </Text>
          </TouchableOpacity>
          <TextInput
              placeholderTextColor="gray"
              style={styles.input}
              keyboardType="numeric"
              placeholder="Duration (minutes)"
              onChangeText={text => setActivity({ ...activity, duration: text })}
              value={activity.duration}
          />
          <TextInput
              placeholderTextColor="gray"
              style={styles.input}
              keyboardType="numeric"
              placeholder="Steps"
              onChangeText={text => setActivity({ ...activity, steps: text })}
              value={activity.steps}
          />
          <TextInput
              placeholderTextColor="gray"
              style={styles.input}
              keyboardType="numeric"
              placeholder="Calories Burned"
              onChangeText={text => setActivity({ ...activity, calories: text })}
              value={activity.calories}
          />
          <TouchableOpacity onPress={onSubmit} style={styles.appButtonContainer}>
              <Text style={styles.appButtonText}>Submit Activity</Text>
          </TouchableOpacity>
                  </>
              </ScrollView>

          </>)}
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
    pickerOverlay: {
        backgroundColor: "white",
        marginBottom: 10,
        borderRadius: 5,
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
    activityIndicatorContainer: {
        marginTop: 250,
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
