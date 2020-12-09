import * as React from 'react';
import {StyleSheet} from 'react-native';
import { Text, View } from '../components/Themed';
import Colors from "../constants/Colors";

import LeaderBoardList from "../components/LeaderBoardList";


export default function LeaderBoardScreen({navigation}) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>KeepUp</Text>
            <LeaderBoardList navigation={navigation}/>
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
