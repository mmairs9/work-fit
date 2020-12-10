import { Text, View } from "./Themed";
import {
    Button,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    CheckBox,
    Platform,
    ActivityIndicator,
    Switch,
    ScrollView,
    Picker,
} from "react-native";
import React, { useState } from "react";
import Colors from "../constants/Colors";
import addGoals from "../services/addGoals.js";
import CustomActionSheet from "../components/CustomActionSheet";
import { FancyAlert } from "react-native-expo-fancy-alerts";
import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { get, map, sample } from "lodash";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

export const MyGoals = ({ closeModal }) => {
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [actionSheet, setActionSheet] = useState();
    const [goals, setGoals] = useState({
        dailyCalories: 0,
        dailySteps: 10000,
        workoutsPerWeek: 0,
        overAllAthlete: false,
        activityPro: true,
        topLeader: false,
        workoutStreaks: false,
    });

    const toggleAlert = React.useCallback(() => {
        if(visible){
            closeModal()
        }
        setVisible(!visible);
    }, [visible]);

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

    const goalSuccessPhrases = [
        "So you want to be the best at EVERYTHING?! Lets do it!",
        "It takes 10000 hours to excel in something. Lets get started.",
        "Develop a routine and you are sure to find success! Good luck with your goal.",
        "Winning comes with a price, there is always a loser!  Better workout now!",
        "Committment isnt easy, but I know you wont let me down!",
    ];

    const onSubmit = async () => {
        setIsLoading(true);
        await addGoals(goals);
        setIsLoading(false);
        toggleAlert();
    };

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
                selectedValue={goals.activityPro}
                onValueChange={(value) => {
                    setGoals({ ...goals, activityPro: value });
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
        <View
            style={[
                styles.container,
                { flex: 1, borderRadius: 20, marginVertical: 10 },
            ]}
        >
            <TouchableOpacity
                style={{ position: "absolute", top: 10, zIndex: 99, right: 0 }}
                onPress={() => closeModal()}
            >
                <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            <ScrollView>
                {isLoading ? (
                    <View style={styles.activityIndicatorContainer}>
                        <ActivityIndicator size="large" color={Colors.light.tint} />
                    </View>
                ) : (
                    <>
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
                                <TouchableOpacity
                                    onPress={toggleAlert}
                                    style={[styles.icon, { borderRadius: 32, zIndex: 9 }]}
                                >
                                    <View style={[styles.icon, { borderRadius: 32 }]}>
                                        <Ionicons
                                            name={Platform.select({
                                                ios: "ios-checkmark",
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
                                <Text style={styles.alertText}>
                                    {sample(goalSuccessPhrases)}
                                </Text>
                            </View>
                        </FancyAlert>
                        {!visible && (
                            <>
                                <Text style={styles.heading}>My Goals!</Text>
                                <Text style={styles.description}>
                                    Tell us what is driving you to Keep Up!
                                </Text>

                                <View style={[styles.row, {marginTop: 20}]}>
                                    <View style={styles.row}>
                                        <FontAwesome5 name="walking" size={24} color="black" />
                                        <Text style={[styles.label, { marginLeft: 20 }]}>
                                            Daily Steps:{" "}
                                        </Text>
                                    </View>
                                    <TextInput
                                        keyboardType="numeric"
                                        style={styles.input}
                                        onChangeText={(text) =>
                                            setGoals({ ...goals, dailySteps: text })
                                        }
                                        value={goals.dailySteps}
                                    />
                                </View>

                                <View style={styles.row}>
                                    <View style={styles.row}>
                                        <Ionicons name="ios-flame" size={24} color="black" />
                                        <Text style={[styles.label, { marginLeft: 20 }]}>
                                            Daily Calories:{" "}
                                        </Text>
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

                                <View style={[styles.row]}>
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
                                            marginVertical: 10,
                                        },
                                    ]}
                                >
                                    <View style={styles.row}>
                                        <MaterialIcons
                                            name="fitness-center"
                                            size={24}
                                            color="black"
                                        />
                                        <Text style={styles.label}>Top Leader</Text>
                                    </View>
                                    <Switch
                                        trackColor={{ false: "#767577", true: Colors.light.tint }}
                                        thumbColor={
                                            goals.topLeader ? Colors.light.tertiaryColor : "#f4f3f4"
                                        }
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={(value) =>
                                            setGoals({ ...goals, topLeader: value })
                                        }
                                        value={goals.topLeader}
                                    />
                                </View>
                                <View
                                    style={[
                                        styles.row,
                                        {
                                            marginVertical: 10,
                                        },
                                    ]}
                                >
                                    <View style={styles.row}>
                                        <Entypo name="sound-mix" size={24} color="black" />
                                        <Text style={styles.label}>Overall Athlete</Text>
                                    </View>
                                    <Switch
                                        trackColor={{ false: "#767577", true: Colors.light.tint }}
                                        thumbColor={
                                            goals.overAllAthlete
                                                ? Colors.light.tertiaryColor
                                                : "#f4f3f4"
                                        }
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={(value) =>
                                            setGoals({ ...goals, overAllAthlete: value })
                                        }
                                        value={goals.overAllAthlete}
                                    />
                                </View>
                                <View
                                    style={[
                                        styles.row,
                                        {
                                            marginVertical: 10,
                                        },
                                    ]}
                                >
                                    <View style={styles.row}>
                                        <FontAwesome5 name="trophy" size={24} color="black" />
                                        <Text style={styles.label}>Activity Pro</Text>
                                    </View>

                                    <TouchableOpacity
                                        testID="picker"
                                        onPress={showPicker}
                                        style={{
                                            borderBottomWidth: 1,
                                            borderColor: "#e4e4e4",
                                            marginTop: 0,
                                        }}
                                    >
                                        <Text style={[styles.input, { paddingTop: 10 }]}>
                                            {goals.activityPro}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </>
                )}
            </ScrollView>

            <TouchableOpacity onPress={onSubmit} style={styles.appButtonContainer}>
                <Text style={styles.appButtonText}>Save Goals</Text>
            </TouchableOpacity>
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
        marginTop: 5,
        marginBottom: 20
    },
    activityIndicatorContainer: {
        marginTop: 250,
    },
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    pickerOverlay: {
        backgroundColor: "white",
        marginBottom: 10,
        borderRadius: 5,
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
        marginVertical: 10,
        height: 44,
        paddingHorizontal: 10,
        borderRadius: 8,
        width: 100,
        textAlign: "right",
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
