import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, {useEffect, useState} from "react";
import { Text, View, TextInput, SafeAreaView} from "react-native";
import Options from "../../components/Options/index";
import ListaPacientes from "../../components/ListaPacientes/index";
import { styles } from "./styles";
import { Button, IconButton } from "react-native-paper";
import * as SQLite from 'expo-sqlite';
import Paciente from "../../types/paciente";
const db = SQLite.openDatabase('dados.db');

export default function PacientesPendentes () {
    const [text, setText] = useState('');
    const [pacientes, setPacientes] = useState<Paciente[]>([]);

    function loadDados () {

        db.transaction(trx => {
            trx.executeSql(
                'SELECT * FROM Pacientes WHERE enviado = 0',
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

    async function enviarDados () {
        if(pacientes.length > 0) {
            try {
                const controller = new AbortController();
                const id = setTimeout(() => controller.abort(), 5000);
                await fetch('http://192.168.0.19:3344/test', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(pacientes),
                    signal: controller.signal
                });
                clearTimeout(id);

                db.transaction(trx => {
                    for (let i = 0; i < pacientes.length; i++) {
                        console.log("atualizando paciente ", pacientes[i].id)
                        trx.executeSql(
                            "UPDATE Pacientes \
                            SET enviado = 1 \
                            WHERE id = ?",
                            [pacientes[i].id]
                        );
                    }
                });
            } catch (error) {
                console.log(error);
            }
            loadDados();
        }
    }

    useEffect(() => {
        loadDados();
    }, []);

    return(
        <SafeAreaView style={{flex: 1}}>
            <Options/>
            <Text style={styles.titulo}>Pacientes Pendentes</Text>
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

            {pacientes.length > 0 && (
                <Button
                    style={styles.botao}
                    children="Reenviar"
                    onPress={enviarDados}
                    color="#fff"
                    labelStyle={styles.botaoContent}
                    uppercase={false}
                />
            )}
            <StatusBar style="dark" />
        </SafeAreaView>
    );
}
