import React from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
    BottomTabBar,
    createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {FontAwesome as Icon, Ionicons} from "@expo/vector-icons";
import { TabBarAdvancedButton } from "../components/TabBarAdvancedButton";
import { IS_IPHONE_X } from "../utils";
import Colors from "../constants/Colors";
import MyActivityScreen from "../screens/MyActivityScreen";
import LeaderBoardScreen from "../screens/LeaderBoardScreen";
import AddActivityScreen from "../screens/AddActivityScreen";
const BottomBar = createBottomTabNavigator();

type Props = {
    barColor: string,
};
function TabBarIcon(props: { name: string; color: string }) {
    return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

export const TabBar: React.FC<Props> = ({ barColor }) => (
    <NavigationContainer>
        <BottomBar.Navigator
            tabBar={(props) => (
                <View style={styles.navigatorContainer}>
                    <BottomTabBar {...props} />
                    {IS_IPHONE_X && (
                        <View
                            style={[
                                styles.xFillLine,
                                {
                                    backgroundColor: barColor,
                                },
                            ]}
                        />
                    )}
                </View>
            )}
            tabBarOptions={{
                activebackgroundColor: Colors.light.background,
                showIcon: true,
                style: styles.navigator,
                tabStyle: {
                    backgroundColor: barColor,
                },
            }}
        >
            <BottomBar.Screen
                name="My Goals"
                component={MyActivityScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="ios-speedometer" size={24} color={Colors.light.tint} />
                    ),
                }}
            />
            <BottomBar.Screen
                name="Add"
                component={AddActivityScreen}
                options={{
                    tabBarButton: (props) => (
                        <TabBarAdvancedButton bgColor={barColor} {...props} />
                    ),
                }}
            />
            <BottomBar.Screen
                name="Leader board"
                component={LeaderBoardScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="ios-trophy" size={24} color={Colors.light.tint} />
                    ),
                }}
            />
        </BottomBar.Navigator>
    </NavigationContainer>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navigatorContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    navigator: {
        borderTopWidth: 0,
        backgroundColor: Colors.light.background,
        elevation: 30,
    },
    button:{
        color: Colors.light.tint
    },
    xFillLine: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 34,
    },
});
