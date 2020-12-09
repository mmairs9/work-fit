import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import { Text, View } from '../components/Themed';
import Colors from "../constants/Colors";
import Leaderboard from 'react-native-leaderboard';
import leaderBoardData from '../services/data/leaderboard.json'
import { groupBy } from 'lodash'


export default function LeaderBoardScreen({navigation}) {
    const leaderboard = groupBy(leaderBoardData,'userName')

    const data1 = Object.keys(leaderboard).map(key=> {
        return {userName: key, highScore: leaderboard[key].length}
    })
    const navigateToUserActivity = (item, index) => {
        navigation.navigate('UserActivityScreen', item)
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Leader Board</Text>

                <Leaderboard
                    data={data1}
                    onRowPress={navigateToUserActivity}
                    sortBy='highScore'
                    labelBy='userName'/>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
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
        color: Colors.light.text,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
