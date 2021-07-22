import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, {useState} from "react";
import { Text, View, TextInput, SafeAreaView} from "react-native";
import Options from "../../components/Options/index";
import ListaPacientes from "../../components/ListaPacientes/index";
import { styles } from "./styles";

export default function PacientesCarregados () {
    const [text, setText] = useState('');
    return(
        <SafeAreaView style={{flex: 1}}>
            <Options screenMeuPerfil="Meu Perfil" screenCadastro="Home"/>            
            <Text style={styles.titulo}>Pacientes Carregados</Text>
            <View style={{width: 357, alignSelf: 'center',}}>
                <Text style={styles.nomeSecao}>Filtre pelo CPF</Text>
                <TextInput style={styles.busca}
                    onChangeText={text => setText(text)}
                    defaultValue={text}
                />
            </View>
            <SafeAreaView style={{flex: 1}}>
                <ListaPacientes screenDadosPaciente="Meu Perfil"/>     
            </SafeAreaView>
            
            <StatusBar style="dark" />
        </SafeAreaView>
    );
}