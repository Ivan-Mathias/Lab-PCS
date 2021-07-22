import "react-native-gesture-handler"
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, View} from "react-native";
import { Button } from "react-native-paper";
import Options from "../../components/Options/index";
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";

const MeuPerfilScreen = () => {
    const navigation = useNavigation();
    return(
        <View>
            <Options screenMeuPerfil="Meu Perfil" screenCadastro="Home"/>            
            <Text style={styles.titulo}>Meu Perfil</Text>
            <View style={styles.secao}>
                <Text style={styles.nomeSecao}>E-MAIL</Text>
                <Text style={styles.conteudoSecao}>exemplo@gmail.com</Text>
            </View>
            <View style={styles.secao}>
                <Text style={styles.nomeSecao}>SENHA</Text>
                <Text style={styles.conteudoSecao}>••••••••••</Text>
            </View>
            <View style={styles.secao}>
                <Text style={styles.nomeSecao}>PACIENTES CADASTRADOS</Text>
                <View>
                    <Text style={styles.conteudoUnico}>Carregamento completo</Text>
                    <Button style={{position: 'absolute', top: 4, width: 360, alignSelf: 'center'}}
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
                    <Button style={{position: 'absolute', top: 4, width: 360, alignSelf: 'center'}}
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

export default MeuPerfilScreen;