import * as React from 'react';
import {Dimensions, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';

import MyDailyActivity from '../components/MyDailyActivity';
import { Text, View } from '../components/Themed';
import { groupBy, sample } from 'lodash'
import Colors from "../constants/Colors";
import moment from "moment";
import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import {LineChart, ProgressChart} from "react-native-chart-kit";
import ActivityLog from "../components/ActivitesLog";
import {Divider} from "react-native-paper";

export default function UserActivityScreen(props) {
  console.log(props)

  const workOuts = props.route.params.userActivities.data

  const group = groupBy(workOuts, workout => moment(workout.startDate).startOf('week').format())
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
  const navigateBack = () => {
    console.log(props.navigation)
    props.navigation.navigate('LeaderBoardScreen')
  }

  const data = {
    labels: ["Running", "Walking", "Swimming"], // optional
    data: [0.2, 0.3, 0.5]
  };



  return (
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity style={{flexDirection: "row", zIndex: 99}} onPress={()=>navigateBack()}>
          <FontAwesome5 name="chevron-left" size={24} style={styles.buttonIcon} />
          <Text style={styles.headerText}>Back</Text>
          </TouchableOpacity>
          <Text  style={styles.headerName}>{props.route.params.userActivities.userName}</Text>
          <View></View>
        </View>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.dailyGoals}>Daily Activity</Text>
          <View style={styles.dailyStepsContainer}>
            <Text style={{position: 'absolute', top: 100, zIndex: 99, color: 'black'}}>Step
              Count {workOuts[0].stepCount}</Text>
            <FontAwesome5 style={{position: 'absolute', top: 150, zIndex: 99, color: 'black'}} name="running" size={50}
                          color="white"/>
            <ProgressChart
                data={{
                  labels: 'Last Step Count', // optional
                  data: [workOuts[0].stepCount / 1000]
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
            <Text style={styles.goal}>Goal {sample(['10,000','15,000', '5000', '1700'])}  Steps</Text>
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

            <Divider style={{marginHorizontal: 50, marginBottom:20, height:2}}/>
          <ActivityLog activities={workOuts}/>
          </View>
        </ScrollView>
        </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.light.tint,
    flex: 1,

  },
  buttonIcon: {
    color: Colors.light.tertiaryColor,
    marginRight: 5
  },
  container: {
    borderRadius: 5,
    paddingTop: 30,
    marginTop: 20,
    marginHorizontal: 5,
    marginBottom: 0,
    paddingBottom: 20,
    backgroundColor: Colors.light.background,
  },
  headerName:{
    color: 'white',
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: -80,
    width: 400,
    textAlign: "center"
  },
  headerText: {
    color: Colors.light.tertiaryColor,
    fontSize: 20,
    textAlign: "left"
  },

  goal: {
    fontSize: 18,
    marginTop: -20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: "bold",
    color: Colors.light.text,
  },
  header: {
    alignItems: "center",
    backgroundColor: Colors.light.tint,
    justifyContent: "space-between",
    paddingTop: 50,
    paddingLeft: 10,
    paddingBottom: 10,
    flexDirection: "row"
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
    overflow: 'hidden',
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



