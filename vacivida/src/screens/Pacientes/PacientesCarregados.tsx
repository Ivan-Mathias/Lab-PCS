import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, {useState} from "react";
import { Text, View, TextInput, SafeAreaView} from "react-native";
import Options from "../../components/Options/index";
import ListaPacientes from "../../components/ListaPacientes/index";
import { styles } from "./styles";
import { IconButton } from "react-native-paper";

export default function PacientesCarregados () {
    const [text, setText] = useState('');
    return(
        <SafeAreaView style={{flex: 1}}>
            <Options screenHome="Home" screenCadastro="Cadastro"/>            
            <Text style={styles.titulo}>Pacientes Carregados</Text>
            <View style={{width: 380, alignSelf: 'center'}}>
                <Text style={styles.nomeSecao}>Filtre pelo nome</Text>
                <TextInput style={styles.busca}
                    onChangeText={text => setText(text)}
                    defaultValue={text}
                />
                <IconButton style={styles.searchIcon}
                    icon={require('../../assets/search.png')}
                    size = {28}
                    onPress={() => null}
                    color="#909090"
                />
            </View>
            <SafeAreaView style={{flex: 1}}>
                <ListaPacientes screenDadosPaciente="Home"/>     
            </SafeAreaView>
            
            <StatusBar style="dark" />
        </SafeAreaView>
    );
}