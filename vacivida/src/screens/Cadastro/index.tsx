import React from "react";
import { useState } from "react";
import { View, Text } from "react-native";
import EtapaBasica, { DadosBase } from "./Etapas/EtapaBasica";
import EtapaEndereco, { DadosEndereco } from "./Etapas/EtapaEndereco";
import EtapaVacina, { DadosVacina } from "./Etapas/EtapaVacina";
import Options from "../../components/Options/index";

import { styles } from "./styles";

export default function Cadastro () {
    const [etapa, setEtapa] = useState(0);
    const [dadosBase, setDadosBase] = useState<DadosBase>();
    const [DadosEndereco, setDadosEndereco] = useState<DadosEndereco>();
    const [DadosVacina, setDadosVacina] = useState<DadosVacina>();

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
                        initialValues={DadosEndereco}
                        handleVoltar={handleVoltar}
                        handleSubmit={handleDadosEndereco}
                    />
                )
            case 2:
                return (
                    <EtapaVacina
                        initialValues={DadosVacina}
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
        console.log(dadosBase, DadosEndereco, DadosVacina)
    }

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
