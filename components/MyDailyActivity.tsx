import * as WebBrowser from 'expo-web-browser';
import React, {useEffect, useRef, useState} from 'react';
import {Button, Dimensions, FlatList, NativeAppEventEmitter, StyleSheet} from 'react-native';
import { Text, View } from './Themed';
import {
  LineChart,
  ProgressChart,
} from "react-native-chart-kit";
import Colors from '../constants/Colors';
import { groupBy } from 'lodash'
import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import moment from "moment";
import AppleHealthKit from 'react-native-health';
import getWorkouts from '../services/getWorkouts'
import ActivityLog from "./ActivitesLog";
import Modal from 'react-native-modal';
import MyGoals from "./MyGoals";




export default function MyDailyActivity({ path }: { path: string }) {
  const [myWorkOuts, setMyWorkOuts] = useState()
  const [isModalVisible, setIsModalVisible] = useState(true)
  const healthSubscriber = useRef()
  const PERMS = AppleHealthKit.Constants.Permissions;
  let options = {
    permissions: {
      read: ["Height", "Weight", "StepCount", "DateOfBirth", "BodyMassIndex", "ActiveEnergyBurned","TotalEnergyBurned", "Workout", "Steps", "AppleExerciseTime","NikeFuel","TotalDistance", "BasalEnergyBurned"],
      write: ["Weight", "StepCount", "BodyMassIndex"]
    }
  };

  const initAppleHealth = async () => {
    try {
      AppleHealthKit.initHealthKit(options, (err, results) => {
        if (err) {
          console.log("error initializing Healthkit: ", err);
          return;
        }

        fetchSteps()
        fetchWorkouts()

      });
    } catch (error){
      console.error(error)
    }

  }

  const fetchWorkouts = () => {
    let workOutOptions = {
      startDate: (new Date(2016,4,27)).toISOString(),
      endDate: new Date().toISOString(), // optional; default now
      type: 'Walking', // one of: ['Walking', 'StairClimbing', 'Running', 'Cycling', 'Workout']
    };
    AppleHealthKit.getSamples(workOutOptions, (err: Object, results: Array<Object>) => {
      if (err) {
        console.log(err)
        return;
      }
      console.log('sample', results)
    });
  }

  const fetchSteps = () => {
    let stepOptions = {
      startDate: new Date().toISOString(), // required
      endDate: new Date().toISOString(), // optional; default now
    };
    AppleHealthKit.getStepCount(stepOptions, (err: Object, results: Object) => {
      if (err) {
        console.log(err)
        return;
      }
      console.log(results)
    });
  }



  useEffect(() => {

    // initAppleHealth()
    getWorkouts().then(data => {
      setMyWorkOuts(data.Items.filter(workout => workout.pk === 'gus-id'))
    })
  }, []);


  const group = groupBy(myWorkOuts, function (workout) {
    return moment(workout.startDate).startOf('week').format();
  })
  const activityLineChartData =  {
    labels: Object.keys(group).map(date=>`${moment(date).startOf('week').format('D')}/${moment(date).format('M')}`),
    datasets: [
      {
        data: Object.values(group).map(group=> group.length),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["Daily Workouts"] // optional
  };

  if (!myWorkOuts) {
    return <Text>Loading Workouts</Text>
  }
  return (
    <View style={styles.container}>
      <Text style={styles.dailyGoals}>My Daily Activity</Text>
      <Modal isVisible={isModalVisible}>
        <View style={{flex: 1, borderRadius: 20, marginVertical: 100}}>
         <MyGoals closeModal={()=>setIsModalVisible(false)}/>
        </View>
      </Modal>
      <View style={styles.dailyStepsContainer}>
        <Text style={{position: 'absolute', top: 100, zIndex: 99, color: 'black'}}>Step
          Count {myWorkOuts[0].stepCount}</Text>
        <FontAwesome5 style={{position: 'absolute', top: 150, zIndex: 99, color: 'black'}} name="running" size={50}
                      color="white"/>
        <ProgressChart
            data={{
              labels: 'Last Step Count', // optional
              data: [myWorkOuts[0].stepCount / 1000]
            }}
            height={300}
            width={Dimensions.get("window").width - 30} // from react-native
            strokeWidth={16}
            radius={100}
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
            chartConfig={{
              backgroundGradientFrom: Colors.light.secondary,
              backgroundGradientTo: Colors.light.secondary,
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(114, 101, 226, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(114, 101, 226, ${opacity})`,
              style: {
                borderRadius: 50

              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            hideLegend={true}
        />
      </View>
      <View style={styles.dailyStepsContainer}>
        <LineChart
            data={activityLineChartData}
            height={220}
            width={Dimensions.get("window").width - 30} // from react-native
            strokeWidth={16}
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
            chartConfig={{
              backgroundGradientFrom: Colors.light.secondary,
              backgroundGradientTo: Colors.light.secondary,
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(114, 101, 226, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(114, 101, 226, ${opacity})`,
              style: {
                borderRadius: 50

              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
        />
      </View>
      <ActivityLog activities={myWorkOuts}/>
    </View>
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 5,
    paddingTop: 30,
    backgroundColor: Colors.light.background,
  },
  row:{
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: "center",
    paddingLeft: 3

  },
  col: {
    backgroundColor: 'white'
  },
  icon:{

  },
  activity: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: 'white', borderRadius: 5, marginVertical: 10, marginHorizontal: 10, shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3},

  item: {
    padding: 10,
    fontSize: 18,

    height: 44,
  },
  dailyGoals: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: "bold",
    marginVertical: 20,
    color: Colors.light.text,
  },
  developmentModeText: {
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: Colors.light.background,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  dailyStepsContainer: {
    position: 'relative',
    backgroundColor: 'transparent',
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});
