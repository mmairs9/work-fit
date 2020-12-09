import { Text, View } from "./Themed";
import {
    Button,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    CheckBox,
    Platform,
    ActivityIndicator,
    Switch, ScrollView,
} from "react-native";
import React, { useState } from "react";
import Colors from "../constants/Colors";
import addGoals from "../services/addGoals.js";
import { FancyAlert } from "react-native-expo-fancy-alerts";
import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { sample } from "lodash";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

export const MyGoals = ({ closeModal }) => {
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [goals, setGoals] = useState({
        dailyCalories: 0,
        dailySteps: 0,
        workoutsPerWeek: 0,
        overAllAthlete: false,
        activityPro: false,
        topLeader: false,
        workoutStreaks: false,
    });

    const toggleAlert = React.useCallback(() => {
        setVisible(!visible);
    }, [visible]);

    const goalSuccessPhrases = [
        "Boom goes the dynamite. Another workout in the books.",
        "I bet you look cute right now, or maybe a little sweaty? Great job getting your workout in today!",
        "While other sleep, you choose to workout. Good choice.",
        "Workout logged. Time to fuel up!",
    ];

    const onSubmit = async () => {
        setIsLoading(true);
        await addGoals(goals);
        setIsLoading(false);
        toggleAlert();
    };

    return (
        <View
            style={[
                styles.container,
                { flex: 1, borderRadius: 20, marginVertical: 10 },
            ]}
        >
            <TouchableOpacity style={{position:"absolute", top: 10,zIndex:99, right: 0}} onPress={()=>closeModal()}>
            <AntDesign name="close" size={24}  color="black" />
            </TouchableOpacity>
            <ScrollView>
            {isLoading ? (
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator size="large" color={Colors.light.tint} />
                </View>
            ) : (
                <>
                    <FancyAlert
                        visible={visible}
                        style={styles.alert}
                        icon={
                            <TouchableOpacity
                                onPress={toggleAlert}
                                style={[styles.icon, { borderRadius: 32, zIndex: 9 }]}
                            >
                                <View style={[styles.icon, { borderRadius: 32 }]}>
                                    <Ionicons
                                        name={Platform.select({
                                            ios: "ios-close",
                                            android: "md-close",
                                        })}
                                        size={36}
                                        color="#FFFFFF"
                                    />
                                </View>
                            </TouchableOpacity>
                        }
                    >
                        <View style={styles.content}>
                            <Text style={styles.alertText}>{sample(goalSuccessPhrases)}</Text>
                        </View>
                    </FancyAlert>
                    <Text style={styles.heading}>My Goals!</Text>
                    <Text style={styles.description}>
                        Tell us what is driving you to Keep Up!
                    </Text>

                    <View style={styles.row}>
                        <View style={styles.row}>
                            <FontAwesome5 name="walking" size={24} color="black" />
                            <Text style={styles.label}>Daily Steps: </Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setGoals({ ...goals, dailySteps: text })}
                            value={goals.dailySteps}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Ionicons name="ios-flame" size={24} color="black" />
                            <Text style={styles.label}>Daily Calories: </Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            onChangeText={(text) =>
                                setGoals({ ...goals, dailyCalories: text })
                            }
                            value={goals.dailyCalories}
                        />
                    </View>

                    <View
                        style={[
                            styles.row,
                            {
                                marginVertical: 15,
                            },
                        ]}
                    >
                        <View style={styles.row}>
                            <AntDesign name="barschart" size={24} color="black" />
                            <Text style={styles.label}>Workouts per week: </Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            onChangeText={(text) =>
                                setGoals({ ...goals, workoutsPerWeek: text })
                            }
                            value={goals.workoutsPerWeek}
                        />
                    </View>

                    <View
                        style={[
                            styles.row,
                            {
                                marginVertical: 15,
                            },
                        ]}
                    >
                        <View style={styles.row}>
                            <Ionicons name="ios-barbell-sharp" size={24} color="black" />
                            <Text style={styles.label}>Top Leader</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={goals.topLeader ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={(value) =>
                                setGoals({ ...goals, topLeader: value })
                            }
                            value={goals.topLeader}
                        />
                    </View>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Entypo name="sound-mix" size={24} color="black" />
                            <Text style={styles.label}>Overall Athlete</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={goals.overAllAthlete ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={(value) =>
                                setGoals({ ...goals, overAllAthlete: value })
                            }
                            value={goals.overAllAthlete}
                        />
                    </View>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <FontAwesome5 name="trophy" size={24} color="black" />
                            <Text style={styles.label}>Activity Pro</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={goals.activityPro ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={(value) =>
                                setGoals({ ...goals, activityPro: value })
                            }
                            value={goals.activityPro}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={onSubmit}
                        style={styles.appButtonContainer}
                    >
                        <Text style={styles.appButtonText}>Submit Activity</Text>
                    </TouchableOpacity>
                    <Button title="Hide modal" onPress={() => closeModal()} />
                </>
            )}
            </ScrollView>
        </View>
    );
};

export default MyGoals;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,

        marginHorizontal: 20,
        justifyContent: "flex-start",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    heading: {
        color: Colors.light.text,
        fontWeight: "bold",
        marginRight: "auto",
        fontSize: 34,
        marginVertical: 10,
    },
    description: {
        color: Colors.light.text,
        marginRight: "auto",
        fontSize: 24,
        marginVertical: 5,
    },
    activityIndicatorContainer: {
        marginTop: 60,
    },
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    checkbox: {
        alignSelf: "center",
    },
    label: {
        margin: 8,
        fontSize: 16,
    },
    alertText: {
        color: "black",
        fontSize: 14,
        textAlign: "center",
    },
    alert: {
        backgroundColor: "#EEEEEE",
    },
    contentText: {
        textAlign: "center",
        paddingHorizontal: 20,
    },
    content: {
        display: "flex",
        backgroundColor: "#EEEEEE",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: -16,
        marginBottom: 16,
    },
    icon: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#3ec78c",
        width: "100%",
    },
    appButtonContainer: {
        elevation: 8,
        backgroundColor: Colors.light.tertiaryColor,
        borderRadius: 10,
        marginTop: 20,
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
    input: {
        marginVertical: 20,
        height: 44,
        paddingHorizontal: 10,
        borderRadius: 8,
        width: 100,
        maxWidth: 400,
        backgroundColor: Colors.light.secondary,
        borderWidth: 1,
    },
    title: {
        paddingTop: 30,
        fontSize: 26,
        color: Colors.light.text,
        fontWeight: "bold",
    },
    getStartedContainer: {
        flex: 1,
        width: "100%",
        paddingHorizontal: 40,
        backgroundColor: Colors.light.background,
        marginHorizontal: 10,
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
});
