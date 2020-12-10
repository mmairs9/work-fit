import * as WebBrowser from 'expo-web-browser';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  FlatList,
  NativeAppEventEmitter, ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Text, View } from './Themed';
import {
  LineChart,
  ProgressChart,
} from "react-native-chart-kit";
import Colors from '../constants/Colors';
import { groupBy, orderBy } from 'lodash'
import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import moment from "moment";
import AppleHealthKit from 'react-native-health';
import getWorkouts from '../services/getWorkouts'
import ActivityLog from "./ActivitesLog";
import Modal from 'react-native-modal';
import MyGoals from "./MyGoals";
import { Divider } from 'react-native-paper';


export default function MyDailyActivity(props) {
  const [myWorkOuts, setMyWorkOuts] = useState()
  const [stepCount, setStepCount] = useState()
  const [appleHealtSteps, setAppleHealtSteps] = useState()
  const [reFetch, setReFetch] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const [isLoading, setIsLoading] = useState(true);
  const healthSubscriber = useRef()
  const PERMS = AppleHealthKit.Constants.Permissions;
  let options = {
    permissions: {
      read: ["Height", "Weight", "StepCount", "DateOfBirth", "BodyMassIndex", "ActiveEnergyBurned","TotalEnergyBurned", "Workout", "Steps", "AppleExerciseTime","NikeFuel","TotalDistance", "BasalEnergyBurned"],
      write: ["Weight", "StepCount", "BodyMassIndex"]
    }
  };
  const fetchKeepUpWorkouts = (reFetch) => {
    console.log('fetching')
    if(!reFetch) {
      setIsLoading(true);
    }
    getWorkouts().then(data => {
      const todayWorkouts = data.Items.filter(workout => workout.pk === 'gus-id' && moment(workout.startDate).isSame(Date.now(), 'day'))
      setStepCount(todayWorkouts.map(workout=>parseInt(workout.stepCount)).reduce(sum))

      //  setStepCount(data.Items.filter(workout => workout.pk === 'gus-id' && isToday(moment(workout.startDate))).map(item=>item.stepCount).reduce(sum));
      setMyWorkOuts(data.Items.filter(workout => workout.pk === 'gus-id').map(wo => ({...wo, startDate: moment(wo.startDate)})))
    })
    setIsLoading(false);
  }
  useEffect(() => {
    if(reFetch) {
      fetchKeepUpWorkouts(reFetch)
    }
  }, [reFetch]);

  useEffect(() => {
    initAppleHealth()
    AppleHealthKit.initStepCountObserver({}, () => {});
    healthSubscriber.current = NativeAppEventEmitter.addListener(
        'change:steps',
        (evt) => {
          // a 'change:steps' event has been received. step
          // count data should be re-fetched from Healthkit.
          fetchSteps()
        }
    );
  }, []);



  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      fetchKeepUpWorkouts(false)
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [props.navigation]);



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

  initAppleHealth()
  const fetchWorkouts = () => {
    let workOutOptions = {
      startDate: (new Date(2016,4,27)).toISOString(),
      endDate: new Date().toISOString(), // optional; default now
      type: 'Workout', // one of: ['Walking', 'StairClimbing', 'Running', 'Cycling', 'Workout']
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
      setAppleHealtSteps(results.value)
      console.log(results)
    });
  }

  function sum(prev, next){
    return prev + next;
  }



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
    legend: ["Workouts a Week"] // optional
  };

  const data = {
    labels: ["HIIT", "Soccer", "Running"], // optional
    data: [0.4, 0.6, 0.8]
  };

  return (
    <View style={styles.container}>
      {isLoading || !myWorkOuts ? (
          <View style={styles.activityIndicatorContainer}>
            <View style={{width: "100%"}}>
            <ActivityIndicator size="large" color={Colors.light.tint} />
            </View>
          </View>
      ) : (
          <>
      <Text style={styles.dailyGoals}>My Daily Activity</Text>
      <Modal isVisible={isModalVisible}>
        <View style={{flex: 1, borderRadius: 20, marginVertical: 100}}>
         <MyGoals closeModal={()=>setIsModalVisible(false)}/>
        </View>
      </Modal>
      <View style={styles.dailyStepsContainer}>
        <Text style={{position: 'absolute', top: 100, zIndex: 99, color: 'black'}}>Step
          Count {parseInt(stepCount + (appleHealtSteps||0))}</Text>
        <FontAwesome5 style={{position: 'absolute', top: 150, zIndex: 99, color: 'black'}} name="running" size={50}
                      color="white"/>
        <ProgressChart
            data={{
              labels: 'Last Step Count', // optional
              data: [(stepCount+(appleHealtSteps||0)) / 10000]
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
        <Text style={styles.goal}>Goal 10,000  Steps</Text>
      </View>
      <Divider style={{marginHorizontal: 50, marginBottom:20, height:2}}/>
      <View>
        <ProgressChart
            data={data}
            width={Dimensions.get("window").width - 30} // from react-native
            height={220}
            strokeWidth={16}
            radius={32}
            chartConfig={{
              backgroundGradientFrom: Colors.light.secondary,
              backgroundGradientTo: Colors.light.secondary,
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255,167,38, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255,167,38, ${opacity})`,
              style: {
                borderRadius: 50

              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            hideLegend={false}
        />
      </View>
            <View style={[styles.row, {backgroundColor: Colors.light.background, marginBottom: -20, justifyContent: "center"}]}>
            <FontAwesome5 name="trophy" size={24} color="black" />
            <Text style={[styles.goal,{marginTop: 20,marginLeft: 5}]}>Activity Pro</Text>
            </View>
      <Divider style={{marginHorizontal: 50, marginVertical:20, height:2}}/>
      <View style={styles.dailyStepsContainer}>
        <LineChart
            data={activityLineChartData}
            height={220}
            width={Dimensions.get("window").width - 30} // from react-native
            strokeWidth={16}
            style={{
              marginVertical: 8,
              marginLeft:-30,
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
      <TouchableOpacity onPress={()=>setIsModalVisible(true)} style={styles.appButtonContainer}>
        <Text style={styles.appButtonText}>Set Goals</Text>
      </TouchableOpacity>

      <Divider style={{marginHorizontal: 50, marginBottom:0, marginTop: 20, height:2}}/>
      <ActivityLog activities={orderBy(myWorkOuts, ['startDate'], ['desc'])}/>

        </>
        )}
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 5,
    width: "100%",
    minWidth: 400,
    minHeight: 800,
    paddingTop: 30,
    backgroundColor: Colors.light.background,
  },
  activityIndicatorContainer: {
    marginTop: 250,
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
  appButtonContainer: {
    elevation: 8,
    backgroundColor: Colors.light.tertiaryColor,
    borderRadius: 25,
    marginTop: 20,
    marginRight: 50,
    marginLeft: 50,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
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
    marginTop: 0,
    marginBottom: -20,
    color: Colors.light.text,
  },
  goal: {
    fontSize: 18,
    marginTop: -20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: "bold",
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
