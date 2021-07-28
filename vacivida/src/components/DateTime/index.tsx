import "react-native-gesture-handler"
import React from "react";
import { Text, View } from "react-native";


export default function DataTempo () {
    const date = new Date();
    const dia = date.getDate();
    const mes = date.getMonth();
    const ano = date.getUTCFullYear();
    let diastr = dia.toString();
    let messtr = mes.toString();

    if (dia < 10)
        diastr = "0" + diastr;
    
    if (mes < 10)
        messtr = "0" + messtr;
    return(
        <View>
            <Text>{diastr}/{messtr}/{ano}</Text>
        </View>
    );
}