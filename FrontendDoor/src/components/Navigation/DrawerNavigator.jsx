import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import EditProfile from "../User/EditProfile";
import Historical from "../User/Historical";


const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Perfil" component={EditProfile} />
      <Drawer.Screen name="Historical" component={Historical} />
    </Drawer.Navigator>
  );
}


function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    </View>
  );
}

export default DrawerNavigator;