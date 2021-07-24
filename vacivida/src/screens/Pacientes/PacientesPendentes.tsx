import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, {useState} from "react";
import { Text, View, TextInput, SafeAreaView} from "react-native";
import Options from "../../components/Options/index";
import ListaPacientes from "../../components/ListaPacientes/index";
import { styles } from "./styles";

export default function PacientesPendentes () {
    const [text, setText] = useState('');
    return(
        <SafeAreaView style={{flex: 1}}>
            <Options screenHome="Home" screenCadastro="Cadastro"/>
            <Text style={styles.titulo}>Pacientes Pendentes</Text>
            <View style={{width: 357, alignSelf: 'center',}}>
                <Text style={styles.nomeSecao}>Filtre pelo CPF</Text>
                <TextInput style={styles.busca}
                    onChangeText={text => setText(text)}
                    defaultValue={text}
                />
            </View>
            <SafeAreaView style={{flex: 1}}>
                <ListaPacientes screenDadosPaciente="Home"/>     
            </SafeAreaView>
            
            <StatusBar style="dark" />
        </SafeAreaView>
    );
}