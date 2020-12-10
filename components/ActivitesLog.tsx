import {Text, View} from "./Themed";
import {FlatList, StyleSheet} from "react-native";
import Colors from "../constants/Colors";
import moment from "moment";
import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import React from "react";

export const ActivityLog = ({activities}) => <View style={{backgroundColor: "#F3F6FA", paddingBottom: 80}}>
    <Text style={styles.dailyGoals}>Logged Activities</Text>
    <FlatList
        data={activities}
        renderItem={({item}) => (
            <View style={styles.activity}>
                <View style={[styles.row, {
                    marginLeft: -10,
                    borderBottomWidth: 1,
                    borderRadius: 10,
                    marginRight: -10,
                    alignItems: "center",
                    borderBottomColor: '#eaeaea'
                }]}>
                    <Text style={[styles.item, {
                        color: Colors.light.tint,
                        marginLeft: 0,
                        fontSize: 16
                    }]}>{`${moment(item.startDate).format('D')}/${moment(item.startDate).format('M')}`}</Text>
                    <Text style={[styles.item, {
                        color: Colors.light.text,
                        marginLeft: -15,
                        fontSize: 16
                    }]}>- {item.type}</Text>
                </View>
                <View style={[styles.row, {justifyContent: 'space-between'}]}>
                    <View style={styles.row}>
                        <Ionicons name="ios-time" size={24} style={[styles.icon, {color: '#838383'}]}/>
                        <Text style={styles.item}>{item.duration} Mins</Text>
                    </View>

                    <View style={styles.row}>
                        <FontAwesome5 name="walking" size={24} style={[styles.icon, {color: Colors.light.tint}]}/>
                        <Text style={styles.item}> {item.stepCount} </Text>
                    </View>
                    <View style={styles.row}>
                        <FontAwesome5 name="burn" size={24} style={[styles.icon, {color: Colors.light.tertiaryColor}]}/>
                        <Text style={styles.item}>{item.calories} </Text>
                    </View>
                </View>
            </View>)}
    />
</View>;

export default ActivityLog


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
        fontSize: 14,

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
