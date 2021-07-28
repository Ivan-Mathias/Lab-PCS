import 'react-native-gesture-handler';
import React from 'react';
import { Text, FlatList, SafeAreaView} from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { styles } from "./styles";
import Paciente from '../../types/paciente';

type ListaPacientesProps = {
    pacientes: Paciente[];
}

export default function ListaPacientes ({ pacientes }: ListaPacientesProps) {
    const navigation = useNavigation();
    return(
        <SafeAreaView style={{paddingVertical: 20}}>
            <FlatList
                data={pacientes.map(paciente => {
                    return {
                        key: paciente.id.toString(),
                        nome: paciente.nome,
                        pendente: true,
                        dados: paciente
                    }
                })}
                renderItem={({item}) =>
                    <SafeAreaView style={styles.secao}>
                        <Text style={styles.conteudoSecao}>{item.nome}</Text>
                        <Button style={styles.botaoSecudario}
                            children=""
                            contentStyle={{width: 640, flexDirection: 'row-reverse'}}
                            icon={require('../../assets/arrow-right.png')}
                            onPress={() => navigation.navigate("Paciente", { dados: item.dados })}
                            color="#909090"
                        />
                    </SafeAreaView>
                }
            />
        </SafeAreaView>
    );
}
