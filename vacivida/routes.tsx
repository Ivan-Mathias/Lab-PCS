import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";

import Cadastro from "./src/screens/Cadastro";
import Login from "./src/screens/Login";

const { Navigator, Screen } = createStackNavigator();

export default function Routes() {
    return(
        <NavigationContainer>
            <Navigator
                headerMode="none"
            >
                <Screen name="Home" component={Cadastro}/>
                <Screen name="SignIn" component={Login}/>
            </Navigator>
        </NavigationContainer>
    );
}
