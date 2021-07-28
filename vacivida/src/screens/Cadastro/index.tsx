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
import { RouteProp, useNavigation } from "@react-navigation/native";

type CadastroProps = {
    route: RouteProp<{ params: { dados: any } }, 'params'>
}
export default function Cadastro({ route: { params } }: CadastroProps) {
    const db = SQLite.openDatabase('dados.db');
    const navigation = useNavigation();
    const [etapa, setEtapa] = useState(0);
    const [dadosBase, setDadosBase] = useState<DadosBase>();
    const [dadosEndereco, setDadosEndereco] = useState<DadosEndereco>();
    const [dadosVacina, setDadosVacina] = useState<DadosVacina>();
    const [enviar, setEnviar] = useState(false);

    if (params != null && params.dados != null && dadosBase === undefined) {
        const dados = params.dados;
        setDadosBase({
            nome: dados == null ? null : dados['nome'],
            cpf: dados == null ? null : dados['cpf'],
            cns: null,
            telefone: null,
            nascimento: dados == null ? null : dados['nascimento'],
            sexo: null,
            raca: null,
            gestante: false,
            puerpera: false,
        });
        setDadosEndereco({
            nomeSocial: '',
            nomeDaMae: dados == null ? '' : dados['nomeMae'],
            pais: '',
            uf: '',
            municipio: '',
            zona: '',
            logradouro: '',
            numero: 0,
            bairro: '',
            complemento: undefined,
            email: '',
        });
    }

    function EtapaAtual() {
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
        if (etapa >= 0) {
            setEtapa(etapa - 1)
        }
    }

    function handleDadosBase(dados: DadosBase) {
        setDadosBase(dados);
        setEtapa(etapa + 1)
    }

    function handleDadosEndereco(dados: DadosEndereco) {
        setDadosEndereco(dados);
        setEtapa(etapa + 1)
    }

    function handleDadosVacina(dados: DadosVacina) {
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
                [dadosBase?.nome, dadosBase?.cpf, dadosBase?.cns, dadosBase?.telefone, dadosBase?.nascimento, dadosBase?.sexo, dadosBase?.raca,
                dadosBase?.gestante, dadosBase?.puerpera, dadosEndereco?.nomeSocial, dadosEndereco?.nomeDaMae, dadosEndereco?.pais, dadosEndereco?.uf,
                dadosEndereco?.municipio, dadosEndereco?.zona, dadosEndereco?.logradouro, dadosEndereco?.numero, dadosEndereco?.bairro,
                dadosEndereco?.complemento, dadosEndereco?.email, dadosVacina?.imunobiologico, dadosVacina?.data, dadosVacina?.segundaDose, dadosVacina?.lote],
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
                <Options />
            </View>
            <View style={styles.container}>
                <Text style={styles.titulo}>Cadastro</Text>
                <Text style={styles.subtitulo}>Entre com os dados do paciente</Text>
                <View style={styles.campos}>
                    <EtapaAtual />
                </View>
                <View style={styles.linha} />
            </View>
        </View>
    );
}
