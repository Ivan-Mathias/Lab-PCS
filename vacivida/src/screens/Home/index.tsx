import "react-native-gesture-handler"
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, View} from "react-native";
import { Button } from "react-native-paper";
import Options from "../../components/Options/index";
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
    const navigation = useNavigation();
    return(
        <View>
            <Options screenHome="Home" screenCadastro="Cadastro"/>            
            <Text style={styles.titulo}>Vacivida</Text>
            <Button style={styles.botaoCadastro}
                    onPress={() => {navigation.navigate('Cadastro')}}
                    color="#fff"
                    labelStyle={styles.botaoContent}
                    uppercase={false}
            >Novo Cadastro</Button>
            <View style={styles.secao}>
                <Text style={styles.nomeSecao}>PACIENTES CADASTRADOS</Text>
                <View>
                    <Text style={styles.conteudoUnico}>Carregamento completo</Text>
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
                    <Text style={styles.nPendentes}>27</Text>
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
