import 'react-native-gesture-handler';
import React from 'react';
import { Text, FlatList, SafeAreaView} from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { styles } from "./styles";

type ListaPacientesProps = {
    screenDadosPaciente: string;
}

export default function ListaPacientes ({screenDadosPaciente}: ListaPacientesProps) {
    const navigation = useNavigation();
    return(
        <SafeAreaView style={{paddingVertical: 20}}>
            <FlatList
                data={[
                    {   nome: 'Maria',
                    pendente: false,
                    key: '1'},
                    {   nome: 'João Exemplo Fulano dos Santos',
                    pendente: true,
                    key: '2'},
                    {   nome: 'José Exemplo Fulano dos Santos',
                    pendente: true,
                    key: '3'},
                    {   nome: 'Cláudia Exemplo Fulano dos Santos',
                    pendente: true,
                    key: '4'},
                    {   nome: 'Kátia Exemplo Fulano dos Santos',
                    pendente: false,
                    key: '5'},
                    {   nome: 'Armando Exemplo Fulano dos Santos',
                    pendente: true,
                    key: '6'},
                    {   nome: 'Rafael Exemplo Fulano dos Santos',
                    pendente: true,
                    key: '7'},
                    {   nome: 'Fernando Exemplo Fulano dos Santos',
                    pendente: true,
                    key: '8'},
                    {   nome: 'Simone Exemplo Fulano dos Santos',
                    pendente: true,
                    key: '9'},
                    {   nome: 'Laís Exemplo Fulano dos Santos',
                    pendente: false,
                    key: '10'},
                    {   nome: 'Beatriz Exemplo Fulano dos Santos',
                    pendente: true,
                    key: '11'},
                    {   nome: 'Carlos Exemplo Fulano dos Santos',
                    pendente: false,
                    key: '12'},
                    {   nome: 'Vinicius Exemplo Fulano dos Santos',
                    pendente: true,
                    key: '13'},
                    {   nome: 'Matheus Exemplo Fulano dos Santos',
                    pendente: false,
                    key: '14'},
                    {   nome: 'Antonio Exemplo Fulano dos Santos',
                    pendente: false,
                    key: '15'},
                ]}
                renderItem={({item}) => 
                    <SafeAreaView style={styles.secao}>
                        <Text style={styles.conteudoSecao}>{item.nome}</Text>
                        <Button style={{position: 'absolute', top: 4, width: 360, alignSelf: 'center'}}
                            children=""
                            contentStyle={{width: 640, flexDirection: 'row-reverse'}}
                            icon={require('../../assets/arrow-right.png')}
                            onPress={() => navigation.navigate(screenDadosPaciente)}
                            color="#909090"
                        />
                    </SafeAreaView>
                }
            />
        </SafeAreaView>
    );
}