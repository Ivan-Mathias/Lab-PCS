import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, {useEffect, useState} from "react";
import { Text, View, TextInput, SafeAreaView} from "react-native";
import Options from "../../components/Options/index";
import ListaPacientes from "../../components/ListaPacientes/index";
import { styles } from "./styles";
import { IconButton } from "react-native-paper";
import * as SQLite from 'expo-sqlite';
import Paciente from "../../types/paciente";
const db = SQLite.openDatabase('dados.db');

export default function PacientesCarregados () {
    const [text, setText] = useState('');
    const [pacientes, setPacientes] = useState<Paciente[]>([]);

    function loadDados () {

        db.transaction(trx => {
            trx.executeSql(
                'SELECT * FROM Pacientes WHERE enviado = 1',
                [],
                (_, { rows }) => {
                    const values = [];
                    for (let i = 0; i < rows.length; i++) {
                        values.push(rows.item(i));
                    }
                    setPacientes(values)
                });
        })
    }

    useEffect(() => {
        loadDados();
    }, []);

    return(
        <SafeAreaView style={{flex: 1}}>
            <Options/>
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
                <ListaPacientes pacientes={pacientes}/>
            </SafeAreaView>

            <StatusBar style="dark" />
        </SafeAreaView>
    );
}
