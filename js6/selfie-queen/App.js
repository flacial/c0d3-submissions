import { useState, useEffect } from "react";
import { Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import TakeSnap from './Views/TakeSnap';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Gallery from "./Views/Gallery";

const sendTo = "https://laicalf.freedomains.dev/p8/api/snap";

const App = () => {
  const [hasPermission, setHasPermission] = useState(null);

  const askForCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  }

  useEffect(askForCameraPermission, []);

  const Tab = createBottomTabNavigator();

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const screenOptionsConfig = ({ route }) => ({
    tabBarIcon: ({ focused }) => {
      let iconName;

      if (route.name === 'Snap') {
        iconName = focused
          ? 'camera'
          : 'camera-outline';
      } else if (route.name === 'Gallery') {
        iconName = focused ? 'image' : 'image-outline';
      }

      return <Ionicons name={iconName} size={24} color={focused ? "#6768f3" : "hsl(0, 0%, 60%)"} />;
    },
    tabBarBadgeStyle: {
      backgroundColor: "hsl(0, 0%, 90%)"
    },
    tabBarActiveTintColor: "#6768f3",
    tabBarInactiveTintColor: "hsl(0, 0%, 60%)",
    cardStyle: {
      backgroundColor: "#000"
    },
    headerShown: false,
  })


  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptionsConfig}>
        <Tab.Screen name="Snap" component={TakeSnap("4:3", sendTo)} />
        <Tab.Screen name="Gallery" component={Gallery} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
