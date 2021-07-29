import "react-native-gesture-handler"
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Text, View} from "react-native";
import { Button } from "react-native-paper";
import Options from "../../components/Options/index";
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";
import * as SQLite from 'expo-sqlite';
import { useState } from "react";

const db = SQLite.openDatabase('dados.db');

const HomeScreen = () => {
    const navigation = useNavigation();
    const [enviados, setEnviados] = useState(0);
    const [pendentes, setPendentes] = useState(0);

    function loadDados () {
        db.transaction(trx => {
            trx.executeSql(
                'SELECT * FROM Pacientes WHERE enviado = ?',
                [true],
                (_, { rows }) => setEnviados(rows.length));
            trx.executeSql(
                'SELECT * FROM Pacientes WHERE enviado = ?',
                [false],
                (_, { rows }) => setPendentes(rows.length));
        })
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadDados();
        });

        return unsubscribe;
    }, [navigation]);

    return(
        <View>
            <Options/>
            <Text style={styles.titulo}>Vacivida</Text>
            <Button style={styles.botaoCadastro}
                    children="Novo Cadastro"
                    onPress={() => {navigation.navigate('Cadastro')}}
                    color="#fff"
                    labelStyle={styles.botaoContent}
                    uppercase={false}
            />
            <Button style={styles.botaoFoto}
                    children="Foto de Documento"
                    onPress={() => {navigation.navigate('Camera')}}
                    color="#fff"
                    labelStyle={styles.botaoContent}
                    uppercase={false}
            />
            <View style={styles.secao}>
                <Text style={styles.nomeSecao}>PACIENTES CADASTRADOS</Text>
                <View>
                    <Text style={styles.conteudoUnico}>Carregamento completo</Text>
                    <Text style={styles.nPendentes}>{enviados}</Text>
                    <Button style={styles.botaoSecudario}
                        children=""
                        contentStyle={{width: 640, flexDirection: 'row-reverse'}}
                        icon={require('../../assets/arrow-right.png')}
                        onPress={() => navigation.navigate('Pacientes Carregados')}
                        color="#909090"
                    />
                </View>
                <View>
                    <Text style={styles.conteudoUnico}>Carregamento pendente</Text>
                    <Text style={styles.nPendentes}>{pendentes}</Text>
                    <Button style={styles.botaoSecudario}
                        children=""
                        contentStyle={{width: 640, flexDirection: 'row-reverse'}}
                        icon={require('../../assets/arrow-right.png')}
                        onPress={() => navigation.navigate('Pacientes Pendentes')}
                        color="#909090"
                    />
                </View>
            </View>
            <StatusBar style="dark" />
        </View>
    );
}

export default HomeScreen;
