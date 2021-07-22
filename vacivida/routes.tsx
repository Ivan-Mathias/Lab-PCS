import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";

import Cadastro from "./src/screens/Cadastro";
import Login from "./src/screens/Login";
import MeuPerfil from "./src/screens/MeuPerfil";
import PacientesPendentes from "./src/screens/Pacientes/PacientesPendentes";
import PacientesCarregados from "./src/screens/Pacientes/PacientesCarregados";

const { Navigator, Screen } = createStackNavigator();

export default function Routes() {
    return(
        <NavigationContainer>
            <Navigator
                headerMode="none"
            >
                <Screen name="Home" component={Cadastro}/>
                <Screen name="SignIn" component={Login}/>
                <Screen name="Meu Perfil" component={MeuPerfil}/>
                <Screen name="Pacientes Carregados" component={PacientesCarregados}/>
                <Screen name="Pacientes Pendentes" component={PacientesPendentes}/>
            </Navigator>
        </NavigationContainer>
    );
}
