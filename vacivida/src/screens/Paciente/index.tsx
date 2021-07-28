import React from "react";
import { useState } from "react";
import { View, Text } from "react-native";
import Options from "../../components/Options/index";

import { styles } from "../Cadastro/styles";

import { RouteProp, useNavigation } from "@react-navigation/native";
import EtapaBasica, { DadosBase } from "../Cadastro/Etapas/EtapaBasica";
import EtapaEndereco, { DadosEndereco } from "../Cadastro/Etapas/EtapaEndereco";
import EtapaVacina, { DadosVacina } from "../Cadastro/Etapas/EtapaVacina";

import { Paciente as PacienteType } from '../../types/paciente';

type PacienteProps = {
    route: RouteProp<{ params: { dados: PacienteType } }, 'params'>
}

export default function Paciente ({
    route: { params: { dados } }
}: PacienteProps) {
    const navigation = useNavigation();
    const [etapa, setEtapa] = useState(0);

    function EtapaAtual () {
        switch (etapa) {
            case 0:
                return (
                    <EtapaBasica
                        viewOnly
                        initialValues={dados as DadosBase}
                        handleSubmit={() => setEtapa(1)}
                    />
                )
            case 1:
                return (
                    <EtapaEndereco
                        viewOnly
                        initialValues={dados as DadosEndereco}
                        handleVoltar={() => setEtapa(0)}
                        handleSubmit={() => setEtapa(2)}
                    />
                )
            case 2:
                return (
                    <EtapaVacina
                        viewOnly
                        initialValues={dados as DadosVacina}
                        handleVoltar={() => setEtapa(1)}
                        handleSubmit={handleVoltar}
                    />
                )
            default:
                return null;
        }
    }

    function handleVoltar() {
        navigation.goBack()
    }

    return(
        <View style={{flex: 1}}>
            <View>
                <Options/>
            </View>
            <View style={styles.container}>
                <Text style={styles.titulo}>Paciente</Text>
                <View style={styles.campos}>
                    <EtapaAtual/>
                </View>
                <View style={styles.linha}/>
            </View>
        </View>
    );
}
