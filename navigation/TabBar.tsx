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
import { NavigationState } from '@react-navigation';
import MyActivityScreen from "../screens/MyActivityScreen";
import LeaderBoardScreen from "../screens/LeaderBoardScreen";
import AddActivityScreen from "../screens/AddActivityScreen";
import UserActivityScreen from "../screens/UserActivityScreen";
import {createStackNavigator} from "@react-navigation/stack";
const BottomBar = createBottomTabNavigator();

type Props = {
    barColor: string,
};
function TabBarIcon(props: { name: string; color: string }) {
    return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

const LeaderBoardStack = createStackNavigator();

const getActiveRouteState = function (route: NavigationState): NavigationState {
    if (!route.routes || route.routes.length === 0 || route.index >= route.routes.length) {
        return route;
    }

    const childActiveRoute = route.routes[route.index] as NavigationState;
    return getActiveRouteState(childActiveRoute);
}

function LeaderBoardNavigator(props) {
    console.log(props)
    return (
        <LeaderBoardStack.Navigator>
            <LeaderBoardStack.Screen
                name="LeaderBoardScreen"
                component={LeaderBoardScreen}
                options={{ headerTitle: 'Back', headerShown: false }}
            />
            <LeaderBoardStack.Screen
                name="UserActivityScreen"
                component={UserActivityScreen}
                options={{ headerTitle: 'User Activity', headerShown: false }}
            />
        </LeaderBoardStack.Navigator>
    );
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
                activeTintColor: Colors.light.tint,
                activebackgroundColor: Colors.light.background,
                showIcon: true,
                style: styles.navigator,
                tabStyle: {
                    backgroundColor: barColor,
                },
            }}
        >
            <BottomBar.Screen
                name="My Activity"
                component={MyActivityScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="ios-speedometer" size={24} color={color} />
                    ),
                    tabStyle: {
                        color: 'red',
                    }
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
                component={LeaderBoardNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="ios-trophy" size={24} color={color} />
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
