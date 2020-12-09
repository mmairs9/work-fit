import {Text, View} from "./Themed";
import * as React from "react";
import {useEffect, useState} from "react";
import {StyleSheet} from 'react-native'
import Leaderboard from 'react-native-leaderboard';
import { groupBy } from 'lodash'
import getWorkouts from '../services/getWorkouts'
import Colors from "../constants/Colors";
import {Ionicons} from "@expo/vector-icons";

export default function LeaderBoardList({navigation}) {
    const [leaderBoardData, setLeaderBoardData] = useState()
    useEffect(() => {
        getWorkouts().then(data => {
            setLeaderBoardData(data.Items)
        })
    }, [])
    const leaderboard = groupBy(leaderBoardData,'userName')

    const data1 = Object.keys(leaderboard).map(key=> {
        return {userName: key, highScore: leaderboard[key].length, data:leaderboard[key]}
    })

    const navigateToUserActivity = (item, index) => {
        console.log(item)
        navigation.navigate('UserActivityScreen', {userActivities:item})
    }

    if (!leaderboard) return <Text>Loading Leaderboard</Text>
    return (
        <View styles={styles.container}>
            <View style={styles.row}>
                <Ionicons size={100} color="black" name='ios-podium' />
            </View>
            <Text style={styles.title}>Leaderboard</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Text style={styles.colHeader}>Your Position</Text>
                <Text style={styles.colHeader}>Total Workouts</Text>
            </View>
            <Leaderboard
                data={data1}
                onRowPress={navigateToUserActivity}
                sortBy='highScore'
                labelBy='userName'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 5,
        paddingTop: 30,
        backgroundColor: Colors.light.background,
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
