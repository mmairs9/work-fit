import {Text, View} from "./Themed";
import * as React from "react";
import {useEffect, useState} from "react";
import {ActivityIndicator, StyleSheet} from 'react-native'
import Leaderboard from 'react-native-leaderboard';
import { groupBy } from 'lodash'
import getWorkouts from '../services/getWorkouts'
import Colors from "../constants/Colors";
import {Ionicons} from "@expo/vector-icons";

export default function LeaderBoardList({navigation}) {
    const [leaderBoardData, setLeaderBoardData] = useState()
    const [leaderBoardScore, setLeaderBoardScore] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const leaderboard = groupBy(leaderBoardData,'userName')


    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchKeepUpWorkouts(false)
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    const data1 = Object.keys(leaderboard).map(key=> {
        return {userName: key === 'gus granbery' ? 'Matt Mairs':key, highScore: leaderboard[key].length, data:leaderboard[key]}
    })

    const fetchKeepUpWorkouts = (reFetch) => {
        if(!reFetch) {
            setIsLoading(true);
        }
        getWorkouts().then(data => {
            setLeaderBoardData(data.Items)
            const leaderboard = groupBy(data.Items,'userName')
            setLeaderBoardScore( Object.keys(leaderboard).map(key=> {
                return {userName:  key.startsWith('gus') ? 'Matt Mairs (You)':key, highScore: leaderboard[key].length, data:leaderboard[key]}
            }))
        })
        setIsLoading(false);
    }

    const navigateToUserActivity = (item, index) => {
        console.log(item)
        navigation.navigate('UserActivityScreen', {userActivities:item})
    }

    if (!leaderboard) return <Text>Loading Leaderboard</Text>
    return (
        <View styles={styles.container}>
            {isLoading ? (
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator size="large" color={Colors.light.tint} />
                </View>
            ) : (<>
            <View style={styles.row}>
                <Ionicons size={100} color={Colors.light.tint} name='ios-podium' />
            </View>
            <Text style={styles.title}>Leaderboard</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Text style={styles.colHeader}>Your Position </Text>
                <Text style={styles.colHeader}>Total Workouts</Text>
            </View>
            <Leaderboard
                data={leaderBoardScore}
                onRowPress={navigateToUserActivity}
                sortBy='highScore'
                labelBy='userName'
            />
            </>
                )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 5,
        marginTop:10,
        paddingTop: 30,
        backgroundColor: Colors.light.background,
    },
    activityIndicatorContainer: {
        marginTop: 250,
    },
    title: {
        paddingBottom: 20,
        fontSize: 20,
        textAlign: 'center',
        fontWeight: "bold",
        marginVertical: 20,
        color: Colors.light.text,
    },
    colHeader: {
        paddingBottom: 15,
        fontSize: 17,
        fontWeight: "bold",
        color: Colors.light.text,
    },
    row:{
        flexDirection: 'row',
        justifyContent: "center",
        paddingTop: 10
    },
})
