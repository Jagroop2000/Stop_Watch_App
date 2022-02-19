import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import TimerScreen from "./TimerScreen";
import PreviousEntries from "./PreviousEntries";

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
    screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="TimerScreen" component={TimerScreen} />
      <Stack.Screen name="PreviousEntries" component={PreviousEntries} />
    </Stack.Navigator>
  );
}

export { MainStackNavigator };