import React from "react";
import { useState } from "react";
import { View, Text } from "react-native";
import EtapaBasica, { DadosBase } from "./Etapas/EtapaBasica";
import EtapaEndereco, { DadosEndereco } from "./Etapas/EtapaEndereco";
import EtapaVacina, { DadosVacina } from "./Etapas/EtapaVacina";
import Options from "../../components/Options/index";

import { styles } from "./styles";
import { useEffect } from "react";

import * as SQLite from 'expo-sqlite';
import { useNavigation } from "@react-navigation/native";

export default function Cadastro () {
    const db = SQLite.openDatabase('dados.db');
    const navigation = useNavigation();
    const [etapa, setEtapa] = useState(0);
    const [dadosBase, setDadosBase] = useState<DadosBase>({
        nome: 'Ivanzao',
        cpf: 78923465,
        cns: 2390847,
        telefone: 2038947,
        nascimento: '23089',
        sexo: 'Masculino',
        raca: 'Branco',
        gestante: false,
        puerpera: false
    });
    const [dadosEndereco, setDadosEndereco] = useState<DadosEndereco>({
        nomeSocial: '',
        nomeDaMae: 'Josefina',
        pais: 'Brasil',
        uf: 'SP',
        municipio: 'São Paulo',
        zona: 'rural',
        logradouro: 'Rua Pedro Afonso',
        numero: 2345,
        bairro: 'perdizes',
        complemento: '',
        email: 'pintomole@gmail.com'
    });
    const [dadosVacina, setDadosVacina] = useState<DadosVacina>({
        imunobiologico: 'astrazeneca',
        data: '12/03/2021',
        segundaDose: false,
        lote: 2345
    });
    const [enviar, setEnviar] = useState(false);

    function EtapaAtual () {
        switch (etapa) {
            case 0:
                return (
                    <EtapaBasica
                        initialValues={dadosBase}
                        handleSubmit={handleDadosBase}
                    />
                )
            case 1:
                return (
                    <EtapaEndereco
                        initialValues={dadosEndereco}
                        handleVoltar={handleVoltar}
                        handleSubmit={handleDadosEndereco}
                    />
                )
            case 2:
                return (
                    <EtapaVacina
                        initialValues={dadosVacina}
                        handleVoltar={handleVoltar}
                        handleSubmit={handleDadosVacina}
                    />
                )
            default:
                return null;
        }
    }

    function handleVoltar() {
        if(etapa >= 0){
            setEtapa(etapa - 1)
        }
    }

    function handleDadosBase (dados: DadosBase) {
        setDadosBase(dados);
        setEtapa(etapa + 1)
    }

    function handleDadosEndereco (dados: DadosEndereco) {
        setDadosEndereco(dados);
        setEtapa(etapa + 1)
    }

    function handleDadosVacina (dados: DadosVacina) {
        setDadosVacina(dados);
        setEnviar(true);
    }

    function enviarDados () {
        db.transaction(trx => {
            trx.executeSql(
                "INSERT INTO Pacientes \
                (nome, cpf, cns, telefone, nascimento, sexo, raca, \
                gestante, puerpera, nomeSocial, nomeDaMae, pais, uf, \
                municipio, zona, logradouro, numero, bairro, complemento, \
                email, imunobiologico, data, segundaDose, lote) \
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [dadosBase.nome, dadosBase.cpf, dadosBase.cns, dadosBase.telefone, dadosBase.nascimento, dadosBase.sexo, dadosBase.raca,
                dadosBase.gestante, dadosBase.puerpera, dadosEndereco.nomeSocial, dadosEndereco.nomeDaMae, dadosEndereco.pais, dadosEndereco.uf,
                dadosEndereco.municipio, dadosEndereco.zona, dadosEndereco.logradouro, dadosEndereco.numero, dadosEndereco.bairro,
                dadosEndereco.complemento, dadosEndereco.email, dadosVacina.imunobiologico, dadosVacina.data, dadosVacina.segundaDose, dadosVacina.lote],
                result => console.log(result)
            );
            navigation.navigate("Home")
        },
        error => console.log(error));
    }

    function createTable () {
        db.transaction(trx => {
            trx.executeSql(
                "CREATE TABLE IF NOT EXISTS Pacientes \
                (id INTEGER PRIMARY KEY NOT NULL, \
                nome TEXT NOT NULL, \
                cpf INT NOT NULL, \
                cns INT NOT NULL, \
                telefone INT NOT NULL, \
                nascimento TEXT NOT NULL, \
                sexo TEXT NOT NULL, \
                raca TEXT NOT NULL, \
                gestante BOOLEAN NOT NULL, \
                puerpera BOOLEAN NOT NULL, \
                nomeSocial TEXT, \
                nomeDaMae TEXT NOT NULL, \
                pais TEXT NOT NULL, \
                uf TEXT NOT NULL, \
                municipio TEXT NOT NULL, \
                zona TEXT NOT NULL, \
                logradouro TEXT NOT NULL, \
                numero INT NOT NULL, \
                bairro TEXT NOT NULL, \
                complemento TEXT, \
                email TEXT NOT NULL, \
                imunobiologico TEXT NOT NULL, \
                data TEXT NOT NULL, \
                segundaDose BOOLEAN NOT NULL, \
                lote INT NOT NULL);"
              );
        });
    }

    useEffect(() => {
        createTable();
    }, []);

    useEffect(() => {
        enviar && enviarDados();
    }, [enviar]);

    return(
        <View style={{flex: 1}}>
            <View>
                <Options/>
            </View>
            <View style={styles.container}>
                <Text style={styles.titulo}>Cadastro</Text>
                <Text style={styles.subtitulo}>Entre com os dados do paciente</Text>
                <View style={styles.campos}>
                    <EtapaAtual/>
                </View>
                <View style={styles.linha}/>
            </View>
        </View>
    );
}
